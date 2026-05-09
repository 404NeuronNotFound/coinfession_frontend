"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Loader2, Cpu } from "lucide-react";
import FeedbackCard from "@/components/ui/FeedbackCard";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useAIFeedbackStore } from "@/stores/aiFeedbackStore";
import { fetchMLStatus, generateAIFeedbackMLTest, type MLStatus } from "@/api/aiFeedbackApi";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";

export default function AiFeedback() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const { toast, showToast, hideToast } = useToast();
  
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

  // ML Test state
  const [mlStatus, setMlStatus] = useState<MLStatus | null>(null);
  const [generatingML, setGeneratingML] = useState(false);
  const [mlError, setMlError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    
    loadFeedbackList();
    loadPreview();
    loadMLStatus();
  }, [isAuthenticated, router, loadFeedbackList, loadPreview]);

  const loadMLStatus = async () => {
    try {
      const status = await fetchMLStatus();
      setMlStatus(status);
    } catch (error) {
      console.error("Failed to load ML status:", error);
    }
  };

  const handleGenerateML = async () => {
    setGeneratingML(true);
    setMlError(null);
    
    try {
      await generateAIFeedbackMLTest();
      showToast("ML feedback generated successfully!", "success", 3000);
      await loadFeedbackList();
    } catch (error: any) {
      const errorMsg = error?.message || "Failed to generate ML feedback";
      setMlError(errorMsg);
      showToast(errorMsg, "error", 3000);
    } finally {
      setGeneratingML(false);
    }
  };

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
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              AI Feedback
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Smart analysis of your trading patterns and emotions
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
                  Analyze your {preview?.total_trades || 0} trades, emotion tags, and P&L to get actionable insights.
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
                {mlStatus?.can_train_ml && (
                  <Button 
                    variant="outline"
                    className="gap-2 whitespace-nowrap border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/20"
                    onClick={handleGenerateML}
                    disabled={generatingML}
                  >
                    {generatingML ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Training ML...
                      </>
                    ) : (
                      <>
                        <Cpu className="w-4 h-4" />
                        ML Test
                      </>
                    )}
                  </Button>
                )}
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

            {/* ML Status Info */}
            {mlStatus && !mlStatus.can_train_ml && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-purple-950/20 border-purple-700/30" : "bg-purple-50 border-purple-200"}`}>
                <p className={`text-sm font-semibold ${d ? "text-purple-200" : "text-purple-800"} mb-1`}>
                  ML Analysis Locked
                </p>
                <p className={`text-xs ${d ? "text-purple-300" : "text-purple-700"}`}>
                  {mlStatus.message}
                </p>
              </div>
            )}

            {/* Generating state */}
            {generating && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-blue-950/20 border-blue-700/30" : "bg-blue-50 border-blue-200"}`}>
                <p className={`text-sm ${d ? "text-blue-200" : "text-blue-800"}`}>
                  Analyzing your trades... This should only take a moment.
                </p>
              </div>
            )}

            {/* ML Generating state */}
            {generatingML && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-purple-950/20 border-purple-700/30" : "bg-purple-50 border-purple-200"}`}>
                <p className={`text-sm ${d ? "text-purple-200" : "text-purple-800"}`}>
                  Training ML models on your {mlStatus?.closed_trades} closed trades... This may take a few seconds.
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

            {/* ML error */}
            {mlError && (
              <div className={`mt-4 rounded-lg p-4 border ${d ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
                <p className={`text-sm ${d ? "text-red-200" : "text-red-800"}`}>
                  {mlError}
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
