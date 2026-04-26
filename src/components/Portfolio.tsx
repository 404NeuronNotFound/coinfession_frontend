"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PortfolioStats from "@/components/ui/PortfolioStats";
import AllocationChart from "@/components/ui/AllocationChart";
import CostBasisBreakdown from "@/components/ui/CostBasisBreakdown";
import HoldingCard from "@/components/ui/HoldingCard";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { getCoinColor } from "@/lib/coinColors";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

export default function Portfolio() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  
  const {
    portfolio,
    loading,
    refreshing,
    error,
    warning,
    pricesLive,
    loadPortfolio,
    refreshPrices,
  } = usePortfolioStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      loadPortfolio();
    }
  }, [isAuthenticated, router, loadPortfolio]);

  if (!isAuthenticated) return null;

  const summary = portfolio?.summary ?? null;
  const holdings = portfolio?.holdings ?? [];

  // Calculate stats for PortfolioStats component
  const stats = [
    {
      label: "Total Value",
      value: summary ? fmt(summary.total_value) : "—",
      subtext: summary ? `${fmt(summary.total_unrealized_pnl)} today` : "—",
      color: summary && pos(summary.total_unrealized_pnl) ? ("success" as const) : ("warning" as const),
    },
    {
      label: "Total Cost Basis",
      value: summary ? fmt(summary.total_cost) : "—",
      subtext: "amount invested",
      color: "default" as const,
    },
    {
      label: "Unrealized P&L",
      value: summary ? fmt(summary.total_unrealized_pnl) : "—",
      subtext: summary ? `${pct(summary.total_unrealized_pct)} overall` : "—",
      color: summary && pos(summary.total_unrealized_pnl) ? ("success" as const) : ("warning" as const),
    },
    {
      label: "Coins Held",
      value: summary ? `${summary.active_positions}` : "—",
      subtext: "active positions",
      color: "default" as const,
    },
  ];

  // Transform holdings for AllocationChart
  const allocationData = holdings.map((h) => ({
    coin: h.name,
    ticker: h.symbol,
    color: getCoinColor(h.symbol),
    percentage: h.allocation_pct,
  }));

  // Transform holdings for CostBasisBreakdown
  const costBasisData = holdings.map((h) => ({
    coin: h.name,
    ticker: h.symbol,
    avgBuyPrice: h.avg_buy_price,
    totalCost: h.cost_basis,
    currentValue: h.current_value,
    pnl: h.unrealized_pnl,
    pnlPct: h.unrealized_pnl_pct,
    color: getCoinColor(h.symbol),
  }));

  // Transform holdings for HoldingCard
  const holdingCards = holdings.map((h) => ({
    id: h.coin_id,
    coin: h.name,
    ticker: h.symbol,
    amount: h.total_quantity,
    avgBuyPrice: h.avg_buy_price,
    currentPrice: h.live_price,
    color: getCoinColor(h.symbol),
    percentage: h.allocation_pct,
    change24h: h.change_24h,
    unrealizedPnl: h.unrealized_pnl,
    unrealizedPnlPct: h.unrealized_pnl_pct,
    currentValue: h.current_value,
  }));

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${pricesLive ? "bg-green-500" : "bg-amber-500"}`} />
              {pricesLive ? "Live prices via CoinGecko" : "Prices unavailable"} · {summary ? `updated ${new Date(summary.last_updated).toLocaleTimeString()}` : "—"}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={refreshPrices} 
              disabled={refreshing || loading}
              size="sm" 
              className="text-xs sm:text-sm"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Warning Banner */}
        {warning && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading portfolio...</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <section className="mb-6 sm:mb-8" style={{ opacity: refreshing ? 0.6 : 1 }}>
              <PortfolioStats stats={stats} />
            </section>

            {/* Progress Bar */}
            {holdings.length > 0 && (
              <section className="mb-6 sm:mb-8">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full flex">
                    {holdings.map((h) => (
                      <div
                        key={h.coin_id}
                        style={{
                          width: `${h.allocation_pct}%`,
                          backgroundColor: getCoinColor(h.symbol),
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Charts Section */}
            {holdings.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* Allocation Chart */}
                <AllocationChart holdings={allocationData} />

                {/* Cost Basis Breakdown */}
                <CostBasisBreakdown data={costBasisData} />
              </div>
            )}

            {/* Holdings */}
            {holdings.length > 0 ? (
              <section className="space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Holdings</h2>
                <div className="space-y-4">
                  {holdingCards.map((holding) => (
                    <HoldingCard key={holding.id} holding={holding} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No holdings found. Start trading to build your portfolio.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
