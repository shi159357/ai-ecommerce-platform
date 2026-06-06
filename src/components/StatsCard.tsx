'use client';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: string;
}

export default function StatsCard({ title, value, change, changeType = 'neutral', subtitle }: StatsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-400">{title}</p>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center gap-2">
        {change && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            changeType === 'up' && 'badge-green',
            changeType === 'down' && 'badge-red',
            changeType === 'neutral' && 'bg-white/5 text-slate-400'
          )}>
            {change}
          </span>
        )}
        {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
      </div>
    </div>
  );
}
