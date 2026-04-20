"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import FeedbackPrompt from "@/components/ui/FeedbackPrompt";
import FeedbackCard from "@/components/ui/FeedbackCard";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

interface Feedback {
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
}

const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: "1",
    month: "March 2026",
    date: "Generated Mar 20 · 10 trades",
    tradesAnalyzed: 10,
    emotionsTagged: 8,
    pnlMetrics: "+$780",
    scores: {
      discipline: 8,
      riskManagement: 6,
      consistency: 7,
    },
    whatYouAsked: "Analyze my March 2026 trading journal. Tell me what I'm doing wrong and what's actually working. Be direct.",
    overallAssessment: "March is your best month in the last six. A 70% win rate with 10 trades is solid, and more importantly, your disciplined trades had a near-perfect record. You are capable of trading well. The problem is you keep interrupting yourself.",
    whatsWorking: [
      "Your planned entries are excellent. Every trade tagged 'Disciplined' or 'Patient' was profitable this month. You clearly know how to identify good setups when you wait for them.",
      "Partial exits show maturity. Closing 60% of your SOL position at resistance while holding the rest is textbook good trading.",
    ],
    whatsHurting: [
      "You sell panic-sold. This AVAX loss sits on Mar 10 was emotional, not strategic. It hit your stop, bounced 15% in 5 days. You placed that stop too tight and shook you out.",
      "Position sizing is uneven. Your BTC trades are appropriately sized. Your altcoin entries are too big relative to their volatility. You're taking more on the coins you.",
    ],
    oneThingToFixInApril: "Widen your stop losses on altcoins by 1.5x and reduce position size by the same factor to keep risk constant. You'll get shaken out less and your stats will improve without changing your entry logic.",
    actionItems: [
      "Position sizing help →",
      "Stop loss strategy →",
      "Compare months →",
    ],
  },
  {
    id: "2",
    month: "February 2026",
    date: "Generated Feb 28 · 6 trades",
    tradesAnalyzed: 6,
    emotionsTagged: 5,
    pnlMetrics: "+$520",
    scores: {
      discipline: 7,
      riskManagement: 5,
      consistency: 6,
    },
    whatYouAsked: "Review my February trades",
    overallAssessment: "Solid month with good fundamentals. Your win rate is 67% which is above average.",
    whatsWorking: [
      "Consistent entry quality",
      "Good trade selection",
    ],
    whatsHurting: [
      "Some emotional exits",
      "Position sizing inconsistency",
    ],
    oneThingToFixInApril: "Focus on consistent position sizing",
    actionItems: [
      "Review entries →",
      "Risk management →",
    ],
  },
  {
    id: "3",
    month: "January 2026",
    date: "Generated Jan 31 · 5 trades",
    tradesAnalyzed: 5,
    emotionsTagged: 4,
    pnlMetrics: "-$210",
    scores: {
      discipline: 5,
      riskManagement: 4,
      consistency: 4,
    },
    whatYouAsked: "Analyze January performance",
    overallAssessment: "Challenging month with learning opportunities. Focus on discipline.",
    whatsWorking: [
      "Some good entries identified",
    ],
    whatsHurting: [
      "Emotional trading",
      "Poor risk management",
      "Inconsistent execution",
    ],
    oneThingToFixInApril: "Implement strict trading rules",
    actionItems: [
      "Trading rules →",
      "Emotion control →",
    ],
  },
];

export default function AiFeedback() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [expandedId, setExpandedId] = useState<string | null>("1");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const currentMonth = {
    month: "April 2026",
    tradesAnalyzed: 8,
    emotionsTagged: 7,
    pnlMetrics: "+$413",
    description: "AI will analyze your 8 trades, emotion tags, and P&L, and give you an unfiltered assessment.",
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
          <FeedbackPrompt data={currentMonth} />
        </section>

        {/* Historical Feedback Cards */}
        <section className="space-y-4">
          {MOCK_FEEDBACKS.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              isExpanded={expandedId === feedback.id}
              onToggle={() => setExpandedId(expandedId === feedback.id ? null : feedback.id)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
