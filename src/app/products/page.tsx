'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { topProducts, formatCurrency, formatNumber } from '@/lib/data';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');

  const filtered = topProducts.filter(p =>
    (platform === 'all' || p.platform.includes(platform === 'dropshipping' ? 'Drop' : platform === 'amazon' ? 'Amazon' : '社交')) &&
    (search === '' || p.name.includes(search))
  );

  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="products" />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">商品管理</h1>
            <p className="text-sm text-slate-400 mt-1">AI智能选品 · 自动上架 · 动态定价</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={platform} onChange={e => setPlatform(e.target.value)}
              className="glass px-4 py-2 rounded-xl text-sm text-slate-300 outline-none">
              <option value="all">全部平台</option>
              <option value="dropshipping">Dropshipping</option>
              <option value="amazon">Amazon FBA</option>
              <option value="social">社交媒体</option>
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索商品..."
              className="glass px-4 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none w-64" />
            <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-all">
              + AI选品
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '在线商品', value: '568', change: '+12', type: 'up' },
            { label: 'AI评分均值', value: '91.2', change: '+2.3', type: 'up' },
            { label: '平均利润率', value: '62%', change: '+5%', type: 'up' },
            { label: '待审核', value: '24', change: '-3', type: 'down' },
          ].map(s => (
            <div key={s.label} className="card">
              <p className="text-sm text-slate-400">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{s.value}</p>
              <span className={`text-xs ${s.type === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{s.change}</span>
            </div>
          ))}
        </div>

        {/* Product Table */}
        <div className="card">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-white/5">
                <th className="pb-3 font-medium">商品名称</th>
                <th className="pb-3 font-medium">平台</th>
                <th className="pb-3 font-medium">售价</th>
                <th className="pb-3 font-medium">成本</th>
                <th className="pb-3 font-medium">利润</th>
                <th className="pb-3 font-medium">库存</th>
                <th className="pb-3 font-medium">AI评分</th>
                <th className="pb-3 font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-sm font-medium text-white">{p.name}</td>
                  <td className="py-4"><span className="text-xs px-2 py-1 rounded-full bg-white/5 text-slate-400">{p.platform}</span></td>
                  <td className="py-4 text-sm text-white">{formatCurrency(p.price)}</td>
                  <td className="py-4 text-sm text-slate-400">{formatCurrency(p.cost)}</td>
                  <td className="py-4 text-sm text-emerald-400 font-medium">{formatCurrency(p.price - p.cost)}</td>
                  <td className="py-4 text-sm text-slate-400">{formatNumber(p.stock)}</td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.aiScore >= 90 ? 'badge-green' : 'badge-blue'}`}>
                      {p.aiScore}分
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.status === '热卖' ? 'badge-red' : 'badge-green'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
