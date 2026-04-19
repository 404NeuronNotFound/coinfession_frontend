'use client';

interface EmotionData {
  emotion: string;
  count: number;
  pnl: number;
  color: string;
}

interface WinRateByEmotionProps {
  data: EmotionData[];
}

export default function WinRateByEmotion({ data }: WinRateByEmotionProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Win Rate by Emotion
      </h3>

      <div className="space-y-4">
        {data.map((item, i) => {
          const barWidth = (item.count / maxCount) * 100;

          return (
            <div key={i} className="flex items-center gap-3">
              {/* Emotion Label */}
              <div className="w-24 sm:w-28">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.emotion}</div>
              </div>

              {/* Bar */}
              <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all"
                  style={{ width: `${barWidth}%`, backgroundColor: item.color }}
                />
              </div>

              {/* Count */}
              <div className="w-12 text-right">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">0%</div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
