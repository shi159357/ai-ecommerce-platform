'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatsCard from '@/components/StatsCard';
import { mockStats, recentOrders, topProducts, revenueChart, platformBreakdown, formatCurrency, formatNumber, formatPercent } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardPage() {
  const [mode, setMode] = useState<'all' | 'dropshipping' | 'amazon' | 'social'>('all');

  const modes = [
    { id: 'all', label: '全模式' },
    { id: 'dropshipping', label: 'Dropshipping' },
    { id: 'amazon', label: 'Amazon FBA' },
    { id: 'social', label: '社交媒体' },
  ] as const;

  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="dashboard" />

      {/* Main Content */}
      <main className="ml-64 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI跨境电商 · 运营总览</h1>
            <p className="text-sm text-slate-400 mt-1">
              全栈自动化运行中 · 最后更新: {mockStats.systemHealth.lastUpdate}
              <span className="ml-3 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">7×24 在线</span>
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 glass rounded-xl p-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard title="今日营收" value={formatCurrency(mockStats.revenue.today)} change={formatPercent(13.5)} changeType="up" subtitle="较昨日" />
          <StatsCard title="本周营收" value={formatCurrency(mockStats.revenue.week)} change={formatPercent(8.2)} changeType="up" subtitle="周环比" />
          <StatsCard title="本月营收" value={formatCurrency(mockStats.revenue.month)} change={formatPercent(22.7)} changeType="up" subtitle="月环比" />
          <StatsCard title="净利润" value={formatCurrency(mockStats.profit.net)} change={mockStats.profit.margin + '%'} changeType="up" subtitle="利润率" />
        </div>

        {/* Operations & AI Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard title="总订单数" value={formatNumber(mockStats.orders.total)} subtitle={`${mockStats.orders.pending} 待处理`} />
          <StatsCard title="在线商品" value={formatNumber(mockStats.products.active)} subtitle={`${mockStats.products.pending} 审核中`} />
          <StatsCard title="AI选品分析" value={formatNumber(mockStats.aiMetrics.selections)} subtitle={`准确率 ${mockStats.aiMetrics.accuracy}%`} change={formatPercent(94.3)} changeType="up" />
          <StatsCard title="AI自动客服" value={formatNumber(mockStats.aiMetrics.replies)} subtitle="本月自动回复" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Revenue Chart */}
          <div className="card col-span-2">
            <h3 className="text-sm font-medium text-slate-300 mb-4">本周营收趋势</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#F1F5F9' }}
                  formatter={(value: number, name: string) => [formatCurrency(value), name === 'revenue' ? '营收' : '利润']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revGrad)" name="营收" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#profGrad)" name="利润" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Breakdown */}
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-2">平台营收分布</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {platformBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#F1F5F9' }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {platformBreakdown.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-400">{p.name}</span>
                  </span>
                  <span className="text-white font-medium">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Orders + Products */}
        <div className="grid grid-cols-2 gap-4">
          {/* Recent Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">最新订单</h3>
              <a href="/orders" className="text-xs text-blue-400 hover:text-blue-300">查看全部 →</a>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{order.product}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{order.platform}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{order.id} · {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(order.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === '已发货' ? 'badge-blue' :
                      order.status === '已完成' ? 'badge-green' :
                      'badge-yellow'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300">热卖商品 Top 5</h3>
              <a href="/products" className="text-xs text-blue-400 hover:text-blue-300">全部商品 →</a>
            </div>
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{p.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.aiScore >= 90 ? 'badge-green' : p.aiScore >= 80 ? 'badge-blue' : 'badge-yellow'
                      }`}>AI {p.aiScore}分</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.platform} · 库存 {formatNumber(p.stock)} · 成本 {formatCurrency(p.cost)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatCurrency(p.price)}</p>
                    <p className="text-xs text-emerald-400">利润 {formatCurrency(p.price - p.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-4">系统健康监控</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: '运行时长', value: `${mockStats.systemHealth.uptime}%`, status: 'up' },
              { label: '自动修复', value: `${mockStats.systemHealth.selfHeals} 次`, status: 'up' },
              { label: '系统错误', value: `${mockStats.systemHealth.errors}`, status: 'up' },
              { label: 'AI选品数', value: formatNumber(mockStats.aiMetrics.selections), status: 'up' },
              { label: '自动上架', value: formatNumber(mockStats.aiMetrics.listings), status: 'up' },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-white/5">
                <p className="text-xs text-slate-500 mb-2">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-xs text-slate-500">{item.status === 'up' ? '正常' : '异常'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
