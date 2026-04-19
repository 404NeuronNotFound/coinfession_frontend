'use client';

interface Insight {
  title: string;
  description: string;
  color: string;
  borderColor: string;
  textColor: string;
}

interface PatternInsightsProps {
  insights: Insight[];
}

export default function PatternInsights({ insights }: PatternInsightsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Pattern Insights
      </h3>

      {insights.map((insight, i) => (
        <div
          key={i}
          className={`p-4 sm:p-5 rounded-lg border-2 ${insight.borderColor} ${insight.color}`}
        >
          <div className={`text-sm sm:text-base font-semibold ${insight.textColor} mb-2`}>
            {insight.title}
          </div>
          <div className={`text-xs sm:text-sm ${insight.textColor} opacity-90`}>
            {insight.description}
          </div>
        </div>
      ))}
    </div>
  );
}
