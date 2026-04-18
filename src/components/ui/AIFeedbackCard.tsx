'use client';

import { Badge } from './badge';

interface AIFeedbackCardProps {
  title?: string;
  subtitle?: string;
  feedback: string;
  onViewFull?: () => void;
}

export default function AIFeedbackCard({
  title = 'AI Feedback',
  subtitle = 'April',
  feedback,
  onViewFull,
}: AIFeedbackCardProps) {
  return (
    <div className="p-6 rounded-lg border border-border bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
          AI
        </Badge>
        <h3 className="text-sm font-semibold text-foreground">
          {title} · {subtitle}
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-foreground mb-4">
        {feedback}
      </p>

      {onViewFull && (
        <button
          onClick={onViewFull}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Full report →
        </button>
      )}
    </div>
  );
}
