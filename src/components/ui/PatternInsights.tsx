'use client';

import { PatternInsight } from "@/types/emotionJournalTypes";

interface PatternInsightsProps {
  insights: PatternInsight[];
}

export default function PatternInsights({ insights }: PatternInsightsProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  const getColorClasses = (type: "good" | "bad" | "warn") => {
    switch (type) {
      case "good":
        return {
          color: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-900",
        };
      case "bad":
        return {
          color: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-900",
        };
      case "warn":
        return {
          color: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-900",
        };
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-4">
        Pattern Insights
      </h3>

      {insights.map((insight, i) => {
        const colors = getColorClasses(insight.type);
        return (
          <div
            key={i}
            className={`p-4 sm:p-5 rounded-lg border-2 ${colors.borderColor} ${colors.color}`}
          >
            <div className={`text-sm sm:text-base font-semibold ${colors.textColor} mb-2`}>
              {insight.title}
            </div>
            <div className={`text-xs sm:text-sm ${colors.textColor} opacity-90`}>
              {insight.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
