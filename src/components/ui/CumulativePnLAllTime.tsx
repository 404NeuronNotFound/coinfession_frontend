'use client';

interface DataPoint {
  month: string;
  pnl: number;
}

interface CumulativePnLAllTimeProps {
  data: DataPoint[];
}

export default function CumulativePnLAllTime({ data }: CumulativePnLAllTimeProps) {
  const maxPnL = Math.max(...data.map(d => d.pnl));
  const minPnL = 0;
  const range = maxPnL - minPnL;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.pnl - minPnL) / range) * 80;
    return { x, y, ...d };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Cumulative P&L · All Time
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
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
            ))}

            {/* Area under curve */}
            <path
              d={`${pathData} L 100 100 L 0 100 Z`}
              fill="hsl(var(--primary))"
              opacity="0.1"
            />

            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r="2"
                fill="hsl(var(--primary))"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Cumulative P&L</span>
        </div>
      </div>
    </div>
  );
}
