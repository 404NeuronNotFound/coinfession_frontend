"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";
import EmotionBadge, { EMOTION_COLORS } from "@/components/ui/EmotionBadge";
import { useThemeStore } from "@/stores/themeStore";

import { useAuthStore } from "@/stores/authStore";
import {
  Trade, Holding, MonthlyPnl, EmotionStat,
  EmotionTag, LogTradePayload,
} from "@/types/trade";

// ─── Tab type ─────────────────────────────────────────────
type Tab = "portfolio" | "trades" | "emotions" | "ai";

// ─── Mock data (replace with API calls) ───────────────────
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
];

const MOCK_MONTHLY: MonthlyPnl[] = [
  { month: "Oct", pnl: 1200 },
  { month: "Nov", pnl: -340 },
  { month: "Dec", pnl: 3100 },
  { month: "Jan", pnl: 890 },
  { month: "Feb", pnl: -720 },
  { month: "Mar", pnl: 5420 },
];

// ─── Helpers ──────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

// ─── Dashboard page ───────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  // ── Theme
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const d = theme === "dark";

  // ── Auth guard
  const { user, isAuthenticated, clearSession } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // ── UI state
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  // ── Computed stats
  const closed = MOCK_TRADES.filter(t => t.type === "SELL");
  const winners = closed.filter(t => (t.pnl ?? 0) > 0);
  const winRate = closed.length ? Math.round((winners.length / closed.length) * 100) : 0;
  const totalPnl = closed.reduce((s, t) => s + (t.pnl ?? 0), 0);

  const portValue = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.current_price, 0);
  const portCost = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.avg_buy_price, 0);
  const unrlPnl = portValue - portCost;
  const unrlPct = portCost ? (unrlPnl / portCost) * 100 : 0;

  const maxBar = Math.max(...MOCK_MONTHLY.map(m => Math.abs(m.pnl)));

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

  const TABS: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Portfolio" },
    { id: "trades", label: "Trades" },
    { id: "emotions", label: "Emotions" },
    { id: "ai", label: "AI Feedback" },
  ];

  if (!isAuthenticated) return null;

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border bg-background">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-black text-sm">C</span>
          </div>
          <div className="leading-none">
            <span className="font-bold text-sm tracking-tight text-foreground">CoinFession</span>
            <span className="text-xs ml-2 text-muted-foreground">Dashboard</span>
          </div>
        </a>

        {/* Tabs — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {TABS.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
          >
            {d ? <SunIcon /> : <MoonIcon />}
          </Button>

          <Button
            onClick={() => setActiveTab("portfolio")}
            size="sm"
          >
            + Log Trade
          </Button>

          {/* User menu */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-xs">
                {user?.first_name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="leading-none">
              <p className="text-xs font-semibold text-foreground">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-[11px] text-muted-foreground">@{user?.username}</p>
            </div>
            <Button
              onClick={() => { clearSession(); router.replace("/login"); }}
              variant="ghost"
              size="sm"
              className="ml-2 text-xs text-destructive hover:text-destructive"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-8 pb-24">

        {/* ── GREETING ── */}
        <section className="py-10 border-b border-border">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-2">
            Your Trading Mirror
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-foreground">
            Welcome back, {user?.first_name ?? "Trader"}.
          </h1>
          <p className="text-sm text-muted-foreground">
            Here's what your trades say about you this month.
          </p>
        </section>

        {/* ── STAT STRIP ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
          {[
            { label: "Portfolio Value", value: fmt(portValue), sub: `${pct(unrlPct)} unrealized`, color: pos(unrlPnl) ? "text-primary" : "text-destructive" },
            { label: "Realized P&L", value: fmt(totalPnl), sub: `${closed.length} closed trades`, color: pos(totalPnl) ? "text-primary" : "text-destructive" },
            { label: "Win Rate", value: `${winRate}%`, sub: `${winners.length} of ${closed.length} profitable`, color: winRate >= 50 ? "text-primary" : "text-destructive" },
            { label: "Open Positions", value: `${MOCK_HOLDINGS.length}`, sub: "active holdings", color: "text-blue-500" },
          ].map((stat, i) => (
            <div key={i} className={`py-8 px-6 ${i < 3 ? "border-r border-border" : ""}`}>
              <div className="text-[11px] uppercase tracking-widest mb-2 text-muted-foreground">
                {stat.label}
              </div>
              <div className={`text-2xl font-black tracking-tight mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </section>

        {/* ── MOBILE TABS ── */}
        <div className="md:hidden flex gap-1 mt-6 overflow-x-auto border-b border-border pb-2">
          {TABS.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              className="shrink-0"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <section className="mt-10 space-y-10">

          {/* ── PORTFOLIO ── */}
          {activeTab === "portfolio" && (
            <>
              {/* Holdings table */}
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-5 text-muted-foreground">
                  Current Holdings
                </h2>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {["Asset", "Holdings", "Avg Buy", "Current", "Value", "Unrealized P&L"].map((h, i) => (
                          <TableHead key={h} className={i === 0 ? "text-left" : "text-right"}>
                            {h}
                          </TableHead>
                        ))}
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
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                                  style={{ backgroundColor: h.color }}>
                                  {h.ticker[0]}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-foreground">{h.coin}</div>
                                  <div className="text-[11px] text-muted-foreground">{h.ticker}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm text-muted-foreground">
                              {h.amount} {h.ticker}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm text-muted-foreground">
                              {fmtDec(h.avg_buy_price)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm text-foreground">
                              {fmtDec(h.current_price)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                              {fmt(val)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm"
                              style={{ color: pos(upnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                              {fmt(upnl)} <span className="text-[11px] opacity-70">({pct(upct)})</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              {/* Monthly P&L bar chart */}
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-5 text-muted-foreground">
                  Monthly P&L
                </h2>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-end gap-3" style={{ height: 140 }}>
                      {MOCK_MONTHLY.map(m => {
                        const barH = (Math.abs(m.pnl) / maxBar) * 96;
                        const isPos = m.pnl >= 0;
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[11px] font-mono"
                              style={{ color: isPos ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                              {isPos ? "+" : ""}{(m.pnl / 1000).toFixed(1)}k
                            </span>
                            <div className="w-full flex items-end" style={{ height: 96 }}>
                              <div className="w-full rounded-sm"
                                style={{
                                  height: `${Math.max(barH, 3)}px`,
                                  backgroundColor: isPos ? "hsl(var(--primary))" : "hsl(var(--destructive))",
                                  opacity: 0.85,
                                }} />
                            </div>
                            <span className="text-[11px] text-muted-foreground">{m.month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* ── TRADES ── */}
          {activeTab === "trades" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Trade History
                </h2>
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  + Log new trade
                </Button>
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {["Date", "Asset", "Type", "Buy Price", "Sell Price", "P&L", "Emotion"].map((h, i) => (
                        <TableHead key={h} className={i <= 2 ? "text-left" : i < 6 ? "text-right" : "text-left"}>
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_TRADES.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                        <TableCell>
                          <div className="font-semibold text-sm text-foreground">{t.ticker}</div>
                          <div className="text-[11px] text-muted-foreground">{t.coin}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={t.type === "BUY" ? "secondary" : "default"}>
                            {t.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {fmtDec(t.buy_price)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {t.sell_price ? fmtDec(t.sell_price) : <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {t.pnl !== undefined ? (
                            <span style={{ color: pos(t.pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                              {fmt(t.pnl)} <span className="text-[11px] opacity-70">({pct(t.pnl_pct!)})</span>
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">Open</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <EmotionBadge emotion={t.emotion} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* ── EMOTIONS ── */}
          {activeTab === "emotions" && (
            <>
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-muted-foreground">
                  Emotion Patterns
                </h2>
                <p className="text-sm mb-6 text-muted-foreground">
                  Which emotional state is making you money — and which one is bleeding you out.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emotionStats.map(({ emotion, count, total_pnl }) => (
                    <Card key={emotion}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <EmotionBadge emotion={emotion} size="md" />
                          <span className="text-xs text-muted-foreground">{count} trade{count > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-black"
                            style={{ color: pos(total_pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                            {fmt(total_pnl)}
                          </span>
                          <span className="text-xs text-muted-foreground">total P&L in this state</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden bg-muted">
                          <div className="h-full rounded-full"
                            style={{
                              width: `${(count / MOCK_TRADES.length) * 100}%`,
                              backgroundColor: EMOTION_COLORS[emotion],
                            }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pattern alert */}
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6">
                  <Badge variant="destructive" className="mb-4">
                    Pattern Alert
                  </Badge>
                  <p className="text-sm leading-relaxed text-foreground">
                    Your <span className="font-semibold">"Panic Sold"</span> and{" "}
                    <span className="font-semibold">"Greedy"</span> trades account for{" "}
                    <span className="text-destructive font-bold">100% of your losses</span>.
                    Every disciplined trade was profitable. Your strategy works. Your emotions don&apos;t.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── AI FEEDBACK ── */}
          {activeTab === "ai" && (
            <>
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-muted-foreground">
                  AI Journal Analysis
                </h2>
                <p className="text-sm mb-6 text-muted-foreground">
                  Brutally honest feedback based on your actual trading history. Powered by Claude.
                </p>
              </div>

              <Card>
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
                    <span className="text-xs text-muted-foreground">Claude Analysis — April 2025</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-sm leading-relaxed">
                  <p className="text-muted-foreground">
                    Looking at your last 6 trades, the pattern is obvious:{" "}
                    <span className="font-semibold text-foreground">
                      you know how to trade, but you don&apos;t trust yourself when it counts.
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Your disciplined trades returned an average of{" "}
                    <span className="text-primary font-semibold">+14.6%</span>. Your emotional
                    trades (Panic Sold, Greedy) lost an average of{" "}
                    <span className="text-destructive font-semibold">-22.65%</span>.
                    You&apos;re not bad at picking entries — you&apos;re bad at managing your
                    psychology at the exit.
                  </p>
                  <p className="text-muted-foreground">
                    The ETH panic sell on March 18th is particularly telling. You sold at $2,310 —
                    ETH is now at $3,180.{" "}
                    <span className="font-semibold text-foreground">
                      You would be up $760 on that position if you held your original thesis.
                    </span>{" "}
                    What changed? Not the asset. You did.
                  </p>
                  <div className="border-l-2 border-primary pl-4 py-1">
                    <p className="text-[11px] uppercase tracking-widest mb-1.5 font-semibold text-muted-foreground">
                      Recommendation
                    </p>
                    <p className="text-muted-foreground">
                      Before every sell, write down the original reason you bought. If that reason
                      is still valid, don&apos;t sell. Set a rule: no sells within 24 hours of a red
                      day.{" "}
                      <span className="font-semibold text-foreground">
                        The enemy is you, not the market.
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full">
                Regenerate Analysis →
              </Button>
            </>
          )}

        </section>
      </div>

    </main>
  );
}
