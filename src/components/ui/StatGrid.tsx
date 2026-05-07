'use client';

import { ReactNode } from 'react';

interface StatItem {
  label: string;
  value: string | number;
  subtext: string;
  color?: 'default' | 'success' | 'warning' | 'neutral';
}

interface StatGridProps {
  stats: StatItem[];
}

const colorClasses = {
  default: 'text-foreground',
  success: 'text-green-600',
  warning: 'text-red-600',
  neutral: 'text-foreground',
};

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="p-4 sm:p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="text-xs uppercase tracking-widest mb-2 text-muted-foreground">
            {stat.label}
          </div>
          <div className={`text-xl sm:text-2xl font-black tracking-tight mb-1 ${colorClasses[stat.color || 'default']}`}>
            {stat.value}
          </div>
          <div className="text-xs text-muted-foreground">{stat.subtext}</div>
        </div>
      ))}
    </div>
  );
}
