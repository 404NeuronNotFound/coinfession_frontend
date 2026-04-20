'use client';

import { Badge } from "@/components/ui/badge";

interface Trade {
  date: string;
  type: "BUY" | "SELL";
  ticker: string;
  price: number;
  emotion: string;
  status?: string;
  pnl?: number;
}

interface MonthTradesListProps {
  trades: Trade[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function MonthTradesList({ trades }: MonthTradesListProps) {
  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        This Month's Trades
      </h3>

      <div className="space-y-3">
        {trades.map((trade, i) => (
          <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-foreground">{trade.date}</span>
              <Badge variant={trade.type === "BUY" ? "secondary" : "default"} className="text-xs">
                {trade.type}
              </Badge>
              <span className="text-xs sm:text-sm font-semibold text-foreground">{trade.ticker}</span>
              <span className="text-xs text-muted-foreground">{fmtDec(trade.price)}</span>
              <Badge variant="outline" className="text-xs">
                {trade.emotion}
              </Badge>
            </div>

            <div className="text-right shrink-0">
              {trade.status ? (
                <div className="text-xs text-muted-foreground">{trade.status}</div>
              ) : (
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{
                    color: trade.pnl! >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                  }}
                >
                  {trade.pnl! >= 0 ? "+" : ""}{fmt(trade.pnl!)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
