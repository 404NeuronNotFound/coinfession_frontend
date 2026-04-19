'use client';

import { Badge } from "@/components/ui/badge";

interface Trade {
  id: number;
  date: string;
  type: "BUY" | "SELL";
  coin: string;
  ticker: string;
  emotion: string;
  note: string;
  pnl: string;
  color: string;
}

interface EmotionTradesListProps {
  trades: Trade[];
}

export default function EmotionTradesList({ trades }: EmotionTradesListProps) {
  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Trade Journal
      </h3>

      <div className="space-y-3">
        {trades.map((trade) => (
          <div key={trade.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Emotion Dot */}
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: trade.color }}
                />

                {/* Trade Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{trade.date}</span>
                    <Badge variant={trade.type === "BUY" ? "secondary" : "default"} className="text-xs">
                      {trade.type}
                    </Badge>
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{trade.ticker}</span>
                    <Badge variant="outline" className="text-xs">
                      {trade.emotion}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* P&L */}
              <div className="text-right shrink-0">
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{
                    color: trade.pnl === "Open" 
                      ? "hsl(var(--muted-foreground))" 
                      : trade.pnl.startsWith("+")
                      ? "hsl(var(--primary))"
                      : "hsl(var(--destructive))",
                  }}
                >
                  {trade.pnl}
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="text-xs text-muted-foreground ml-5">
              {trade.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
