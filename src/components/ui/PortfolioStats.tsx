'use client';

interface Stat {
  label: string;
  value: string;
  subtext: string;
  color: 'success' | 'warning' | 'default';
}

interface PortfolioStatsProps {
  stats: Stat[];
}

export default function PortfolioStats({ stats }: PortfolioStatsProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-red-600';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
            {stat.label}
          </div>
          <div className={`text-lg sm:text-2xl font-black ${getColorClass(stat.color)} mb-1`}>
            {stat.value}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            {stat.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
