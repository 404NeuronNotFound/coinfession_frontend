'use client';

interface HistoryItem {
  month: string;
  trades: number;
  winRate: number;
  pnl: number;
  year?: number;
  monthNum?: number;
  isSelected?: boolean;
}

interface MonthlyReportHistoryProps {
  data: HistoryItem[];
  onSelectMonth?: (year: number, month: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function MonthlyReportHistory({ data, onSelectMonth }: MonthlyReportHistoryProps) {
  const maxTrades = Math.max(...data.map(d => d.trades), 1);

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Report History · All Months
      </h3>

      <div className="space-y-3">
        {data.map((item, i) => {
          const barWidth = (item.trades / maxTrades) * 100;
          const isPositive = item.pnl >= 0;

          return (
            <div 
              key={i} 
              className={`flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0 ${
                onSelectMonth && item.year && item.monthNum ? 'cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-2 rounded transition-colors' : ''
              } ${item.isSelected ? 'bg-muted/50' : ''}`}
              onClick={() => {
                if (onSelectMonth && item.year && item.monthNum) {
                  onSelectMonth(item.year, item.monthNum);
                }
              }}
            >
              {/* Month */}
              <div className="w-24 sm:w-28">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.month}</div>
              </div>

              {/* Trades */}
              <div className="w-16 sm:w-20">
                <div className="text-xs text-muted-foreground">{item.trades} trades</div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Win Rate */}
              <div className="w-12 text-right">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.winRate}%</div>
              </div>

              {/* P&L */}
              <div className="w-20 text-right">
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{
                    color: isPositive ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                  }}
                >
                  {isPositive ? "+" : ""}{fmt(item.pnl)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
