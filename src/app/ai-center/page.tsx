'use client';
import Sidebar from '@/components/Sidebar';

const aiModules = [
  { name: 'AI选品引擎', desc: '多平台数据采集 · 趋势预测 · 利润预估 · 竞争分析', status: '运行中', score: 96, icon: '🔍' },
  { name: 'AI内容工厂', desc: '商品文案生成 · 多语言翻译 · SEO优化 · A/B测试', status: '运行中', score: 93, icon: '✍️' },
  { name: 'AI定价策略', desc: '竞品监控 · 动态调价 · 利润最大化 · 促销建议', status: '运行中', score: 91, icon: '💰' },
  { name: 'AI智能客服', desc: '7×24自动回复 · 多语言支持 · 情绪识别 · 智能转人工', status: '运行中', score: 89, icon: '💬' },
  { name: 'AI广告优化', desc: '受众分析 · 预算分配 · 素材优化 · ROI追踪', status: '运行中', score: 94, icon: '📊' },
  { name: 'AI库存预测', desc: '销售预测 · 补货提醒 · 断货预警 · 仓储优化', status: '运行中', score: 87, icon: '📦' },
];

const aiLogs = [
  { time: '02:45', module: '选品引擎', action: '发现潜力商品: 智能戒指健康监测', score: 94, status: 'success' },
  { time: '02:30', module: '定价策略', action: '调整5款商品价格，预期利润+3.2%', score: 88, status: 'success' },
  { time: '02:15', module: '智能客服', action: '处理客户咨询 12 条，满意度 98%', score: 95, status: 'success' },
  { time: '02:00', module: '自修复', action: '检测到API超时，已自动切换备用通道', score: 100, status: 'heal' },
  { time: '01:30', module: '内容工厂', action: '生成3款新品多语言文案（EN/ES/DE）', score: 92, status: 'success' },
];

export default function AICenterPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar active="ai-center" />
      <main className="ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">AI 智能中心</h1>
            <p className="text-sm text-slate-400 mt-1">6大AI引擎协同运作 · 全自动化 · 持续学习</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-emerald-400">全部引擎正常运行</span>
          </div>
        </div>

        {/* AI Modules Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {aiModules.map(m => (
            <div key={m.name} className="card hover:border-blue-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs px-2 py-1 rounded-full badge-green">{m.status}</span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{m.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{m.desc}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${m.score}%` }} />
                </div>
                <span className="text-xs font-mono text-blue-400">{m.score}分</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Activity Log */}
        <div className="card">
          <h3 className="text-sm font-medium text-slate-300 mb-4">AI 实时活动日志</h3>
          <div className="space-y-3">
            {aiLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <span className="text-xs font-mono text-slate-600 w-14">{log.time}</span>
                <span className={`w-2 h-2 rounded-full ${log.status === 'heal' ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{log.module}</span>
                <span className="text-sm text-slate-300 flex-1">{log.action}</span>
                <span className={`text-xs font-mono ${log.score >= 90 ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {log.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
