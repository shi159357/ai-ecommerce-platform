"""
Vercel Postgres 数据库连接模块

使用 asyncpg 连接池，兼容 Vercel Serverless 冷启动。
从环境变量 DATABASE_URL 读取连接字符串。

使用方式：
    from database import get_pool, query, execute

    pool = await get_pool()
    rows = await query("SELECT * FROM products WHERE status = $1", "active")
"""
import os
import asyncio
from typing import Any, Optional

import asyncpg

from config.settings import settings

# 全局连接池（Vercel Serverless 中会在模块级别缓存）
_pool: Optional[asyncpg.Pool] = None
_pool_lock = asyncio.Lock()


def _get_database_url() -> str:
    """获取数据库连接字符串，优先级递减"""
    # Vercel Postgres 注入的环境变量
    candidates = [
        settings.DATABASE_URL,
        settings.POSTGRES_URL_NON_POOLING,  # Vercel 推荐 serverless 用 non-pooling
        settings.POSTGRES_URL,
    ]
    for url in candidates:
        if url and url.startswith("postgres"):
            return url
    raise RuntimeError(
        "未配置数据库连接字符串。请在 Vercel 项目 Settings > Environment Variables 中设置 DATABASE_URL。"
    )


async def get_pool() -> asyncpg.Pool:
    """获取或创建 asyncpg 连接池（模块级单例，支持并发安全初始化）"""
    global _pool

    if _pool is not None:
        try:
            async with _pool.acquire() as conn:
                await conn.execute("SELECT 1")
            return _pool
        except Exception:
            _pool = None

    async with _pool_lock:
        if _pool is not None:
            return _pool

        database_url = _get_database_url()

        _pool = await asyncpg.create_pool(
            dsn=database_url,
            min_size=1,
            max_size=5,  # Serverless 限制连接数
            command_timeout=10,
            ssl="require",  # Vercel Postgres 强制 SSL
        )
        return _pool


async def query(sql: str, *args: Any) -> list[asyncpg.Record]:
    """执行查询并返回所有行"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetch(sql, *args)


async def execute(sql: str, *args: Any) -> str:
    """执行写操作（INSERT/UPDATE/DELETE）"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.execute(sql, *args)


async def fetch_one(sql: str, *args: Any) -> Optional[asyncpg.Record]:
    """执行查询并返回第一行"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetchrow(sql, *args)


async def close_pool():
    """关闭连接池（用于本地开发优雅关闭）"""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
