'use client';
import { cn } from '@/lib/utils';

interface IconProps { className?: string; size?: number; }
const Icon = ({ path, className, size = 20 }: IconProps & { path: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={path} />
  </svg>
);

const icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  products: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  orders: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  ai: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M12 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm0 8a2 2 0 1 0 2 2 2 2 0 0 0-2-2z',
  analytics: 'M18 20V10 M12 20V4 M6 20v-6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  logo: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
};

const navItems = [
  { id: 'dashboard', label: '运营总览', icon: icons.dashboard, href: '/dashboard' },
  { id: 'products', label: '商品管理', icon: icons.products, href: '/products' },
  { id: 'orders', label: '订单管理', icon: icons.orders, href: '/orders' },
  { id: 'ai-center', label: 'AI 智能中心', icon: icons.ai, href: '/ai-center' },
  { id: 'analytics', label: '数据分析', icon: icons.analytics, href: '/analytics' },
  { id: 'settings', label: '系统设置', icon: icons.settings, href: '/settings' },
];

export default function Sidebar({ active }: { active: string }) {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon path={icons.logo} size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AI跨境电商</h1>
            <p className="text-xs text-slate-400">一人公司 · v1.0</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              active === item.id
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Icon path={item.icon} size={18} />
            {item.label}
            {active === item.id && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </a>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">系统运行中 · 99.97%</span>
        </div>
      </div>
    </aside>
  );
}
