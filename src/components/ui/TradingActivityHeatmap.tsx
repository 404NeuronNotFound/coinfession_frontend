'use client';

import { useMemo } from 'react';
import { HeatmapDay } from '@/types/emotionJournalTypes';

interface TradingActivityHeatmapProps {
  data?: HeatmapDay[];
  availableYears?: number[];
  selectedYear?: number;
  onYearChange?: (year: number) => void;
}

export default function TradingActivityHeatmap({ 
  data = [], 
  availableYears = [],
  selectedYear = new Date().getFullYear(),
  onYearChange 
}: TradingActivityHeatmapProps) {
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Build a map of dates to trade counts for quick lookup
  const dateMap = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(day => {
      map.set(day.date, day.trade_count);
    });
    return map;
  }, [data]);

  // Generate 52-week grid for the selected year
  const heatmapGrid = useMemo(() => {
    const grid: Array<Array<{ intensity: number; date: string; tradeCount: number }>> = [];
    
    // Start from Jan 1 of selected year
    const yearStart = new Date(selectedYear, 0, 1);
    
    // Find the Sunday before or on Jan 1
    const firstSunday = new Date(yearStart);
    const dayOfWeek = firstSunday.getDay();
    if (dayOfWeek !== 0) {
      firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    }

    // Build 53 weeks to ensure we cover the full year
    for (let w = 0; w < 53; w++) {
      const week: Array<{ intensity: number; date: string; tradeCount: number }> = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(firstSunday);
        date.setDate(date.getDate() + w * 7 + d);
        
        // Format as YYYY-MM-DD using local date values
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const tradeCount = dateMap.get(dateStr) || 0;
        
        // Intensity: 0-4 based on trade count
        let intensity = 0;
        if (tradeCount === 0) {
          intensity = 0;
        } else if (tradeCount === 1) {
          intensity = 1;
        } else if (tradeCount <= 3) {
          intensity = 2;
        } else if (tradeCount <= 5) {
          intensity = 3;
        } else {
          intensity = 4;
        }
        week.push({ intensity, date: dateStr, tradeCount });
      }
      grid.push(week);
    }
    return grid;
  }, [dateMap, selectedYear]);

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return '#f3f4f6'; // light gray
      case 1:
        return '#a7f3d0'; // light green
      case 2:
        return '#6ee7b7'; // medium green
      case 3:
        return '#10b981'; // darker green
      case 4:
        return '#059669'; // dark green
      default:
        return '#f3f4f6';
    }
  };

  const cellSize = 24;
  const gap = 4;

  // Month labels for the top
  const monthLabels = useMemo(() => {
    const labels: { week: number; month: string }[] = [];
    const yearStart = new Date(selectedYear, 0, 1);
    
    // Find the Sunday before or on Jan 1
    const firstSunday = new Date(yearStart);
    const dayOfWeek = firstSunday.getDay();
    if (dayOfWeek !== 0) {
      firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    }

    let currentMonth = -1;
    for (let w = 0; w < 53; w++) {
      const date = new Date(firstSunday);
      date.setDate(date.getDate() + w * 7);
      const month = date.getMonth();
      
      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          week: w,
          month: date.toLocaleString('en-US', { month: 'short' }),
        });
      }
    }
    return labels;
  }, [selectedYear]);

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      {/* Header with Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
          Trading Activity Heatmap
        </h3>
        
        {/* Year Dropdown Selector */}
        {availableYears.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange?.(parseInt(e.target.value))}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

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

          {/* Heatmap grid with month labels */}
          <div>
            {/* Month labels row */}
            <div className="flex gap-1 mb-2 h-5">
              {monthLabels.map((label, idx) => {
                const nextLabel = monthLabels[idx + 1];
                const width = (nextLabel ? nextLabel.week - label.week : 53 - label.week) * (cellSize + 4);
                return (
                  <div
                    key={label.week}
                    className="text-xs text-muted-foreground font-semibold"
                    style={{ width: `${width}px` }}
                  >
                    {label.month}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex gap-1">
              {heatmapGrid.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((cell, dayIdx) => (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className="rounded-sm border border-border transition-colors hover:opacity-80 cursor-pointer"
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: getColor(cell.intensity),
                      }}
                      title={`${cell.date} · ${cell.tradeCount} trade${cell.tradeCount !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-4">
        <span className="text-xs text-muted-foreground font-semibold">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
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
