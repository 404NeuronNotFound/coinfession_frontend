'use client';

interface Trade {
  coin: string;
  date: string;
  pnl: number;
  type: string;
}

interface BestWorstTradesProps {
  data: {
    bestTrades: Trade[];
    worstTrades: Trade[];
  };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function BestWorstTrades({ data }: BestWorstTradesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      {/* Best Trades */}
      <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
          Top 3 Wins
        </h3>

        <div className="space-y-3">
          {data.bestTrades.map((trade, i) => (
            <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">{trade.type}</div>
                <div className="text-xs text-muted-foreground">{trade.coin} {trade.date}</div>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-green-600">{fmt(trade.pnl)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worst Trades */}
      <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
          Top 3 Losses
        </h3>

        <div className="space-y-3">
          {data.worstTrades.map((trade, i) => (
            <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
              <div>
                <div className="text-xs sm:text-sm font-semibold text-foreground">{trade.type}</div>
                <div className="text-xs text-muted-foreground">{trade.coin} {trade.date}</div>
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-red-600">{fmt(trade.pnl)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
