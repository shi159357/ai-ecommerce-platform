"""
数据模型定义 — Pydantic Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BusinessMode(str, Enum):
    ALL = "all"
    DROPSHIPPING = "dropshipping"
    AMAZON = "amazon"
    SOCIAL = "social"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    RETURNED = "returned"
    CANCELLED = "cancelled"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    PENDING_REVIEW = "pending_review"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"

class PlatformStats(BaseModel):
    mode: BusinessMode = BusinessMode.ALL
    revenue: dict  # {today, yesterday, week, month}
    orders: dict   # {total, pending, shipped, returned}
    products: dict # {active, pending, outOfStock}
    profit: dict   # {gross, net, margin}
    ai_metrics: dict  # {selections, listings, replies, accuracy}
    system_health: dict  # {uptime, last_update, errors, self_heals}

class Product(BaseModel):
    id: str
    name: str
    platform: str
    price: float
    cost: float
    stock: int
    ai_score: int = Field(ge=0, le=100)
    status: ProductStatus = ProductStatus.ACTIVE
    source_url: Optional[str] = None
    images: List[str] = []
    category: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class Order(BaseModel):
    id: str
    product_id: Optional[str] = None
    product_name: str
    platform: str
    amount: float
    currency: str = "CNY"
    status: OrderStatus = OrderStatus.PENDING
    customer_email: Optional[str] = None
    tracking_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)

class AIActivity(BaseModel):
    id: str
    module: str  # 选品引擎 / 内容工厂 / 定价策略 / 智能客服 / 广告优化 / 库存预测
    action: str
    score: int = Field(ge=0, le=100)
    status: str  # success / failed / heal
    timestamp: datetime = Field(default_factory=datetime.now)

class SystemHealth(BaseModel):
    uptime_percent: float
    errors_24h: int
    self_heals_24h: int
    last_update: datetime
    ai_modules_status: dict  # {module_name: "running"|"error"|"stopped"}
    api_status: dict  # {platform: "connected"|"error"|"disconnected"}
