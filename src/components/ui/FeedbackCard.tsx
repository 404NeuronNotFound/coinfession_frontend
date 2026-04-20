"use client";

import { ChevronDown } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

interface FeedbackCardProps {
  feedback: {
    id: string;
    month: string;
    date: string;
    tradesAnalyzed: number;
    emotionsTagged: number;
    pnlMetrics: string;
    scores: {
      discipline: number;
      riskManagement: number;
      consistency: number;
    };
    whatYouAsked: string;
    overallAssessment: string;
    whatsWorking: string[];
    whatsHurting: string[];
    oneThingToFixInApril: string;
    actionItems: string[];
  };
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FeedbackCard({
  feedback,
  isExpanded,
  onToggle,
}: FeedbackCardProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div
      className={`rounded-lg border transition-all ${
        isDark
          ? "bg-background border-border hover:border-primary/50"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex-1 text-left">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
            {feedback.month}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {feedback.date}
          </p>
        </div>

        {/* Scores Preview */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Discipline</p>
            <p className={`text-sm font-semibold ${getScoreColor(feedback.scores.discipline)}`}>
              {feedback.scores.discipline}/10
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Risk Mgmt</p>
            <p className={`text-sm font-semibold ${getScoreColor(feedback.scores.riskManagement)}`}>
              {feedback.scores.riskManagement}/10
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Consistency</p>
            <p className={`text-sm font-semibold ${getScoreColor(feedback.scores.consistency)}`}>
              {feedback.scores.consistency}/10
            </p>
          </div>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          className={`px-6 py-4 sm:py-5 border-t ${
            isDark ? "border-border" : "border-slate-200"
          }`}
        >
          {/* Scores Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted" : "bg-slate-50"}`}>
              <p className="text-xs text-muted-foreground mb-1">Discipline</p>
              <p className={`text-lg font-semibold ${getScoreColor(feedback.scores.discipline)}`}>
                {feedback.scores.discipline}/10
              </p>
            </div>
            <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted" : "bg-slate-50"}`}>
              <p className="text-xs text-muted-foreground mb-1">Risk Management</p>
              <p className={`text-lg font-semibold ${getScoreColor(feedback.scores.riskManagement)}`}>
                {feedback.scores.riskManagement}/10
              </p>
            </div>
            <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted" : "bg-slate-50"}`}>
              <p className="text-xs text-muted-foreground mb-1">Consistency</p>
              <p className={`text-lg font-semibold ${getScoreColor(feedback.scores.consistency)}`}>
                {feedback.scores.consistency}/10
              </p>
            </div>
          </div>

          {/* Your Question */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              What You Asked
            </h4>
            <p className="text-sm text-muted-foreground italic">
              "{feedback.whatYouAsked}"
            </p>
          </div>

          {/* Overall Assessment */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Overall Assessment
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback.overallAssessment}
            </p>
          </div>

          {/* What's Working */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-green-600 mb-3">
              What's Working
            </h4>
            <ul className="space-y-2">
              {feedback.whatsWorking.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-3">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Hurting */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-red-600 mb-3">
              What's Hurting
            </h4>
            <ul className="space-y-2">
              {feedback.whatsHurting.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-3">
                  <span className="text-red-600 font-bold mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* One Thing to Fix */}
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              One Thing to Fix in April
            </h4>
            <p className="text-sm text-muted-foreground">
              {feedback.oneThingToFixInApril}
            </p>
          </div>

          {/* Action Items */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Action Items
            </h4>
            <div className="flex flex-wrap gap-2">
              {feedback.actionItems.map((item, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    isDark
                      ? "bg-muted hover:bg-muted/80 text-foreground"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
