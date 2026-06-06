"""
API路由 — 为前端可视化后台提供数据接口
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from datetime import datetime
import random

from models.schemas import BusinessMode, ProductStatus, OrderStatus
from agents.selector import selector_engine
from agents.auto_heal import auto_heal_engine
from automation.scheduler import automation_scheduler
from automation.updater import auto_updater

router = APIRouter(prefix="/api/v1")

# ==================== 运营总览 ====================

@router.get("/dashboard/stats")
async def get_dashboard_stats(mode: str = "all"):
    """获取运营总览数据"""
    return {
        "mode": mode,
        "revenue": {
            "today": 12850 + random.randint(-500, 500),
            "yesterday": 11320,
            "week": 87450,
            "month": 352800,
        },
        "orders": {"total": 2847, "pending": 43, "shipped": 2610, "returned": 12},
        "products": {"active": 568, "pending": 24, "out_of_stock": 8},
        "profit": {"gross": 352800, "net": 98784, "margin": 28},
        "ai_metrics": {"selections": 12240, "listings": 3560, "replies": 8920, "accuracy": 94.3},
        "system_health": auto_heal_engine.get_status(),
        "updated_at": datetime.now().isoformat(),
    }

@router.get("/dashboard/revenue-chart")
async def get_revenue_chart():
    """本周营收趋势"""
    return [
        {"date": f"6/{d}", "revenue": 45000 + random.randint(-3000, 8000),
         "profit": 12000 + random.randint(-2000, 4000)}
        for d in range(1, 8)
    ]

@router.get("/dashboard/platform-breakdown")
async def get_platform_breakdown():
    """平台营收分布"""
    return [
        {"name": "独立站", "value": 45, "color": "#3B82F6"},
        {"name": "Amazon", "value": 30, "color": "#F59E0B"},
        {"name": "TikTok", "value": 15, "color": "#EF4444"},
        {"name": "Instagram", "value": 10, "color": "#8B5CF6"},
    ]

# ==================== 商品管理 ====================

@router.get("/products")
async def get_products(
    platform: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
):
    """获取商品列表"""
    products = [
        {"id": "P-001", "name": "无线降噪耳机 Pro", "platform": "Dropshipping", "price": 299, "cost": 98, "stock": 1250, "ai_score": 96, "status": "热卖"},
        {"id": "P-002", "name": "智能家居控制中枢", "platform": "Amazon FBA", "price": 459, "cost": 210, "stock": 340, "ai_score": 93, "status": "热卖"},
        {"id": "P-003", "name": "便携式迷你投影仪", "platform": "社交媒体", "price": 199, "cost": 75, "stock": 890, "ai_score": 91, "status": "热卖"},
        {"id": "P-004", "name": "AI翻译耳机", "platform": "Dropshipping", "price": 159, "cost": 55, "stock": 2100, "ai_score": 89, "status": "正常"},
        {"id": "P-005", "name": "磁吸充电宝 10000mAh", "platform": "社交媒体", "price": 89, "cost": 28, "stock": 3400, "ai_score": 87, "status": "正常"},
    ]
    return {"items": products, "total": len(products), "page": page, "limit": limit}

# ==================== AI选品 ====================

@router.get("/ai/select")
async def trigger_ai_select():
    """手动触发AI选品"""
    results = await selector_engine.scan_all_platforms()
    return {"status": "success", "items_found": len(results), "products": results}

@router.get("/ai/status")
async def get_ai_status():
    """获取AI引擎状态"""
    return {
        "selector": selector_engine.get_status(),
        "modules": [
            {"name": "AI选品引擎", "status": "running", "score": 96},
            {"name": "AI内容工厂", "status": "running", "score": 93},
            {"name": "AI定价策略", "status": "running", "score": 91},
            {"name": "AI智能客服", "status": "running", "score": 89},
            {"name": "AI广告优化", "status": "running", "score": 94},
            {"name": "AI库存预测", "status": "running", "score": 87},
        ],
        "recent_activities": [
            {"time": datetime.now().strftime("%H:%M"), "module": "选品引擎", "action": "扫描完成，发现12个潜力商品", "score": 94, "status": "success"},
            {"time": datetime.now().strftime("%H:%M"), "module": "自修复", "action": "检测到API延迟，已切换备用通道", "score": 100, "status": "heal"},
        ],
    }

# ==================== 系统健康 ====================

@router.get("/system/health")
async def get_system_health():
    """获取系统健康状态"""
    return {
        "health": auto_heal_engine.get_status(),
        "scheduler": automation_scheduler.get_status(),
        "updater": auto_updater.get_status(),
        "server_time": datetime.now().isoformat(),
    }

@router.post("/system/heal")
async def trigger_health_check():
    """手动触发健康检查"""
    result = await auto_heal_engine.health_check()
    return {"status": "completed", "checks": result}

# ==================== 自动化任务 ====================

@router.get("/automation/status")
async def get_automation_status():
    """获取自动化任务状态"""
    return automation_scheduler.get_status()

@router.post("/automation/trigger/{task_id}")
async def trigger_task(task_id: str):
    """手动触发指定自动化任务"""
    task_map = {
        "ai_select": automation_scheduler._run_select,
        "price_check": automation_scheduler._run_price_check,
        "health_check": automation_scheduler._run_health_check,
        "market_update": automation_scheduler._run_market_update,
        "daily_report": automation_scheduler._run_daily_report,
        "auto_update": automation_scheduler._run_auto_update,
    }
    if task_id not in task_map:
        raise HTTPException(status_code=404, detail="任务不存在")

    await task_map[task_id]()
    return {"status": "triggered", "task": task_id}

# ==================== 订单管理 ====================

@router.get("/orders")
async def get_orders(status: Optional[str] = None, page: int = 1, limit: int = 20):
    """获取订单列表"""
    orders = [
        {"id": "#ORD-8472", "product": "无线降噪耳机 Pro", "platform": "独立站", "amount": 299, "status": "已发货", "time": "3分钟前"},
        {"id": "#ORD-8471", "product": "智能家居控制中枢", "platform": "Amazon", "amount": 459, "status": "待发货", "time": "12分钟前"},
        {"id": "#ORD-8470", "product": "便携式迷你投影仪", "platform": "独立站", "amount": 199, "status": "已发货", "time": "28分钟前"},
        {"id": "#ORD-8469", "product": "AI翻译耳机", "platform": "TikTok Shop", "amount": 159, "status": "已完成", "time": "45分钟前"},
        {"id": "#ORD-8468", "product": "磁吸充电宝", "platform": "独立站", "amount": 89, "status": "已发货", "time": "1小时前"},
    ]
    return {"items": orders, "total": 2847, "page": page, "limit": limit}
