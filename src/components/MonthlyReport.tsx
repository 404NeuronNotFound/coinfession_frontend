"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MonthlyStats from "@/components/ui/MonthlyStats";
import MonthlyRealizedPnLChart from "@/components/ui/MonthlyRealizedPnLChart";
import CumulativePnLAllTime from "@/components/ui/CumulativePnLAllTime";
import BestWorstTradeMonth from "@/components/ui/BestWorstTradeMonth";
import MonthTradesList from "@/components/ui/MonthTradesList";
import PnLByCoinMonth from "@/components/ui/PnLByCoinMonth";
import MonthlyReportHistory from "@/components/ui/MonthlyReportHistory";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MOCK_CURRENT_MONTH = {
  month: "Apr",
  year: 2026,
  realizedPnL: 413,
  winRate: 63,
  totalTrades: 8,
  feesPaid: 46,
  avgPerTrade: 52,
};

const MOCK_MONTHLY_PNL_DATA = [
  { month: "Nov", pnl: 200 },
  { month: "Dec", pnl: 400 },
  { month: "Jan", pnl: -300 },
  { month: "Feb", pnl: 600 },
  { month: "Mar", pnl: 500 },
  { month: "Apr", pnl: 413 },
];

const MOCK_CUMULATIVE_DATA = [
  { month: "Nov", pnl: 200 },
  { month: "Dec", pnl: 600 },
  { month: "Jan", pnl: 300 },
  { month: "Feb", pnl: 900 },
  { month: "Mar", pnl: 1400 },
  { month: "Apr", pnl: 1813 },
];

const MOCK_BEST_WORST = {
  best: {
    coin: "Bitcoin",
    ticker: "BTC",
    type: "SELL",
    buyPrice: 61000,
    sellPrice: 63200,
    pnl: 801,
    emotion: "Disciplined",
    date: "Apr 5",
  },
  worst: {
    coin: "Ethereum",
    ticker: "ETH",
    type: "SELL",
    buyPrice: 2800,
    sellPrice: 2420,
    pnl: -388,
    emotion: "Panic Sold",
    date: "Apr 12",
  },
};

const MOCK_MONTH_TRADES: Array<{
  date: string;
  type: "BUY" | "SELL";
  ticker: string;
  price: number;
  emotion: string;
  status?: string;
  pnl?: number;
}> = [
  { date: "Apr 15", type: "BUY", ticker: "BTC", price: 61800, emotion: "Disciplined", status: "Open" },
  { date: "Apr 12", type: "SELL", ticker: "ETH", price: 2420, emotion: "Panic Sold", pnl: -388 },
  { date: "Apr 10", type: "BUY", ticker: "AVAX", price: 35.4, emotion: "FOMO", status: "Open" },
  { date: "Apr 5", type: "SELL", ticker: "BTC", price: 63200, emotion: "Disciplined", pnl: 801 },
  { date: "Apr 2", type: "BUY", ticker: "SOL", price: 168, emotion: "Patient", status: "Open" },
];

const MOCK_PNL_BY_COIN = [
  { coin: "Bitcoin", ticker: "BTC", pnl: 801, color: "#F7931A" },
  { coin: "Ethereum", ticker: "ETH", pnl: -388, color: "#627EEA" },
  { coin: "Solana", ticker: "SOL", pnl: 0, color: "#9945FF" },
  { coin: "Avalanche", ticker: "AVAX", pnl: 0, color: "#E84142" },
];

const MOCK_HISTORY = [
  { month: "Apr 2026", trades: 8, winRate: 63, pnl: 413 },
  { month: "Mar 2026", trades: 10, winRate: 70, pnl: 780 },
  { month: "Feb 2026", trades: 6, winRate: 67, pnl: 520 },
  { month: "Jan 2026", trades: 5, winRate: 40, pnl: -210 },
  { month: "Dec 2025", trades: 9, winRate: 56, pnl: 340 },
  { month: "Nov 2025", trades: 7, winRate: 57, pnl: 890 },
];

export default function MonthlyReport() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [selectedMonth, setSelectedMonth] = useState("Apr");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const stats = [
    {
      label: "Realized P&L",
      value: `+$${MOCK_CURRENT_MONTH.realizedPnL}`,
      subtext: "profitable month",
      color: "success" as const,
    },
    {
      label: "Win Rate",
      value: `${MOCK_CURRENT_MONTH.winRate}%`,
      subtext: `5 of 8 trades`,
      color: "success" as const,
    },
    {
      label: "Total Trades",
      value: `${MOCK_CURRENT_MONTH.totalTrades}`,
      subtext: "closed positions",
      color: "default" as const,
    },
    {
      label: "Fees Paid",
      value: `$${MOCK_CURRENT_MONTH.feesPaid}`,
      subtext: "15.7% of P&L",
      color: "warning" as const,
    },
    {
      label: "Avg Per Trade",
      value: `+$${MOCK_CURRENT_MONTH.avgPerTrade}`,
      subtext: "per trade",
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
              Monthly Report
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              April 2026 · presented Apr 20
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {MONTHS.map((month) => (
              <Button
                key={month}
                variant={selectedMonth === month ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMonth(month)}
                className="text-xs sm:text-sm"
              >
                {month}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              Export P
            </Button>
          </div>
        </div>

        {/* Stats */}
        <section className="mb-6 sm:mb-8">
          <MonthlyStats stats={stats} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Monthly Realized P&L */}
          <MonthlyRealizedPnLChart data={MOCK_MONTHLY_PNL_DATA} />

          {/* Cumulative P&L All Time */}
          <CumulativePnLAllTime data={MOCK_CUMULATIVE_DATA} />
        </div>

        {/* Best & Worst Trade */}
        <section className="mb-6 sm:mb-8">
          <BestWorstTradeMonth data={MOCK_BEST_WORST} />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* This Month's Trades */}
          <MonthTradesList trades={MOCK_MONTH_TRADES} />

          {/* P&L by Coin */}
          <PnLByCoinMonth data={MOCK_PNL_BY_COIN} />
        </div>

        {/* Monthly Report History */}
        <section>
          <MonthlyReportHistory data={MOCK_HISTORY} />
        </section>
      </div>
    </main>
  );
}
