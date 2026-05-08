"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EmotionStats from "@/components/ui/EmotionStats";
import WinRateByEmotion from "@/components/ui/WinRateByEmotion";
import AvgPnLByEmotion from "@/components/ui/AvgPnLByEmotion";
import PatternInsights from "@/components/ui/PatternInsights";
import EmotionTradesList from "@/components/ui/EmotionTradesList";
import TradingActivityHeatmap from "@/components/ui/TradingActivityHeatmap";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useEmotionJournalStore } from "@/stores/emotionJournalStore";
import { Button } from "@/components/ui/button";

export default function EmotionJournal() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated, accessToken } = useAuthStore();
  
  const {
    emotionStats,
    filteredTrades,
    insights,
    heatmap,
    availableYears,
    selectedYear,
    activeEmotionId,
    loading,
    error,
    loadJournal,
    setActiveEmotion,
    setSelectedYear,
    clearError,
  } = useEmotionJournalStore();

  // Load data on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (accessToken) {
      loadJournal(accessToken);
    }
  }, [isAuthenticated, accessToken, loadJournal, router]);

  if (!isAuthenticated) return null;

  const handleEmotionClick = (emotionId: number) => {
    setActiveEmotion(emotionId);
  };

  const handleShowAll = () => {
    setActiveEmotion(null);
  };

  const handleYearChange = (year: number) => {
    if (accessToken) {
      setSelectedYear(year, accessToken);
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              Emotion Journal
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              See how your emotions affect your trading outcomes
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start justify-between">
              <div className="text-sm text-red-900">{error}</div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700 font-semibold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm text-blue-900">Loading emotion journal...</div>
          </div>
        )}

        {/* Emotion Stats */}
        {emotionStats.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <EmotionStats stats={emotionStats} />
          </section>
        )}

        {/* Charts Grid */}
        {emotionStats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Win Rate by Emotion */}
            <WinRateByEmotion data={emotionStats} />

            {/* Avg P&L by Emotion */}
            <AvgPnLByEmotion data={emotionStats} />
          </div>
        )}

        {/* Pattern Insights */}
        {insights.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <PatternInsights insights={insights} />
          </section>
        )}

        {/* Trades List with Emotion Filter */}
        {emotionStats.length > 0 && (
          <section className="mb-6 sm:mb-8">
            {/* Emotion Filter for Trades Only */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeEmotionId === null ? "default" : "outline"}
                  size="sm"
                  onClick={handleShowAll}
                  className="text-xs sm:text-sm"
                >
                  All
                </Button>
                {emotionStats.map((emotion) => (
                  <Button
                    key={emotion.id}
                    variant={activeEmotionId === emotion.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleEmotionClick(emotion.id)}
                    className="text-xs sm:text-sm"
                  >
                    {emotion.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trades List */}
            {filteredTrades.length > 0 && <EmotionTradesList trades={filteredTrades} />}
          </section>
        )}

        {/* Trading Activity Heatmap */}
        <section>
          <TradingActivityHeatmap 
            data={heatmap} 
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </section>
      </div>
    </main>
  );
}
