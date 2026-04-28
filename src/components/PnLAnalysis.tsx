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
import { usePnlAnalysisStore } from "@/stores/pnlAnalysisStore";
import { Button } from "@/components/ui/button";

export default function PnLAnalysis() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [timeframe, setTimeframe] = useState("1M");
  
  // P&L Analysis store
  const { data, loading, error, loadPnlAnalysis } = usePnlAnalysisStore();
  
  // Derived data from store
  const summary = data?.summary ?? null;
  const cumulativePnl = data?.cumulative_pnl ?? [];
  const monthlyPnl = data?.monthly_pnl ?? [];
  const pnlByCoin = data?.pnl_by_coin ?? [];
  const winLossRatio = data?.win_loss_ratio ?? null;
  const feeImpact = data?.fee_impact ?? null;
  const topWins = data?.top_wins ?? [];
  const topLosses = data?.top_losses ?? [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      // Load P&L analysis data on mount
      loadPnlAnalysis();
    }
  }, [isAuthenticated, router, loadPnlAnalysis]);

  if (!isAuthenticated) return null;

  // Format currency helpers
  const fmtLarge = (n: number) => 
    "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  const fmtPrecise = (n: number) => 
    "$" + n.toFixed(2);

  // Build stats array for PnLStats component
  const realizedPnlColor: "success" | "warning" = summary && summary.realized_pnl >= 0 ? "success" : "warning";
  const profitFactorColor: "success" | "warning" = summary && summary.profit_factor >= 1 ? "success" : "warning";
  
  const stats = [
    {
      label: "Realized P&L",
      value: summary ? fmtLarge(summary.realized_pnl) : "—",
      subtext: "all closed trades",
      color: realizedPnlColor,
    },
    {
      label: "Win Rate",
      value: summary ? `${Math.round(summary.win_rate)}%` : "—",
      subtext: "winning trades",
      color: "success" as const,
    },
    {
      label: "Avg Win",
      value: summary ? fmtLarge(summary.avg_win) : "—",
      subtext: "per profitable trade",
      color: "success" as const,
    },
    {
      label: "Avg Loss",
      value: summary ? `-${fmtLarge(Math.abs(summary.avg_loss))}` : "—",
      subtext: "per losing trade",
      color: "warning" as const,
    },
    {
      label: "Profit Factor",
      value: summary ? `${summary.profit_factor.toFixed(2)}x` : "—",
      subtext: "wins / losses",
      color: profitFactorColor,
    },
  ];

  // Transform cumulative P&L data for chart
  const cumulativeChartData = cumulativePnl.map((point) => ({
    month: point.date,
    pnl: point.cumulative_pnl,
  }));

  // Transform monthly P&L data for chart
  const monthlyChartData = monthlyPnl.map((m) => ({
    month: m.label,
    pnl: m.realized_pnl,
  }));

  // Transform win/loss ratio data
  const winLossData = winLossRatio ? {
    wins: winLossRatio.winning_count,
    losses: winLossRatio.losing_count,
    breakEven: winLossRatio.breakeven_count,
  } : { wins: 0, losses: 0, breakEven: 0 };

  // Transform P&L by coin data
  const pnlByCoinData = pnlByCoin.map((coin) => ({
    coin: coin.name,
    ticker: coin.symbol,
    pnl: coin.realized_pnl,
    color: "#3b82f6", // Default color, can be enhanced with coin colors
  }));

  // Transform fee impact data
  const feeImpactData = feeImpact ? {
    totalFees: feeImpact.total_fees,
    profitsFromFees: feeImpact.gross_profits,
    feePercentage: feeImpact.fee_impact_pct,
  } : { totalFees: 0, profitsFromFees: 0, feePercentage: 0 };

  // Transform best/worst trades data
  const bestWorstData = {
    bestTrades: topWins.map((trade) => ({
      coin: trade.coin_name,
      date: trade.date,
      pnl: trade.realized_pnl,
      type: trade.trade_type.toUpperCase(),
    })),
    worstTrades: topLosses.map((trade) => ({
      coin: trade.coin_name,
      date: trade.date,
      pnl: trade.realized_pnl,
      type: trade.trade_type.toUpperCase(),
    })),
  };

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

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        <div style={{ opacity: loading ? 0.6 : 1 }}>
          {/* Stats */}
          <section className="mb-6 sm:mb-8">
            <PnLStats stats={stats} />
          </section>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Cumulative P&L */}
            <CumulativePnLChart data={cumulativeChartData} />

            {/* Win/Loss Ratio */}
            <WinLossRatio data={winLossData} />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Monthly Realized P&L */}
            <MonthlyRealizedPnL data={monthlyChartData} />

            {/* Fee Impact */}
            <FeeImpact data={feeImpactData} />
          </div>

          {/* P&L by Coin */}
          {pnlByCoinData.length > 0 && (
            <section className="mb-6 sm:mb-8">
              <PnLByCoin data={pnlByCoinData} />
            </section>
          )}

          {/* Best & Worst Trades */}
          {(bestWorstData.bestTrades.length > 0 || bestWorstData.worstTrades.length > 0) && (
            <section>
              <BestWorstTrades data={bestWorstData} />
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
