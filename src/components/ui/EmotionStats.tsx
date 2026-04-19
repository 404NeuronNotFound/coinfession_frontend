'use client';

interface EmotionStat {
  emotion: string;
  count: number;
  pnl: number;
  color: string;
}

interface EmotionStatsProps {
  stats: EmotionStat[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function EmotionStats({ stats }: EmotionStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: stat.color }}
            />
            <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground truncate">
              {stat.emotion}
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-foreground mb-1">
            {stat.count}
          </div>
          <div className={`text-xs sm:text-sm font-semibold ${stat.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(stat.pnl)}
          </div>
          <div className="text-xs text-muted-foreground">
            {stat.pnl >= 0 ? "total P&L" : "total loss"}
          </div>
        </div>
      ))}
    </div>
  );
}
