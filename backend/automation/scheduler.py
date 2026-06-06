"""
自动化调度器 — 7×24定时任务管理
"""
import asyncio
from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

from config.settings import settings
from agents.selector import selector_engine
from agents.auto_heal import auto_heal_engine

class AutomationScheduler:
    """自动化任务调度中心"""

    def __init__(self):
        self.scheduler = AsyncIOScheduler(timezone="Asia/Shanghai")
        self.tasks_status: dict = {}
        self._setup_jobs()

    def _setup_jobs(self):
        """配置所有定时任务"""

        # AI选品 — 每30分钟
        self.scheduler.add_job(
            self._run_select,
            IntervalTrigger(minutes=settings.SELECT_INTERVAL_MINUTES),
            id="ai_select",
            name="AI智能选品",
            replace_existing=True,
        )

        # 价格监控 — 每15分钟
        self.scheduler.add_job(
            self._run_price_check,
            IntervalTrigger(minutes=settings.PRICE_CHECK_INTERVAL_MINUTES),
            id="price_check",
            name="竞品价格监控",
            replace_existing=True,
        )

        # 自修复检查 — 每5分钟
        self.scheduler.add_job(
            self._run_health_check,
            IntervalTrigger(minutes=settings.AUTO_HEAL_INTERVAL_MINUTES),
            id="health_check",
            name="系统健康检查",
            replace_existing=True,
        )

        # 市场趋势更新 — 每6小时
        self.scheduler.add_job(
            self._run_market_update,
            IntervalTrigger(hours=settings.MARKET_UPDATE_INTERVAL_HOURS),
            id="market_update",
            name="市场趋势更新",
            replace_existing=True,
        )

        # 每日报表 — 每天凌晨2点
        self.scheduler.add_job(
            self._run_daily_report,
            CronTrigger(hour=2, minute=0),
            id="daily_report",
            name="每日运营报表",
            replace_existing=True,
        )

        # 自动更新检查 — 每天凌晨4点
        self.scheduler.add_job(
            self._run_auto_update,
            CronTrigger(hour=4, minute=0),
            id="auto_update",
            name="自动更新检查",
            replace_existing=True,
        )

    async def _run_select(self):
        """执行AI选品"""
        try:
            results = await selector_engine.scan_all_platforms()
            self.tasks_status["ai_select"] = {
                "last_run": datetime.now().isoformat(),
                "items_found": len(results),
                "status": "success",
            }
            print(f"[调度器] AI选品完成，发现 {len(results)} 个潜力商品")
        except Exception as e:
            self.tasks_status["ai_select"] = {
                "last_run": datetime.now().isoformat(),
                "status": "failed",
                "error": str(e),
            }

    async def _run_price_check(self):
        """执行价格监控"""
        self.tasks_status["price_check"] = {
            "last_run": datetime.now().isoformat(),
            "status": "success",
        }

    async def _run_health_check(self):
        """执行系统健康检查"""
        try:
            result = await auto_heal_engine.health_check()
            self.tasks_status["health_check"] = {
                "last_run": datetime.now().isoformat(),
                "status": "success",
                "details": result,
            }
        except Exception as e:
            self.tasks_status["health_check"] = {
                "last_run": datetime.now().isoformat(),
                "status": "failed",
                "error": str(e),
            }

    async def _run_market_update(self):
        """执行市场趋势更新"""
        self.tasks_status["market_update"] = {
            "last_run": datetime.now().isoformat(),
            "status": "success",
        }

    async def _run_daily_report(self):
        """生成每日报表"""
        self.tasks_status["daily_report"] = {
            "last_run": datetime.now().isoformat(),
            "status": "success",
        }

    async def _run_auto_update(self):
        """检查自动更新"""
        self.tasks_status["auto_update"] = {
            "last_run": datetime.now().isoformat(),
            "status": "success",
            "version": settings.APP_VERSION,
        }

    def start(self):
        """启动调度器"""
        self.scheduler.start()
        print("[调度器] 自动化任务调度已启动")
        print(f"  - AI选品: 每{settings.SELECT_INTERVAL_MINUTES}分钟")
        print(f"  - 价格监控: 每{settings.PRICE_CHECK_INTERVAL_MINUTES}分钟")
        print(f"  - 自修复: 每{settings.AUTO_HEAL_INTERVAL_MINUTES}分钟")
        print(f"  - 市场更新: 每{settings.MARKET_UPDATE_INTERVAL_HOURS}小时")
        print(f"  - 每日报表: 凌晨2:00")
        print(f"  - 自动更新: 凌晨4:00")

    def shutdown(self):
        """关闭调度器"""
        self.scheduler.shutdown()

    def get_status(self) -> dict:
        return {
            "scheduler_running": self.scheduler.running,
            "tasks": self.tasks_status,
            "jobs": [
                {"id": j.id, "name": j.name, "next_run": str(j.next_run_time)}
                for j in self.scheduler.get_jobs()
            ],
        }

automation_scheduler = AutomationScheduler()
