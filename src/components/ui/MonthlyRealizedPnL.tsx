'use client';

interface DataPoint {
  month: string;
  pnl: number;
}

interface MonthlyRealizedPnLProps {
  data: DataPoint[];
}

export default function MonthlyRealizedPnL({ data }: MonthlyRealizedPnLProps) {
  const maxPnL = Math.max(...data.map(d => Math.abs(d.pnl)));
  const chartHeight = 120;

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Monthly Realized P&L
      </h3>

      <div className="space-y-4">
        {/* Chart */}
        <div className="flex items-end justify-between gap-2 h-40 sm:h-48">
          {data.map((d, i) => {
            const barHeight = (Math.abs(d.pnl) / maxPnL) * chartHeight;
            const isPositive = d.pnl >= 0;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t transition-colors ${
                    isPositive ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
                <span className="text-xs text-muted-foreground">{d.month}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600" />
            <span className="text-muted-foreground">Profit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600" />
            <span className="text-muted-foreground">Loss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
