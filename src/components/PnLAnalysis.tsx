"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/ui/DashboardHeader";
import PnLStats from "@/components/ui/PnLStats";
import CumulativePnLChart from "@/components/ui/CumulativePnLChart";
import MonthlyRealizedPnL from "@/components/ui/MonthlyRealizedPnL";
import WinLossRatio from "@/components/ui/WinLossRatio";
import PnLByCoin from "@/components/ui/PnLByCoin";
import FeeImpact from "@/components/ui/FeeImpact";
import BestWorstTrades from "@/components/ui/BestWorstTrades";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";

const MOCK_STATS = {
  realizedPnL: 53620,
  winRate: 64,
  avgWin: 1240,
  avgLoss: 388,
  profitFactor: 2.19,
};

const MOCK_CUMULATIVE_DATA = [
  { month: "Nov", pnl: 500 },
  { month: "Dec", pnl: 1200 },
  { month: "Jan", pnl: 800 },
  { month: "Feb", pnl: 1500 },
  { month: "Mar", pnl: 2100 },
  { month: "Apr", pnl: 3200 },
];

const MOCK_MONTHLY_PNL = [
  { month: "Nov", pnl: 500 },
  { month: "Dec", pnl: 700 },
  { month: "Jan", pnl: -400 },
  { month: "Feb", pnl: 700 },
  { month: "Mar", pnl: 600 },
  { month: "Apr", pnl: 1100 },
];

const MOCK_WIN_LOSS = {
  wins: 16,
  losses: 9,
  breakEven: 2,
};

const MOCK_PNL_BY_COIN = [
  { coin: "Bitcoin", ticker: "BTC", pnl: 2240, color: "#F7931A" },
  { coin: "Ethereum", ticker: "ETH", pnl: 497, color: "#627EEA" },
  { coin: "Solana", ticker: "SOL", pnl: 820, color: "#9945FF" },
  { coin: "Avalanche", ticker: "AVAX", pnl: -95, color: "#E84142" },
];

const MOCK_FEE_IMPACT = {
  totalFees: 504,
  profitsFromFees: 1200,
  feePercentage: 4.6,
};

const MOCK_BEST_WORST = {
  bestTrades: [
    { coin: "Bitcoin", date: "Apr 5", pnl: 1240, type: "SELL" },
    { coin: "Ethereum", date: "Feb 28", pnl: 497, type: "SELL" },
    { coin: "Solana", date: "Mar 20", pnl: 672, type: "SELL" },
  ],
  worstTrades: [
    { coin: "Ethereum", date: "Apr 12", pnl: -480, type: "SELL" },
    { coin: "Avalanche", date: "Mar 10", pnl: -95, type: "SELL" },
    { coin: "Bitcoin", date: "Jan 14", pnl: -562, type: "SELL" },
  ],
};

export default function PnLAnalysis() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [timeframe, setTimeframe] = useState("1M");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const stats = [
    {
      label: "Realized P&L",
      value: `$${MOCK_STATS.realizedPnL.toLocaleString()}`,
      subtext: "all closed trades",
      color: "success" as const,
    },
    {
      label: "Win Rate",
      value: `${MOCK_STATS.winRate}%`,
      subtext: "winning trades",
      color: "success" as const,
    },
    {
      label: "Avg Win",
      value: `$${MOCK_STATS.avgWin}`,
      subtext: "per profitable trade",
      color: "success" as const,
    },
    {
      label: "Avg Loss",
      value: `-$${MOCK_STATS.avgLoss}`,
      subtext: "per losing trade",
      color: "warning" as const,
    },
    {
      label: "Profit Factor",
      value: `${MOCK_STATS.profitFactor}x`,
      subtext: "wins / losses",
      color: "success" as const,
    },
  ];

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              P&L Analysis
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Closed trades only · selected period & timeframe
            </p>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {["1M", "3M", "6M", "YTD", "All"].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs sm:text-sm"
              >
                {tf}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              AI Insight →
            </Button>
          </div>
        </div>

        {/* Stats */}
        <section className="mb-6 sm:mb-8">
          <PnLStats stats={stats} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Cumulative P&L */}
          <CumulativePnLChart data={MOCK_CUMULATIVE_DATA} />

          {/* Win/Loss Ratio */}
          <WinLossRatio data={MOCK_WIN_LOSS} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Monthly Realized P&L */}
          <MonthlyRealizedPnL data={MOCK_MONTHLY_PNL} />

          {/* Fee Impact */}
          <FeeImpact data={MOCK_FEE_IMPACT} />
        </div>

        {/* P&L by Coin */}
        <section className="mb-6 sm:mb-8">
          <PnLByCoin data={MOCK_PNL_BY_COIN} />
        </section>

        {/* Best & Worst Trades */}
        <section>
          <BestWorstTrades data={MOCK_BEST_WORST} />
        </section>
      </div>
    </main>
  );
}
