"use client";

import { useEffect } from "react";
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
import { useMonthlyReportStore } from "@/stores/monthlyReportStore";
import { Button } from "@/components/ui/button";
import { getCoinColor } from "@/lib/coinColors";

export default function MonthlyReport() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  
  const {
    availableMonths,
    selectedYear,
    selectedMonth,
    detail,
    loadingList,
    loadingDetail,
    error,
    loadReportList,
    selectMonth,
  } = useMonthlyReportStore();

  // Extract data from detail
  const metrics = detail?.metrics ?? null;
  const trades = detail?.trades ?? [];
  const bestWorst = detail?.best_worst ?? null;
  const pnlByCoin = detail?.pnl_by_coin ?? [];
  const monthlyBars = detail?.monthly_bars ?? [];
  const cumulativePnl = detail?.cumulative_pnl ?? [];

  // Load report list on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    
    loadReportList();
  }, [isAuthenticated, router, loadReportList]);

  if (!isAuthenticated) return null;

  // Format dollar values
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  
  const fmtDec = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  // Build stats array for MonthlyStats component
  const stats = metrics ? [
    {
      label: "Realized P&L",
      value: metrics.realized_pnl >= 0 
        ? `+${fmt(metrics.realized_pnl)}` 
        : fmt(metrics.realized_pnl),
      subtext: metrics.month_label,
      color: (metrics.realized_pnl >= 0 ? "success" : "warning") as "success" | "warning",
    },
    {
      label: "Win Rate",
      value: `${Math.round(metrics.win_rate)}%`,
      subtext: `${metrics.winning_trades} of ${metrics.closed_trades} trades`,
      color: (metrics.win_rate >= 50 ? "success" : "warning") as "success" | "warning",
    },
    {
      label: "Total Trades",
      value: `${metrics.total_trades}`,
      subtext: `${metrics.spot_trades} spot • ${metrics.leverage_trades} leverage`,
      color: "default" as "default",
    },
    {
      label: "Avg Per Trade",
      value: metrics.avg_pnl_per_trade >= 0 
        ? `+${fmt(Math.abs(metrics.avg_pnl_per_trade))}` 
        : `-${fmt(Math.abs(metrics.avg_pnl_per_trade))}`,
      subtext: "realized P&L",
      color: (metrics.avg_pnl_per_trade >= 0 ? "success" : "warning") as "success" | "warning",
    },
    {
      label: "Largest Win",
      value: `+${fmt(metrics.largest_win)}`,
      subtext: "best trade",
      color: "success" as "success",
    },
    {
      label: "Largest Loss",
      value: metrics.largest_loss < 0 ? `${fmt(metrics.largest_loss)}` : "$0",
      subtext: metrics.largest_loss < 0 ? "worst trade" : "no losses",
      color: (metrics.largest_loss < 0 ? "warning" : "default") as "warning" | "default",
    },
    {
      label: "Profit Factor",
      value: `${metrics.profit_factor.toFixed(2)}`,
      subtext: metrics.profit_factor >= 1 ? "profitable" : "unprofitable",
      color: (metrics.profit_factor >= 1 ? "success" : "warning") as "success" | "warning",
    },
    {
      label: "Fees Paid",
      value: `${fmt(metrics.total_fees)}`,
      subtext: `${metrics.fees_pct_of_pnl.toFixed(1)}% of P&L`,
      color: "warning" as "warning",
    },
  ] : [
    { label: "Realized P&L", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Win Rate", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Total Trades", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Avg Per Trade", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Largest Win", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Largest Loss", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Profit Factor", value: "—", subtext: "loading...", color: "default" as "default" },
    { label: "Fees Paid", value: "—", subtext: "loading...", color: "default" as "default" },
  ];

  // Transform monthlyBars for MonthlyRealizedPnLChart
  const monthlyPnlData = monthlyBars.map(bar => ({
    month: bar.month_label,
    pnl: bar.realized_pnl,
    isSelected: bar.year === selectedYear && bar.month === selectedMonth,
  }));

  // Transform cumulativePnl for CumulativePnLAllTime
  const cumulativeData = cumulativePnl.map(point => ({
    month: point.month_label,
    pnl: point.cumulative_pnl,
  }));

  // Transform bestWorst for BestWorstTradeMonth
  const bestWorstData = bestWorst && (bestWorst.best_trade || bestWorst.worst_trade) ? {
    best: bestWorst.best_trade ? {
      coin: bestWorst.best_trade.coin_name,
      ticker: bestWorst.best_trade.coin_symbol,
      type: bestWorst.best_trade.trade_type.toUpperCase(),
      buyPrice: bestWorst.best_trade.buy_price ?? 0,
      sellPrice: bestWorst.best_trade.sell_price ?? 0,
      pnl: bestWorst.best_trade.realized_pnl ?? 0,
      emotion: bestWorst.best_trade.emotions[0]?.name ?? "—",
      date: bestWorst.best_trade.date,
      quantity: bestWorst.best_trade.quantity,
    } : null,
    worst: bestWorst.worst_trade ? {
      coin: bestWorst.worst_trade.coin_name,
      ticker: bestWorst.worst_trade.coin_symbol,
      type: bestWorst.worst_trade.trade_type.toUpperCase(),
      buyPrice: bestWorst.worst_trade.buy_price ?? 0,
      sellPrice: bestWorst.worst_trade.sell_price ?? 0,
      pnl: bestWorst.worst_trade.realized_pnl ?? 0,
      emotion: bestWorst.worst_trade.emotions[0]?.name ?? "—",
      date: bestWorst.worst_trade.date,
      quantity: bestWorst.worst_trade.quantity,
    } : null,
  } : null;

  // Transform trades for MonthTradesList
  const tradesData = trades.map(trade => ({
    date: trade.date,
    type: trade.trade_type.toUpperCase() as "BUY" | "SELL",
    ticker: trade.coin_symbol,
    price: trade.buy_price ?? trade.sell_price ?? 0,
    emotion: trade.emotions[0]?.name ?? "—",
    status: trade.is_open ? "Open" : undefined,
    pnl: trade.realized_pnl ?? undefined,
    quantity: trade.quantity,
  }));

  // Transform pnlByCoin for PnLByCoinMonth
  const pnlByCoinData = pnlByCoin.map(coin => ({
    coin: coin.name,
    ticker: coin.symbol,
    pnl: coin.realized_pnl,
    color: getCoinColor(coin.symbol),
  }));

  // Transform availableMonths for MonthlyReportHistory
  const historyData = availableMonths.map(month => ({
    month: month.month_label,
    trades: month.total_trades,
    winRate: Math.round(month.win_rate),
    pnl: month.realized_pnl,
    year: month.year,
    monthNum: month.month,
    isSelected: month.year === selectedYear && month.month === selectedMonth,
  }));

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
              {metrics ? metrics.month_label : "Loading..."} · presented {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Month:</span>
            {loadingList ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : availableMonths.length === 0 ? (
              <div className="text-sm text-muted-foreground">No months available</div>
            ) : (
              <select
                value={selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const [year, month] = e.target.value.split('-').map(Number);
                    selectMonth(year, month);
                  }
                }}
                disabled={loadingDetail}
                className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[180px]"
              >
                <option value="" disabled>Select month</option>
                {availableMonths.map((month) => (
                  <option 
                    key={`${month.year}-${month.month}`} 
                    value={`${month.year}-${month.month}`}
                  >
                    {month.month_label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-6 sm:mb-8">
          <MonthlyStats stats={stats} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Monthly Realized P&L */}
          {loadingDetail ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading chart...</div>
            </div>
          ) : monthlyPnlData.length > 0 ? (
            <MonthlyRealizedPnLChart data={monthlyPnlData} />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No data available</div>
            </div>
          )}

          {/* Cumulative P&L All Time */}
          {loadingDetail ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading chart...</div>
            </div>
          ) : cumulativeData.length > 0 ? (
            <CumulativePnLAllTime data={cumulativeData} />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No data available</div>
            </div>
          )}
        </div>

        {/* Best & Worst Trade */}
        <section className="mb-6 sm:mb-8">
          {loadingDetail ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-48 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading trades...</div>
            </div>
          ) : bestWorstData && (bestWorstData.best || bestWorstData.worst) ? (
            <BestWorstTradeMonth data={bestWorstData as any} />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-48 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No closed trades this month</div>
            </div>
          )}
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* This Month's Trades */}
          {loadingDetail ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading trades...</div>
            </div>
          ) : tradesData.length > 0 ? (
            <MonthTradesList trades={tradesData} />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No trades this month</div>
            </div>
          )}

          {/* P&L by Coin */}
          {loadingDetail ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading P&L...</div>
            </div>
          ) : pnlByCoinData.length > 0 ? (
            <PnLByCoinMonth data={pnlByCoinData} />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No P&L data available</div>
            </div>
          )}
        </div>

        {/* Monthly Report History */}
        <section>
          {loadingList ? (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">Loading history...</div>
            </div>
          ) : historyData.length > 0 ? (
            <MonthlyReportHistory 
              data={historyData} 
              onSelectMonth={(year, month) => selectMonth(year, month)}
            />
          ) : (
            <div className="p-4 sm:p-6 rounded-lg border border-border bg-card h-64 flex items-center justify-center">
              <div className="text-sm text-muted-foreground">No history available</div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
