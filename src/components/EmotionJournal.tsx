"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import EmotionStats from "@/components/ui/EmotionStats";
import WinRateByEmotion from "@/components/ui/WinRateByEmotion";
import AvgPnLByEmotion from "@/components/ui/AvgPnLByEmotion";
import PatternInsights from "@/components/ui/PatternInsights";
import EmotionTradesList from "@/components/ui/EmotionTradesList";
import TradingActivityHeatmap from "@/components/ui/TradingActivityHeatmap";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";

const MOCK_EMOTION_STATS = [
  { emotion: "Disciplined", count: 8, pnl: 5420, color: "#22c55e" },
  { emotion: "Patient", count: 4, pnl: 1240, color: "#3b82f6" },
  { emotion: "Overconfident", count: 3, pnl: -585, color: "#f59e0b" },
  { emotion: "FOMO", count: 4, pnl: -890, color: "#ef4444" },
  { emotion: "Panic Sold", count: 5, pnl: -340, color: "#8b5cf6" },
  { emotion: "Hesitant", count: 3, pnl: 580, color: "#6b7280" },
];

const MOCK_PATTERN_INSIGHTS = [
  {
    title: "Disciplined trades are your best trades",
    description: "28% win rate when you trade with a plan. These 15 trades earned an average of +$420 each. Keep going.",
    color: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
  },
  {
    title: "Panic selling is destroying value",
    description: "Every panic sell averaged -$340 in losses. 4 of 5 cases the price recovered within 7 days. You are selling the dip.",
    color: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-900",
  },
  {
    title: "FOMO entries have a 25% win rate",
    description: "You're chasing pumps. 4 of your FOMO trades entered after a 15% move. Average return: -8% per position.",
    color: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-900",
  },
];

const MOCK_TRADES = [
  { id: 1, date: "Apr 15", type: "BUY", coin: "Bitcoin", ticker: "BTC", emotion: "Disciplined", note: "DCA entry at 200MA", pnl: "Open", color: "#22c55e" },
  { id: 2, date: "Apr 12", type: "SELL", coin: "Ethereum", ticker: "ETH", emotion: "Panic Sold", note: "Sold dip after 3% drop, could have held", pnl: "-$388", color: "#8b5cf6" },
  { id: 3, date: "Apr 10", type: "BUY", coin: "Solana", ticker: "SOL", emotion: "FOMO", note: "Saw it pumping 15% on Twitter", pnl: "Open", color: "#ef4444" },
  { id: 4, date: "Apr 5", type: "SELL", coin: "Bitcoin", ticker: "BTC", emotion: "Disciplined", note: "Hit my profit target as planned", pnl: "+$801", color: "#22c55e" },
  { id: 5, date: "Mar 28", type: "BUY", coin: "Solana", ticker: "SOL", emotion: "Patient", note: "Waiting 10am for 2 weeks, finally entered", pnl: "Open", color: "#3b82f6" },
  { id: 6, date: "Mar 20", type: "SELL", coin: "Solana", ticker: "SOL", emotion: "Disciplined", note: "Partial exit at resistance, keeping half", pnl: "+$672", color: "#22c55e" },
  { id: 7, date: "Mar 15", type: "BUY", coin: "Ethereum", ticker: "ETH", emotion: "Patient", note: "Accumulating, this for 2 weeks, finally entered", pnl: "Open", color: "#3b82f6" },
  { id: 8, date: "Mar 10", type: "SELL", coin: "Avalanche", ticker: "AVAX", emotion: "Panic Sold", note: "Stop loss hit, should have held through it", pnl: "-$95", color: "#8b5cf6" },
];

export default function EmotionJournal() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [selectedEmotion, setSelectedEmotion] = useState("All");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const filteredTrades = selectedEmotion === "All" 
    ? MOCK_TRADES 
    : MOCK_TRADES.filter(t => t.emotion === selectedEmotion);

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <DashboardHeader
          title="Emotion Journal"
          subtitle="See how your emotions affect your trading outcomes"
          onLogTrade={() => console.log("AI pattern analysis")}
          onExport={() => console.log("Export")}
        />

        {/* Emotion Stats */}
        <section className="mb-6 sm:mb-8">
          <EmotionStats stats={MOCK_EMOTION_STATS} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Win Rate by Emotion */}
          <WinRateByEmotion data={MOCK_EMOTION_STATS} />

          {/* Avg P&L by Emotion */}
          <AvgPnLByEmotion data={MOCK_EMOTION_STATS} />
        </div>

        {/* Pattern Insights */}
        <section className="mb-6 sm:mb-8">
          <PatternInsights insights={MOCK_PATTERN_INSIGHTS} />
        </section>

        {/* Emotion Filter */}
        <section className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            {["All", ...MOCK_EMOTION_STATS.map(e => e.emotion)].map((emotion) => (
              <Button
                key={emotion}
                variant={selectedEmotion === emotion ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEmotion(emotion)}
                className="text-xs sm:text-sm"
              >
                {emotion}
              </Button>
            ))}
          </div>
        </section>

        {/* Trades List */}
        <section className="mb-6 sm:mb-8">
          <EmotionTradesList trades={filteredTrades} />
        </section>

        {/* Trading Activity Heatmap */}
        <section>
          <TradingActivityHeatmap />
        </section>
      </div>
    </main>
  );
}
