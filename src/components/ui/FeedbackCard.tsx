"use client";

import { ChevronDown } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";
import type { AIFeedbackRecord } from "@/types/aiFeedback.types";

interface FeedbackCardProps {
  feedback: AIFeedbackRecord;
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
    if (score >= 7) return "text-green-600";
    if (score >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 7) return isDark ? "bg-green-900/30" : "bg-green-50";
    if (score >= 4) return isDark ? "bg-yellow-900/30" : "bg-yellow-50";
    return isDark ? "bg-red-900/30" : "bg-red-50";
  };

  const parsed = feedback.feedback_parsed;

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
            {feedback.month_label}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {feedback.prompt_summary.substring(0, 100)}
            {feedback.prompt_summary.length > 100 ? "..." : ""}
          </p>
        </div>

        {/* Scores Preview */}
        {parsed?.scores && (
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Discipline</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.discipline)}`}>
                {parsed.scores.discipline}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Risk Mgmt</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.risk_mgmt)}`}>
                {parsed.scores.risk_mgmt}/10
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Consistency</p>
              <p className={`text-sm font-semibold ${getScoreColor(parsed.scores.consistency)}`}>
                {parsed.scores.consistency}/10
              </p>
            </div>
          </div>
        )}

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
          {parsed ? (
            <>
              {/* Scores Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.discipline)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Discipline</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.discipline)}`}>
                    {parsed.scores.discipline}/10
                  </p>
                </div>
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.risk_mgmt)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Risk Management</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.risk_mgmt)}`}>
                    {parsed.scores.risk_mgmt}/10
                  </p>
                </div>
                <div className={`rounded p-3 sm:p-4 ${getScoreBgColor(parsed.scores.consistency)}`}>
                  <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                  <p className={`text-lg font-semibold ${getScoreColor(parsed.scores.consistency)}`}>
                    {parsed.scores.consistency}/10
                  </p>
                </div>
              </div>

              {/* Your Question */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  What You Asked
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  "{feedback.prompt_summary}"
                </p>
              </div>

              {/* Overall Assessment */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Overall Assessment
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {parsed.overall}
                </p>
              </div>

              {/* What's Working */}
              {parsed.whats_working && parsed.whats_working.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-600 mb-3">
                    What's Working
                  </h4>
                  <ul className="space-y-3">
                    {parsed.whats_working.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <div className="flex gap-3">
                          <span className="text-green-600 font-bold mt-0.5">✓</span>
                          <div>
                            <p className="font-semibold text-foreground mb-1">{item.title}</p>
                            <p>{item.body}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Hurting */}
              {parsed.whats_hurting && parsed.whats_hurting.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-red-600 mb-3">
                    What's Hurting
                  </h4>
                  <ul className="space-y-3">
                    {parsed.whats_hurting.map((item, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        <div className="flex gap-3">
                          <span className="text-red-600 font-bold mt-0.5">✕</span>
                          <div>
                            <p className="font-semibold text-foreground mb-1">{item.title}</p>
                            <p>{item.body}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* One Thing to Fix */}
              {parsed.one_thing_to_fix && (
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    One Thing to Fix
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {parsed.one_thing_to_fix}
                  </p>
                </div>
              )}

              {/* Action Items */}
              {parsed.action_items && parsed.action_items.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Action Items
                  </h4>
                  <div className="space-y-3">
                    {parsed.action_items.map((item, idx) => {
                      const priorityColors = {
                        high: isDark ? "bg-red-900/30 border-red-700/30" : "bg-red-50 border-red-200",
                        medium: isDark ? "bg-yellow-900/30 border-yellow-700/30" : "bg-yellow-50 border-yellow-200",
                        low: isDark ? "bg-blue-900/30 border-blue-700/30" : "bg-blue-50 border-blue-200",
                      };
                      
                      const priorityBadgeColors = {
                        high: "bg-red-600 text-white",
                        medium: "bg-yellow-600 text-white",
                        low: "bg-blue-600 text-white",
                      };

                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${priorityColors[item.priority]}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h5 className="text-sm font-semibold text-foreground">
                              {item.title}
                            </h5>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${priorityBadgeColors[item.priority]}`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Prompt Summary
              </h4>
              <p className="text-sm text-muted-foreground">
                {feedback.prompt_summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
