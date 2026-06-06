"""
AI跨境电商 一人公司 — 主入口
FastAPI + 自动化调度 + 自修复
"""
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import settings
from api.routes import router
from automation.scheduler import automation_scheduler
from agents.auto_heal import auto_heal_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时
    print("=" * 60)
    print(f"  {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"  AI跨境电商 · 一人公司运营平台")
    print("=" * 60)

    # 启动自动化调度器
    automation_scheduler.start()

    # 启动时执行一次健康检查
    await auto_heal_engine.health_check()

    print(f"  API 服务: http://{settings.HOST}:{settings.PORT}")
    print(f"  API 文档: http://{settings.HOST}:{settings.PORT}/docs")
    print("=" * 60)

    yield

    # 关闭时
    print("[系统] 正在安全关闭...")
    automation_scheduler.shutdown()
    print("[系统] 已关闭")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="全栈式AI自动化跨境电商管理平台",
    lifespan=lifespan,
)

# CORS 跨域支持
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "health": "/api/v1/system/health",
    }


@app.get("/health")
async def health():
    """健康检查端点（用于Vercel/Railway监控）"""
    return {"status": "ok", "timestamp": __import__("datetime").datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
