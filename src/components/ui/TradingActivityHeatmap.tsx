'use client';

import { useMemo } from 'react';

interface TradingActivityHeatmapProps {
  weeks?: number;
}

export default function TradingActivityHeatmap({ weeks = 12 }: TradingActivityHeatmapProps) {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate mock data for heatmap
  const heatmapData = useMemo(() => {
    const data: number[][] = [];
    for (let w = 0; w < weeks; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        // Random activity level: 0 = no activity, 1 = light, 2 = medium, 3 = heavy
        week.push(Math.floor(Math.random() * 4));
      }
      data.push(week);
    }
    return data;
  }, [weeks]);

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return '#f3f4f6'; // light gray
      case 1:
        return '#a7f3d0'; // light green
      case 2:
        return '#6ee7b7'; // medium green
      case 3:
        return '#059669'; // dark green
      default:
        return '#f3f4f6';
    }
  };

  const cellSize = 24;
  const gap = 4;

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Trading Activity Heatmap · Last 12 Weeks
      </h3>

      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col justify-end">
            {dayLabels.map((day) => (
              <div
                key={day}
                className="text-xs text-muted-foreground font-semibold"
                style={{ height: `${cellSize + gap}px`, display: 'flex', alignItems: 'center' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {heatmapData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((level, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className="rounded-sm border border-border transition-colors hover:opacity-80 cursor-pointer"
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: getColor(level),
                    }}
                    title={`Week ${weekIdx + 1}, ${dayLabels[dayIdx]}: ${level} trades`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-semibold">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className="rounded-sm border border-border"
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: getColor(level),
              }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground font-semibold">More</span>
      </div>
    </div>
  );
}
