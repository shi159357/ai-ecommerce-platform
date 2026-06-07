# AI 跨境电商平台 — 部署后操作指南

项目部署到 Vercel 后，按以下步骤完成数据库初始化、API Key 配置和定时任务设置，即可实现 7×24 全自动运营。

---

## 一、数据库初始化（执行 db_init.sql）

### 1.1 打开 Vercel Postgres 控制台

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入项目 → 顶部导航选择 **Storage**
3. 如果尚未创建数据库，点击 **Create Database** → 选择 **Postgres** → 选择区域（推荐 Singapore 或 Tokyo）
4. 创建完成后，点击进入数据库详情页 → 选择 **Query** 标签页

### 1.2 执行初始化脚本

1. 用文本编辑器打开项目根目录的 `db_init.sql`
2. 全选复制全部内容（Ctrl+A → Ctrl+C）
3. 粘贴到 Vercel Postgres 的 Query 编辑器中
4. 点击 **Run** 按钮执行
5. 查看执行结果，确认无报错

### 1.3 验证表结构

在 Query 编辑器中执行以下 SQL 验证四张表是否创建成功：

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

期望看到：`products`、`orders`、`ai_decisions`、`automation_tasks`。

> **备选方案（如使用 Supabase）**：登录 [Supabase Dashboard](https://supabase.com/dashboard) → 选择项目 → 左侧菜单 **SQL Editor** → 粘贴 `db_init.sql` → 点击 **Run**。

---

## 二、配置 AI API Key

### 2.1 获取 OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录或注册 OpenAI 账号
3. 点击 **Create new secret key**
4. 命名（如 `ai-ecommerce-prod`）→ 点击 **Create secret key**
5. 立即复制 Key（关闭弹窗后将无法再次查看）
6. 如需使用 GPT-4，确保账号已充值并有可用额度：[Billing 页面](https://platform.openai.com/account/billing)

### 2.2 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 使用 Google 账号登录
3. 点击 **Create API Key**
4. 选择项目 → 复制生成的 Key
5. Gemini 免费额度：每分钟 15 次请求，每日 1500 次，对选品分析场景通常足够

### 2.3 配置到 Vercel 环境变量

1. 进入 Vercel Dashboard → 项目 → **Settings** → **Environment Variables**
2. 逐条添加以下环境变量：

| Key | Value | 环境 |
|-----|-------|------|
| `OPENAI_API_KEY` | `sk-xxxxxxxx` | Production / Preview / Development |
| `GEMINI_API_KEY` | `AIzaSyXxxxxxxx` | Production / Preview / Development |

3. 添加完成后，点击 **Save**
4. 回到 **Deployments** 标签页 → 找到最新部署 → 点击右侧 `...` → **Redeploy** 使环境变量生效
5. 部署完成后，访问 `https://你的域名.vercel.app/api/health` 确认服务正常

---

## 三、设置 Vercel Cron Jobs（7×24 自动化）

Vercel Cron Jobs 允许你以固定时间间隔自动执行 API 端点，无需外部服务器。

### 3.1 修改 `vercel.json` 添加 Cron 配置

将以下 `crons` 配置合并到项目根目录的 `vercel.json` 中：

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ],
  "crons": [
    {
      "path": "/api/cron/ai-selector",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/cron/price-update",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/health-check",
      "schedule": "*/5 * * * *"
    },
    {
      "path": "/api/cron/daily-report",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/auto-heal",
      "schedule": "*/10 * * * *"
    },
    {
      "path": "/api/cron/inventory-sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 3.2 Cron 任务说明

| Cron 表达式 | 频率 | 端点 | 功能 |
|---|---|---|---|
| `*/30 * * * *` | 每 30 分钟 | `/api/cron/ai-selector` | AI 自动选品扫描 |
| `0 * * * *` | 每小时 | `/api/cron/price-update` | 动态定价更新 |
| `*/5 * * * *` | 每 5 分钟 | `/api/cron/health-check` | 系统健康检查 |
| `0 2 * * *` | 每天凌晨 2:00 | `/api/cron/daily-report` | 每日运营报表 |
| `*/10 * * * *` | 每 10 分钟 | `/api/cron/auto-heal` | 自修复引擎 |
| `0 */6 * * *` | 每 6 小时 | `/api/cron/inventory-sync` | 库存同步 |

### 3.3 部署 Cron 配置

1. 保存修改后的 `vercel.json`
2. 推送代码到 GitHub：`git add . && git commit -m "添加 Cron Jobs 配置" && git push`
3. Vercel 自动触发部署
4. 部署后访问 **Settings → Cron Jobs** 查看所有定时任务的执行状态和日志

> **注意**：Vercel Hobby 计划支持最多 2 个 Cron Job。如需 6 个任务全部运行，需升级到 **Pro 计划**（$20/月）。按优先级保留前 2 个：`ai-selector` 和 `health-check`。

---

## 四、验证自动化运行

### 4.1 检查 Cron 执行日志

1. Vercel Dashboard → 项目 → **Logs**
2. 筛选条件设置为 `cron` 查看定时任务日志
3. 确认每个端点返回 `HTTP 200`

### 4.2 检查数据库自动写入

在 Vercel Postgres Query 编辑器中执行：

```sql
-- 查看最近的 AI 决策记录
SELECT engine_type, confidence, executed, created_at
FROM ai_decisions
ORDER BY created_at DESC
LIMIT 10;

-- 查看最近的自动化任务
SELECT task_type, status, scheduled_at, executed_at
FROM automation_tasks
ORDER BY created_at DESC
LIMIT 10;
```

如果能查到自动写入的记录，说明 Cron Jobs 已正常运行。

---

## 五、最终检查清单

- [ ] `db_init.sql` 已在数据库中成功执行，4 张表已创建
- [ ] `OPENAI_API_KEY` 和 `GEMINI_API_KEY` 已配置到 Vercel 环境变量并 Redeploy
- [ ] `vercel.json` 已添加 `crons` 配置块并推送部署
- [ ] Vercel Cron Jobs 页面显示任务状态为 Active
- [ ] Logs 中能看到 Cron 执行记录且返回 200
- [ ] 数据库中能查到 `ai_decisions` 和 `automation_tasks` 自动写入的记录

全部完成后，AI 跨境电商平台即进入 7×24 全自动运营模式。
