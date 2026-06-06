'use client';
import Sidebar from '@/components/Sidebar';
import { formatCurrency } from '@/lib/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend as ReLegend } from 'recharts';

const monthlyData = [
  { month: '1月', dropshipping: 45200, amazon: 38200, social: 21800, profit: 29456 },
  { month: '2月', dropshipping: 48700, amazon: 35600, social: 24300, profit: 30408 },
  { month: '3月', dropshipping: 52300, amazon: 41200, social: 28900, profit: 34272 },
  { month: '4月', dropshipping: 56100, amazon: 44800, social: 31200, profit: 36960 },
  { month: '5月', dropshipping: 59800, amazon: 47200, social: 35800, profit: 39984 },
  { month: '6月', dropshipping: 63400, amazon: 50100, social: 39600, profit: 42876 },
];

const productPerf = [
  { name: '无线耳机', sales: 1280, revenue: 382720 },
  { name: '智能中控', sales: 890, revenue: 408510 },
  { name: '迷你投影', sales: 1560, revenue: 310440 },
  { name: 'AI翻译机', sales: 2100, revenue: 333900 },
  { name: '充电宝', sales: 3400, revenue: 302600 },
];

const profitMargin = [
  { name: 'Dropshipping', margin: 35, color: '#3B82F6' },
  { name: 'Amazon FBA', margin: 22, color: '#F59E0B' },
  { name: '社交媒体', margin: 42, color: '#8B5CF6' },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="analytics" />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">数据分析</h1>
            <p className="text-sm text-slate-400 mt-1">多维度数据洞察 · 趋势预测 · 利润分析</p>
          </div>
          <select className="glass px-4 py-2 rounded-xl text-sm text-slate-300 outline-none">
            <option>最近6个月</option><option>最近3个月</option><option>最近1年</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-4">月度营收趋势（分平台）</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#F1F5F9' }}
                  formatter={(v: number, n: string) => [formatCurrency(v), n === 'dropshipping' ? 'Dropshipping' : n === 'amazon' ? 'Amazon' : '社交媒体']} />
                <Bar dataKey="dropshipping" fill="#3B82F6" radius={[4,4,0,0]} />
                <Bar dataKey="amazon" fill="#F59E0B" radius={[4,4,0,0]} />
                <Bar dataKey="social" fill="#8B5CF6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-4">净利润走势</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#F1F5F9' }}
                  formatter={(v: number) => [formatCurrency(v), '净利润']} />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="card col-span-2">
            <h3 className="text-sm font-medium text-slate-300 mb-4">商品销售排行</h3>
            <div className="space-y-3">
              {productPerf.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-600 w-6">#{i+1}</span>
                  <span className="text-sm text-white w-28">{p.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(p.sales / 3400) * 100}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-16 text-right">{p.sales}件</span>
                  <span className="text-xs font-medium text-emerald-400 w-24 text-right">{formatCurrency(p.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-2">利润率对比</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={profitMargin} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="margin" paddingAngle={5}>
                  {profitMargin.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '12px', color: '#F1F5F9' }}
                  formatter={(v: number) => [`${v}%`, '利润率']} />
              </PieChart>
            </ResponsiveContainer>
            {profitMargin.map(p => (
              <div key={p.name} className="flex items-center justify-between text-xs mt-2">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-400">{p.name}</span>
                </span>
                <span className="text-white font-medium">{p.margin}%</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
