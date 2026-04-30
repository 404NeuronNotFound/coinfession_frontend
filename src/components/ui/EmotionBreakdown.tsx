'use client';

import { EMOTION_COLORS } from './EmotionBadge';

interface EmotionStat {
  emotion: string;
  percentage: number;
  count: number;
  color?: string;
}

interface EmotionBreakdownProps {
  title?: string;
  subtitle?: string;
  emotions: EmotionStat[];
}

export default function EmotionBreakdown({
  title = 'EMOTION BREAKDOWN',
  subtitle,
  emotions,
}: EmotionBreakdownProps) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-muted-foreground">
        {title}
      </h3>

      <div className="space-y-4">
        {emotions.map((emotion) => (
          <div key={emotion.emotion} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-foreground">
                {emotion.emotion}
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${emotion.percentage}%`,
                    backgroundColor: emotion.color || EMOTION_COLORS[emotion.emotion as keyof typeof EMOTION_COLORS] || '#64748b',
                  }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-foreground ml-4">
              {emotion.percentage}%
            </span>
          </div>
        ))}
      </div>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          {subtitle}
        </p>
      )}
    </div>
  );
}
