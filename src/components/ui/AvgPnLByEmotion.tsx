'use client';

import { EmotionStat } from "@/types/emotionJournal.types";

interface AvgPnLByEmotionProps {
  data: EmotionStat[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function AvgPnLByEmotion({ data }: AvgPnLByEmotionProps) {
  const maxPnL = Math.max(...data.map(d => Math.abs(d.avg_pnl)), 1);

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Avg P&L by Emotion
      </h3>

      <div className="space-y-4">
        {data.map((item) => {
          const barWidth = (Math.abs(item.avg_pnl) / maxPnL) * 100;
          const isPositive = item.avg_pnl >= 0;

          return (
            <div key={item.id} className="flex items-center gap-3">
              {/* Emotion Label */}
              <div className="w-24 sm:w-28">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.name}</div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-lg transition-all ${isPositive ? "bg-green-600" : "bg-red-600"}`}
                  style={{ width: `${Math.min(barWidth, 100)}%` }}
                />
              </div>

              {/* Value */}
              <div className="w-16 text-right">
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: isPositive ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
                >
                  {fmt(item.avg_pnl)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>-$500</span>
          <span>$0</span>
          <span>+$500</span>
        </div>
      </div>
    </div>
  );
}
