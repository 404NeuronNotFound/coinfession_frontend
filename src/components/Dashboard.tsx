"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatGrid from "@/components/ui/StatGrid";
import EmotionBreakdown from "@/components/ui/EmotionBreakdown";
import RecentTrades from "@/components/ui/RecentTrades";
import AIFeedbackCard from "@/components/ui/AIFeedbackCard";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import { getCoinColor } from "@/lib/coinColors";
import { EmotionTag } from "@/types/trade";

// ─── Helpers ──────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtQty = (n: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

// ─── Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated, accessToken } = useAuthStore();
  
  const {
    data,
    loadDashboard,
    refreshDashboard,
    loading,
    refreshing,
    error,
  } = useDashboardStore();

  // Extract data from the store
  const metrics = data?.metrics ?? null;
  const holdings = data?.holdings ?? [];
  const emotions = data?.emotions ?? [];
  const recentTrades = data?.recent_trades ?? [];
  const aiSnippet = data?.ai_snippet ?? null;
  const pricesLive = data?.prices_live ?? false;
  const warning = data?.warning ?? null;



  // ── Load dashboard on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (accessToken) {
      loadDashboard(accessToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, accessToken, router]);

  // ── Handle refresh button
  const handleRefresh = () => {
    if (accessToken && !refreshing) {
      refreshDashboard(accessToken);
    }
  };

  // ── Handle log trade button
  const handleLogTrade = () => {
    router.push("/tradelog");
  };

  // ── Build stat items
  const statItems = metrics ? [
    {
      label: "Portfolio Value",
      value: fmt(metrics.portfolio_value),
      subtext: metrics.unrealized_label,
      color: pos(metrics.unrealized_pnl) ? 'success' as const : 'warning' as const
    },
    {
      label: "Realized P&L",
      value: (metrics.realized_pnl >= 0 ? "+" : "") + fmt(Math.abs(metrics.realized_pnl)),
      subtext: metrics.realized_label,
      color: pos(metrics.realized_pnl) ? 'success' as const : 'warning' as const
    },
    {
      label: "Unrealized P&L",
      value: (metrics.unrealized_pnl >= 0 ? "+" : "") + fmt(Math.abs(metrics.unrealized_pnl)),
      subtext: "open positions",
      color: pos(metrics.unrealized_pnl) ? 'success' as const : 'warning' as const
    },
    {
      label: "Win Rate",
      value: `${Math.round(metrics.win_rate)}%`,
      subtext: metrics.winning_label,
      color: metrics.win_rate >= 50 ? 'success' as const : 'warning' as const
    },
  ] : [
    { label: "Portfolio Value", value: "—", subtext: "—", color: 'success' as const },
    { label: "Realized P&L", value: "—", subtext: "—", color: 'success' as const },
    { label: "Unrealized P&L", value: "—", subtext: "—", color: 'success' as const },
    { label: "Win Rate", value: "—", subtext: "—", color: 'success' as const },
  ];

  // ── Build emotion breakdown data
  const emotionBreakdownData = emotions.map(e => ({
    emotion: e.name,
    percentage: Math.round(e.percentage),
    count: e.trade_count,
    color: e.color,
  }));

  // ── Build recent trades data
  const recentTradesData = recentTrades.map(t => ({
    id: t.id,
    type: t.trade_type.toUpperCase() as 'BUY' | 'SELL',
    coin: t.coin_name,
    ticker: t.coin_symbol,
    price: t.price,
    quantity: t.quantity,
    emotion: (t.emotion_name || "Disciplined") as EmotionTag,
    date: t.trade_date,
  }));

  // ── Calculate emotion tagged count for footer
  const emotionTaggedCount = recentTrades.filter(t => t.emotion_name !== null).length;
  const emotionSubtitle = `Emotion tagged on ${emotionTaggedCount} of ${recentTrades.length} trades`;

  // ── Get current month/year for live prices indicator
  const now = new Date();
  const currentMonthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (!isAuthenticated) return null;

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Live prices · {currentMonthYear}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              size="sm" 
              className="text-xs sm:text-sm"
              disabled={refreshing || loading}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button 
              onClick={handleLogTrade} 
              size="sm" 
              className="text-xs sm:text-sm"
            >
              + Log Trade
            </Button>
          </div>
        </div>

        {/* Warning banner */}
        {warning && (
          <div className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">{warning}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && !error && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">Loading dashboard data...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">Error loading dashboard</p>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="mb-6 sm:mb-8">
          <StatGrid stats={statItems} />
        </section>

        {/* Holdings Table */}
        <section className="mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 rounded-lg border border-border bg-card overflow-x-auto">
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-muted-foreground">
              Current Holdings
            </h3>
            <div className="overflow-x-auto">
              {loading && holdings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading holdings...
                </div>
              ) : holdings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No holdings yet. Start by logging your first trade!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left text-xs sm:text-sm">Asset</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Holdings</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden sm:table-cell">Avg Buy</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden md:table-cell">Current</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm">Value</TableHead>
                      <TableHead className="text-right text-xs sm:text-sm hidden lg:table-cell">P&L</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdings.map((h) => {
                      const color = getCoinColor(h.symbol);
                      const pnlSign = h.unrealized_pnl >= 0 ? "+" : "-";
                      const pnlAbs = Math.abs(h.unrealized_pnl);
                      const pctSign = h.unrealized_pnl_pct >= 0 ? "+" : "";
                      
                      return (
                        <TableRow key={h.coin_id}>
                          <TableCell>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div 
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                                style={{ backgroundColor: color }}
                              >
                                {h.symbol[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-xs sm:text-sm text-foreground">{h.name}</div>
                                <div className="text-xs text-muted-foreground hidden sm:block">{h.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm text-muted-foreground">
                            {fmtQty(h.total_quantity)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                            {fmtDec(h.avg_buy_price)}
                          </TableCell>
                          <TableCell 
                            className={`text-right font-mono text-xs sm:text-sm hidden md:table-cell ${
                              pricesLive ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {fmtDec(h.live_price)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs sm:text-sm font-semibold text-foreground">
                            {fmt(h.current_value)}
                          </TableCell>
                          <TableCell 
                            className="text-right font-mono text-xs sm:text-sm hidden lg:table-cell"
                            style={{ color: pos(h.unrealized_pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
                          >
                            {pnlSign}{fmt(pnlAbs)} <span className="text-xs opacity-70">({pctSign}{h.unrealized_pnl_pct.toFixed(1)}%)</span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </section>

        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Left Column - Emotion Breakdown and AI Feedback */}
          <div className="space-y-6 sm:space-y-8 flex flex-col">
            {/* Emotion Breakdown */}
            <EmotionBreakdown
              emotions={emotionBreakdownData}
              subtitle={emotionSubtitle}
            />

            {/* AI Feedback */}
            {aiSnippet && (
              <div className="flex-1 flex flex-col">
                <AIFeedbackCard
                  title="AI Feedback"
                  subtitle={aiSnippet.month_label}
                  feedback={
                    aiSnippet.overall.length > 300
                      ? aiSnippet.overall.slice(0, 300) + "..."
                      : aiSnippet.overall
                  }
                  onViewFull={() => router.push("/aifeedback")}
                />
              </div>
            )}
          </div>

          {/* Right Column - Recent Trades */}
          <div className="h-full">
            <RecentTrades
              trades={recentTradesData}
              onViewAll={() => router.push("/tradelog")}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
