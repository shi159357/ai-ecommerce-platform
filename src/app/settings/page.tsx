'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const [mode, setMode] = useState('all');
  const [autoHeal, setAutoHeal] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [autoSelect, setAutoSelect] = useState(true);

  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="settings" />
      <main className="ml-64 p-6">
        <h1 className="text-2xl font-bold text-white mb-6">系统设置</h1>

        <div className="grid grid-cols-2 gap-6">
          {/* Business Mode */}
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-3">业务模式</h3>
            <div className="space-y-2">
              {[
                { id: 'all', label: '全模式运营', desc: '同时运行Dropshipping + Amazon FBA + 社交媒体带货' },
                { id: 'dropshipping', label: 'Dropshipping', desc: '零库存模式，AliExpress选品自动上架独立站' },
                { id: 'amazon', label: 'Amazon FBA', desc: '自有库存模式，AI选品+Listing优化+PPC管理' },
                { id: 'social', label: '社交媒体', desc: 'TikTok/Instagram内容生成+联盟营销' },
              ].map(m => (
                <label key={m.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${mode === m.id ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-white/5'}`}>
                  <input type="radio" name="mode" checked={mode === m.id} onChange={() => setMode(m.id)}
                    className="mt-0.5 accent-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-white">{m.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* AI Settings */}
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-4">AI 自动化设置</h3>
            <div className="space-y-4">
              {[
                { label: '自修复引擎', desc: '自动检测并修复系统异常、API故障', state: autoHeal, set: setAutoHeal },
                { label: '自动更新', desc: '每日自动检查并应用市场策略更新', state: autoUpdate, set: setAutoUpdate },
                { label: 'AI选品', desc: '持续扫描多平台，自动发现高潜力商品', state: autoSelect, set: setAutoSelect },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button onClick={() => item.set(!item.state)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${item.state ? 'bg-blue-500' : 'bg-slate-700'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.state ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Info */}
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-3">部署信息</h3>
            <div className="space-y-3">
              {[
                { label: '平台版本', value: 'v1.0.0-beta' },
                { label: '运行环境', value: 'Vercel + Supabase' },
                { label: '数据区域', value: 'Asia Pacific (Singapore)' },
                { label: '上次部署', value: '2026-06-07 02:30' },
                { label: '自修复次数', value: '3 次（24小时内）' },
                { label: 'AI模型版本', value: 'Gemini 2.5 Flash + GPT-4o-mini' },
              ].map(i => (
                <div key={i.label} className="flex items-center justify-between py-1">
                  <span className="text-sm text-slate-400">{i.label}</span>
                  <span className="text-sm text-white">{i.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* API Config */}
          <div className="card">
            <h3 className="text-sm font-medium text-slate-300 mb-3">平台接入</h3>
            <div className="space-y-3">
              {[
                { name: 'Shopify 独立站', status: '已连接', color: 'emerald' },
                { name: 'Amazon Seller Central', status: '待配置', color: 'yellow' },
                { name: 'AliExpress Dropshipping', status: '已连接', color: 'emerald' },
                { name: 'TikTok Shop', status: '待配置', color: 'yellow' },
                { name: 'Instagram Shopping', status: '待配置', color: 'yellow' },
                { name: 'Stripe 支付', status: '已连接', color: 'emerald' },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white">{p.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    p.color === 'emerald' ? 'badge-green' : 'badge-yellow'
                  }`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
