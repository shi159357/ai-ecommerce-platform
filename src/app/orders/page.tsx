'use client';
import Sidebar from '@/components/Sidebar';
import { recentOrders, formatCurrency } from '@/lib/data';

const allOrders = [
  ...recentOrders,
  { id: '#ORD-8467', product: '智能体脂秤', platform: 'Amazon', amount: 129, status: '已完成', time: '2小时前' },
  { id: '#ORD-8466', product: '折叠笔记本支架', platform: '独立站', amount: 69, status: '已发货', time: '3小时前' },
  { id: '#ORD-8465', product: '迷你空气净化器', platform: 'TikTok Shop', amount: 199, status: '退货', time: '4小时前' },
  { id: '#ORD-8464', product: '无线充电板', platform: '独立站', amount: 79, status: '已发货', time: '5小时前' },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="orders" />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">订单管理</h1>
            <p className="text-sm text-slate-400 mt-1">全平台订单聚合 · 自动处理 · 智能客服</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-xl p-1">
            {['全部', '待发货', '已发货', '已完成', '退货'].map(s => (
              <button key={s} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${s === '全部' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: '总订单', value: '2,847', color: 'text-white' },
            { label: '待处理', value: '43', color: 'text-yellow-400' },
            { label: '已发货', value: '2,610', color: 'text-blue-400' },
            { label: '已完成', value: '182', color: 'text-emerald-400' },
            { label: '退货/退款', value: '12', color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className="text-sm text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold mt-2 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                <th className="pb-3 font-medium">订单号</th><th className="pb-3 font-medium">商品</th>
                <th className="pb-3 font-medium">平台</th><th className="pb-3 font-medium">金额</th>
                <th className="pb-3 font-medium">状态</th><th className="pb-3 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map(o => (
                <tr key={o.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-sm font-mono text-blue-400">{o.id}</td>
                  <td className="py-4 text-sm text-white">{o.product}</td>
                  <td className="py-4"><span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">{o.platform}</span></td>
                  <td className="py-4 text-sm font-semibold text-white">{formatCurrency(o.amount)}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      o.status === '已发货' ? 'badge-blue' : o.status === '已完成' ? 'badge-green' : o.status === '退货' ? 'badge-red' : 'badge-yellow'
                    }`}>{o.status}</span>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
