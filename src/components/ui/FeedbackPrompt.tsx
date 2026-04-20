"use client";

import { Button } from "./button";
import { Sparkles, Eye } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface FeedbackPromptProps {
  data: {
    month: string;
    tradesAnalyzed: number;
    emotionsTagged: number;
    pnlMetrics: string;
    description: string;
  };
}

export default function FeedbackPrompt({ data }: FeedbackPromptProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-lg border p-6 sm:p-8 ${
        isDark
          ? "bg-muted/50 border-border"
          : "bg-slate-50 border-slate-200"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            {data.month} Analysis
          </h3>
          <p className="text-sm text-muted-foreground">{data.description}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
            <Eye className="w-4 h-4" />
            View Prompt
          </Button>
          <Button className="gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" />
            Generate Feedback
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
          <p className="text-xs text-muted-foreground mb-1">Trades Analyzed</p>
          <p className="text-lg sm:text-xl font-semibold text-foreground">
            {data.tradesAnalyzed}
          </p>
        </div>
        <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
          <p className="text-xs text-muted-foreground mb-1">Emotions Tagged</p>
          <p className="text-lg sm:text-xl font-semibold text-foreground">
            {data.emotionsTagged}
          </p>
        </div>
        <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
          <p className="text-xs text-muted-foreground mb-1">P&L Metrics</p>
          <p className="text-lg sm:text-xl font-semibold text-green-600">
            {data.pnlMetrics}
          </p>
        </div>
      </div>
    </div>
  );
}
