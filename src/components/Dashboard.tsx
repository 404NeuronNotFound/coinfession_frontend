"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardHeader from "@/components/ui/DashboardHeader";
import StatGrid from "@/components/ui/StatGrid";
import EmotionBreakdown from "@/components/ui/EmotionBreakdown";
import RecentTrades from "@/components/ui/RecentTrades";
import AIFeedbackCard from "@/components/ui/AIFeedbackCard";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { Trade, Holding, EmotionStat, EmotionTag } from "@/types/trade";

// ─── Mock data ─────────────────────────────────────────────
const MOCK_TRADES: Trade[] = [
  { id: 1, coin: "Bitcoin", ticker: "BTC", type: "SELL", buy_price: 58200, sell_price: 67400, amount: 0.5, date: "2025-03-12", emotion: "Disciplined", pnl: 4600, pnl_pct: 15.8 },
  { id: 2, coin: "Ethereum", ticker: "ETH", type: "SELL", buy_price: 2800, sell_price: 2310, amount: 2, date: "2025-03-18", emotion: "Panic Sold", pnl: -980, pnl_pct: -17.5 },
  { id: 3, coin: "Solana", ticker: "SOL", type: "BUY", buy_price: 142, amount: 10, date: "2025-03-22", emotion: "FOMO" },
  { id: 4, coin: "Bitcoin", ticker: "BTC", type: "SELL", buy_price: 61000, sell_price: 69200, amount: 0.25, date: "2025-03-28", emotion: "Patient", pnl: 2050, pnl_pct: 13.4 },
  { id: 5, coin: "Dogecoin", ticker: "DOGE", type: "SELL", buy_price: 0.18, sell_price: 0.13, amount: 5000, date: "2025-04-01", emotion: "Greedy", pnl: -250, pnl_pct: -27.8 },
  { id: 6, coin: "Ethereum", ticker: "ETH", type: "BUY", buy_price: 1920, amount: 1.5, date: "2025-04-05", emotion: "Disciplined" },
];

const MOCK_HOLDINGS: Holding[] = [
  { coin: "Bitcoin", ticker: "BTC", amount: 0.75, avg_buy_price: 59600, current_price: 83400, color: "#F7931A" },
  { coin: "Ethereum", ticker: "ETH", amount: 1.5, avg_buy_price: 1920, current_price: 3180, color: "#627EEA" },
  { coin: "Solana", ticker: "SOL", amount: 10, avg_buy_price: 142, current_price: 178, color: "#9945FF" },
  { coin: "USDC", ticker: "USDC", amount: 1200, avg_buy_price: 1.0, current_price: 1.0, color: "#2775CA" },
];

// ─── Helpers ──────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

// ─── Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // ── Computed stats
  const closed = MOCK_TRADES.filter(t => t.type === "SELL");
  const winners = closed.filter(t => (t.pnl ?? 0) > 0);
  const winRate = closed.length ? Math.round((winners.length / closed.length) * 100) : 0;
  const totalPnl = closed.reduce((s, t) => s + (t.pnl ?? 0), 0);

  const portValue = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.current_price, 0);
  const portCost = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.avg_buy_price, 0);
  const unrlPnl = portValue - portCost;
  const unrlPct = portCost ? (unrlPnl / portCost) * 100 : 0;

  // ── Emotion stats
  const emotionMap: Record<string, EmotionStat> = {};
  MOCK_TRADES.forEach(t => {
    if (!emotionMap[t.emotion]) {
      emotionMap[t.emotion] = { emotion: t.emotion as EmotionTag, count: 0, total_pnl: 0 };
    }
    emotionMap[t.emotion].count++;
    emotionMap[t.emotion].total_pnl += t.pnl ?? 0;
  });
  const emotionStats = Object.values(emotionMap).sort((a, b) => b.count - a.count);

  const statItems = [
    { label: "Portfolio Value", value: fmt(portValue), subtext: `${pct(unrlPct)} unrealized`, color: pos(unrlPnl) ? 'success' as const : 'warning' as const },
    { label: "Realized P&L", value: fmt(totalPnl), subtext: `${closed.length} closed trades`, color: pos(totalPnl) ? 'success' as const : 'warning' as const },
    { label: "Unrealized P&L", value: fmt(unrlPnl), subtext: "open positions", color: pos(unrlPnl) ? 'success' as const : 'warning' as const },
    { label: "Win Rate", value: `${winRate}%`, subtext: `${winners.length} of ${closed.length} profitable`, color: winRate >= 50 ? 'success' as const : 'warning' as const },
  ];

  const recentTradesData = MOCK_TRADES.slice(0, 3).map(t => ({
    id: t.id,
    type: t.type as 'BUY' | 'SELL',
    coin: t.coin,
    ticker: t.ticker,
    price: t.type === 'SELL' ? t.sell_price! : t.buy_price,
    quantity: t.amount,
    emotion: t.emotion,
    date: t.date,
  }));

  const emotionBreakdownData = emotionStats.map(e => ({
    emotion: e.emotion,
    percentage: Math.round((e.count / MOCK_TRADES.length) * 100),
    count: e.count,
  }));

  if (!isAuthenticated) return null;

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        {/* Header */}
        <DashboardHeader
          title="Dashboard"
          subtitle="Live prices · April 2026"
          onLogTrade={() => console.log("Log trade")}
          onExport={() => console.log("Export")}
        />

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
                  {MOCK_HOLDINGS.map((h) => {
                    const val = h.amount * h.current_price;
                    const cost = h.amount * h.avg_buy_price;
                    const upnl = val - cost;
                    const upct = (upnl / cost) * 100;
                    return (
                      <TableRow key={h.ticker}>
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                              style={{ backgroundColor: h.color }}>
                              {h.ticker[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-xs sm:text-sm text-foreground">{h.coin}</div>
                              <div className="text-xs text-muted-foreground hidden sm:block">{h.ticker}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm text-muted-foreground">
                          {h.amount}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                          {fmtDec(h.avg_buy_price)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm text-foreground hidden md:table-cell">
                          {fmtDec(h.current_price)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm font-semibold text-foreground">
                          {fmt(val)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs sm:text-sm hidden lg:table-cell"
                          style={{ color: pos(upnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                          {fmt(upnl)} <span className="text-xs opacity-70">({pct(upct)})</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Emotion Breakdown */}
          <EmotionBreakdown
            emotions={emotionBreakdownData}
            subtitle={`Emotion tagged on ${MOCK_TRADES.filter(t => t.emotion).length} of ${MOCK_TRADES.length} trades`}
          />

          {/* Recent Trades */}
          <RecentTrades
            trades={recentTradesData}
            onViewAll={() => console.log("View all trades")}
          />
        </div>

        {/* AI Feedback */}
        <section className="mt-6 sm:mt-8">
          <AIFeedbackCard
            title="AI Feedback"
            subtitle="April"
            feedback="You sold ETH at a loss after only 3 days — classic panic exit. Your disciplined trades have a 78% win rate. Your FOMO entries average -12% return. Stop buying pumps."
            onViewFull={() => console.log("View full report")}
          />
        </section>
      </div>
    </main>
  );
}
