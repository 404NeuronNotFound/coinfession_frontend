'use client';

import { Button } from './button';

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  onExport?: () => void;
  onLogTrade?: () => void;
  onMenu?: () => void;
}

export default function DashboardHeader({
  title = 'Dashboard',
  subtitle = 'Live prices · April 2026',
  onExport,
  onLogTrade,
  onMenu,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {onExport && (
          <Button variant="outline" onClick={onExport} size="sm" className="text-xs sm:text-sm">
            Export
          </Button>
        )}
        {onLogTrade && (
          <Button onClick={onLogTrade} size="sm" className="text-xs sm:text-sm">
            + Log Trade
          </Button>
        )}
        {onMenu && (
          <Button variant="ghost" size="icon" onClick={onMenu} className="h-8 w-8 sm:h-10 sm:w-10">
            ⋯
          </Button>
        )}
      </div>
    </div>
  );
}
