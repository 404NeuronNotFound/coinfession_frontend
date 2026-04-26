'use client';

import { EmotionStat } from "@/types/emotionJournal.types";

interface EmotionStatsProps {
  stats: EmotionStat[];
  activeEmotionId?: number | null;
  onEmotionClick?: (emotionId: number) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function EmotionStats({ stats, activeEmotionId, onEmotionClick }: EmotionStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const isActive = activeEmotionId === stat.id;
        return (
          <div
            key={stat.id}
            onClick={() => onEmotionClick?.(stat.id)}
            className={`p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
              isActive
                ? "border-foreground bg-foreground/5"
                : "border-border bg-card hover:border-foreground/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: stat.color }}
              />
              <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground truncate">
                {stat.name}
              </div>
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground mb-1">
              {stat.trade_count}
            </div>
            <div className={`text-xs sm:text-sm font-semibold ${stat.total_pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
              {fmt(stat.total_pnl)}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.total_pnl >= 0 ? "total P&L" : "total loss"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
