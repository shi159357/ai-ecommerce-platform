-- ============================================
-- AI跨境电商 一人公司 — 数据库初始化脚本
-- 目标数据库：Vercel Postgres / Supabase (PostgreSQL)
-- 执行方式：在 SQL Editor / Query Console 中粘贴全部内容后 Run
-- ============================================

-- ============================================
-- 1. 产品表
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    margin DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN price > 0
            THEN ROUND(((price - cost) / price) * 100, 2)
            ELSE 0
        END
    ) STORED,
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. 订单表
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    profit DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. AI 决策日志表
-- ============================================
CREATE TABLE IF NOT EXISTS ai_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engine_type VARCHAR(50) NOT NULL,
    input_data JSONB,
    decision JSONB NOT NULL,
    confidence DECIMAL(4,2) DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
    executed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. 自动化任务表
-- ============================================
CREATE TABLE IF NOT EXISTS automation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    result JSONB,
    scheduled_at TIMESTAMP,
    executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_ai_score ON products(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_decisions_engine ON ai_decisions(engine_type);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_executed ON ai_decisions(executed);
CREATE INDEX IF NOT EXISTS idx_ai_decisions_created ON ai_decisions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_automation_tasks_type ON automation_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_status ON automation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_automation_tasks_scheduled ON automation_tasks(scheduled_at);

-- ============================================
-- 6. 自动更新 updated_at 触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_products_updated_at'
    ) THEN
        CREATE TRIGGER trg_products_updated_at
            BEFORE UPDATE ON products
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
END;
$$;

-- ============================================
-- 7. 种子数据（可选，首次部署时取消注释）
-- ============================================
-- INSERT INTO products (name, platform, price, cost, stock, ai_score, status) VALUES
-- ('示例商品 - 无线蓝牙耳机', 'shopify', 199.00, 85.00, 500, 88, 'active'),
-- ('示例商品 - 便携充电宝', 'amazon', 149.00, 60.00, 1200, 92, 'active'),
-- ('示例商品 - 智能手表表带', 'shopify', 49.00, 12.00, 2000, 75, 'active');

-- ============================================
-- 执行完毕
-- ============================================
-- 验证：运行 SELECT table_name FROM information_schema.tables WHERE table_schema='public';
-- 应看到 products, orders, ai_decisions, automation_tasks 四张表
