"""
Vercel Serverless Functions 入口 — Python Runtime
将 FastAPI app 导出为 Vercel 兼容的 ASGI handler
"""
import sys
import os

# 确保 backend/ 目录在 import path 中
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Vercel 环境标记：禁用长驻进程（Scheduler 等）
os.environ.setdefault("VERCEL_ENV", "1")

from main import app

# Vercel Python Runtime 自动识别 FastAPI/Starlette app 并包装为 ASGI handler
# 无需手动 Mangum 包装 — Vercel 内置了对 FastAPI 的支持
