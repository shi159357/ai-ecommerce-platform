"""
AI跨境电商 一人公司 — 配置中心
支持从环境变量读取，未配置时使用默认值
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # 应用
    APP_NAME: str = "AI-Ecommerce"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # 服务器
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Supabase 数据库
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # AI 模型
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # 电商平台 API
    SHOPIFY_STORE_URL: str = os.getenv("SHOPIFY_STORE_URL", "")
    SHOPIFY_ACCESS_TOKEN: str = os.getenv("SHOPIFY_ACCESS_TOKEN", "")
    AMAZON_SELLER_ID: str = os.getenv("AMAZON_SELLER_ID", "")
    AMAZON_ACCESS_KEY: str = os.getenv("AMAZON_ACCESS_KEY", "")
    AMAZON_SECRET_KEY: str = os.getenv("AMAZON_SECRET_KEY", "")

    # 支付
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    ALIPAY_APP_ID: str = os.getenv("ALIPAY_APP_ID", "")
    WECHAT_PAY_MCH_ID: str = os.getenv("WECHAT_PAY_MCH_ID", "")

    # 自动化
    SELECT_INTERVAL_MINUTES: int = 30      # AI选品间隔
    PRICE_CHECK_INTERVAL_MINUTES: int = 15  # 价格检查间隔
    AUTO_HEAL_INTERVAL_MINUTES: int = 5     # 自修复检查间隔
    MARKET_UPDATE_INTERVAL_HOURS: int = 6   # 市场更新间隔

    # 自修复
    MAX_RETRY_ATTEMPTS: int = 3
    HEALTH_CHECK_TIMEOUT: int = 10

    # Redis（可选，用于Celery任务队列）
    REDIS_URL: str = os.getenv("REDIS_URL", "")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
