'use client';

import { useThemeStore } from '@/stores/themeStore';

interface DataPoint {
  month: string;
  pnl: number;
}

interface CumulativePnLChartProps {
  data: DataPoint[];
}

export default function CumulativePnLChart({ data }: CumulativePnLChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  
  // Handle empty or single data point
  if (!data || data.length === 0) {
    return (
      <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
          Cumulative P&L Over Time
        </h3>
        <div className="h-48 sm:h-56 flex items-center justify-center text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }
  
  const maxPnL = Math.max(...data.map(d => d.pnl));
  const minPnL = 0;
  const range = maxPnL - minPnL || 1; // Prevent division by zero

  const points = data.map((d, i) => {
    const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
    const y = range === 0 ? 50 : 100 - ((d.pnl - minPnL) / range) * 80;
    return { x, y, ...d };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const gridColor = isDark ? '#4b5563' : '#e5e7eb';
  const lineColor = isDark ? '#10b981' : '#3b82f6';
  const areaColor = isDark ? '#10b981' : '#3b82f6';

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Cumulative P&L Over Time
      </h3>

      <div className="space-y-4">
        {/* Chart */}
        <div className="h-48 sm:h-56 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={`grid-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke={gridColor}
                strokeWidth="0.5"
              />
            ))}

            {/* Area under curve */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill={areaColor}
              opacity={isDark ? "0.2" : "0.1"}
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={lineColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r="2.5"
                fill={lineColor}
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lineColor }} />
            <span className="text-muted-foreground">Cumulative P&L</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5" style={{ backgroundColor: gridColor }} />
            <span className="text-muted-foreground">Break-evens</span>
          </div>
        </div>
      </div>
    </div>
  );
}
