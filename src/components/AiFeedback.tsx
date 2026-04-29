"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Loader2 } from "lucide-react";
import FeedbackCard from "@/components/ui/FeedbackCard";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useAIFeedbackStore } from "@/stores/aiFeedbackStore";

export default function AiFeedback() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  
  const {
    feedbackList,
    preview,
    generating,
    loadingList,
    loadingPreview,
    generateError,
    expandedId,
    loadFeedbackList,
    loadPreview,
    generate,
    toggleExpanded,
  } = useAIFeedbackStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    
    loadFeedbackList();
    loadPreview();
  }, [isAuthenticated, router, loadFeedbackList, loadPreview]);

  if (!isAuthenticated) return null;

  const formatPnL = (value: number) => {
    const sign = value >= 0 ? "+" : "-";
    return `${sign}$${Math.abs(value).toFixed(0)}`;
  };

  const formatWinRate = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              AI Feedback
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Brutally honest analysis of your trading journal
            </p>
          </div>
        </div>

        {/* Current Month Feedback Prompt */}
        <section className="mb-6 sm:mb-8">
          <div
            className={`rounded-lg border p-6 sm:p-8 ${
              d
                ? "bg-muted/50 border-border"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  Current Analysis
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI will analyze your {preview?.total_trades || 0} trades, emotion tags, and P&L, and give you an unfiltered assessment.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 whitespace-nowrap"
                  disabled
                >
                  <Eye className="w-4 h-4" />
                  View Prompt
                </Button>
                <Button 
                  className="gap-2 whitespace-nowrap"
                  onClick={() => generate()}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Feedback
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className={`rounded p-3 sm:p-4 ${d ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Trades Analyzed</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  {loadingPreview ? "—" : preview?.total_trades || 0}
                </p>
              </div>
              <div className={`rounded p-3 sm:p-4 ${d ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Emotions Tagged</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">
                  {loadingPreview ? "—" : preview?.emotions_tagged || 0}
                </p>
              </div>
              <div className={`rounded p-3 sm:p-4 ${d ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                <p className="text-lg sm:text-xl font-semibold text-green-600">
                  {loadingPreview ? "—" : preview ? formatWinRate(preview.win_rate) : "—"}
                </p>
              </div>
            </div>

            {/* Warning if not enough data */}
            {preview && !preview.has_enough_data && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-yellow-950/20 border-yellow-700/30" : "bg-yellow-50 border-yellow-200"}`}>
                <p className={`text-sm ${d ? "text-yellow-200" : "text-yellow-800"}`}>
                  Not enough data for meaningful analysis. Add more trades with emotion tags to get better feedback.
                </p>
              </div>
            )}

            {/* Generating state */}
            {generating && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-blue-950/20 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                <p className={`text-sm ${d ? "text-blue-200" : "text-blue-800"}`}>
                  Analyzing your trades... This may take 5-15 seconds.
                </p>
              </div>
            )}

            {/* Generate error */}
            {generateError && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
                <p className={`text-sm ${d ? "text-red-200" : "text-red-800"}`}>
                  {generateError}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Historical Feedback Cards */}
        <section className="space-y-4">
          {loadingList ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : feedbackList.length === 0 ? (
            <div className={`rounded-lg border p-12 text-center ${d ? "bg-background border-border" : "bg-white border-slate-200"}`}>
              <p className="text-muted-foreground">
                No feedback generated yet. Click "Generate Feedback" above to get started.
              </p>
            </div>
          ) : (
            feedbackList.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                isExpanded={expandedId === feedback.id}
                onToggle={() => toggleExpanded(feedback.id)}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
