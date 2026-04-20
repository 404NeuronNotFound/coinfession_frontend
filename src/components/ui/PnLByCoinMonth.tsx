'use client';

interface PnLItem {
  coin: string;
  ticker: string;
  pnl: number;
  color: string;
}

interface PnLByCoinMonthProps {
  data: PnLItem[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function PnLByCoinMonth({ data }: PnLByCoinMonthProps) {
  const maxPnL = Math.max(...data.map(d => Math.abs(d.pnl)));

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        P&L by Coin
      </h3>

      <div className="space-y-4">
        {data.map((item, i) => {
          const barWidth = maxPnL > 0 ? (Math.abs(item.pnl) / maxPnL) * 100 : 0;
          const isPositive = item.pnl >= 0;

          return (
            <div key={i} className="flex items-center gap-3">
              {/* Coin Icon */}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: item.color }}
              >
                {item.ticker[0]}
              </div>

              {/* Coin Name */}
              <div className="w-16 sm:w-20">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.ticker}</div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden">
                {item.pnl !== 0 && (
                  <div
                    className={`h-full ${isPositive ? 'bg-green-600' : 'bg-red-600'}`}
                    style={{ width: `${barWidth}%` }}
                  />
                )}
              </div>

              {/* Value */}
              <div className="w-20 text-right">
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{
                    color: item.pnl === 0 
                      ? "hsl(var(--muted-foreground))" 
                      : isPositive 
                      ? "hsl(var(--primary))" 
                      : "hsl(var(--destructive))",
                  }}
                >
                  {item.pnl === 0 ? "—" : `${item.pnl > 0 ? "+" : ""}${fmt(item.pnl)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600" />
          <span>Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600" />
          <span>Loss</span>
        </div>
      </div>
    </div>
  );
}
