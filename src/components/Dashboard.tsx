"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter }                       from "next/navigation";
import { Theme, getTokens, Tokens }        from "@/lib/theme";
import { SunIcon, MoonIcon }               from "@/components/ui/Icons";
import StatCard                            from "@/components/ui/StatCard";
import EmotionBadge, { EMOTION_COLORS }    from "@/components/ui/EmotionBadge";
import PasswordInput                       from "@/components/ui/PasswordInput";

import { useAuthStore }   from "@/stores/authStore";
import {
  Trade, Holding, MonthlyPnl, EmotionStat,
  EmotionTag, LogTradePayload,
} from "@/types/trade";

// ─── Tab type ─────────────────────────────────────────────
type Tab = "portfolio" | "trades" | "emotions" | "ai";

// ─── Mock data (replace with API calls) ───────────────────
const MOCK_TRADES: Trade[] = [
  { id: 1, coin: "Bitcoin",  ticker: "BTC",  type: "SELL", buy_price: 58200, sell_price: 67400, amount: 0.5,   date: "2025-03-12", emotion: "Disciplined", pnl: 4600,  pnl_pct: 15.8  },
  { id: 2, coin: "Ethereum", ticker: "ETH",  type: "SELL", buy_price: 2800,  sell_price: 2310,  amount: 2,     date: "2025-03-18", emotion: "Panic Sold",  pnl: -980,  pnl_pct: -17.5 },
  { id: 3, coin: "Solana",   ticker: "SOL",  type: "BUY",  buy_price: 142,                      amount: 10,    date: "2025-03-22", emotion: "FOMO"                               },
  { id: 4, coin: "Bitcoin",  ticker: "BTC",  type: "SELL", buy_price: 61000, sell_price: 69200, amount: 0.25,  date: "2025-03-28", emotion: "Patient",    pnl: 2050,  pnl_pct: 13.4  },
  { id: 5, coin: "Dogecoin", ticker: "DOGE", type: "SELL", buy_price: 0.18,  sell_price: 0.13,  amount: 5000,  date: "2025-04-01", emotion: "Greedy",     pnl: -250,  pnl_pct: -27.8 },
  { id: 6, coin: "Ethereum", ticker: "ETH",  type: "BUY",  buy_price: 1920,                     amount: 1.5,   date: "2025-04-05", emotion: "Disciplined"                        },
];

const MOCK_HOLDINGS: Holding[] = [
  { coin: "Bitcoin",  ticker: "BTC", amount: 0.75, avg_buy_price: 59600, current_price: 83400, color: "#F7931A" },
  { coin: "Ethereum", ticker: "ETH", amount: 1.5,  avg_buy_price: 1920,  current_price: 3180,  color: "#627EEA" },
  { coin: "Solana",   ticker: "SOL", amount: 10,   avg_buy_price: 142,   current_price: 178,   color: "#9945FF" },
];

const MOCK_MONTHLY: MonthlyPnl[] = [
  { month: "Oct", pnl: 1200  },
  { month: "Nov", pnl: -340  },
  { month: "Dec", pnl: 3100  },
  { month: "Jan", pnl: 890   },
  { month: "Feb", pnl: -720  },
  { month: "Mar", pnl: 5420  },
];

// ─── Helpers ──────────────────────────────────────────────
const fmt    = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct    = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos    = (n: number) => n >= 0;

// ─── Log trade modal ──────────────────────────────────────
// Page-specific — only exists in the dashboard
const EMOTIONS: EmotionTag[] = ["Disciplined", "Patient", "FOMO", "Greedy", "Panic Sold"];

const EMPTY_LOG: Omit<LogTradePayload, "ticker"> & { ticker: string } = {
  coin: "", ticker: "", type: "BUY", buy_price: 0,
  sell_price: undefined, amount: 0, date: "", emotion: "Disciplined", notes: "",
};

function LogModal({ tk, onClose, d }: { tk: Tokens; onClose: () => void; d: boolean }) {
  const [log, setLog]   = useState(EMPTY_LOG);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // replace with API call
    setSaving(false);
    onClose();
  }

  const inputCls = `w-full rounded-md px-4 py-2.5 text-sm outline-none transition-colors border ${tk.inputBorder} ${tk.bgInput} ${tk.text} ${tk.inputPH} ${tk.inputFocus}`;
  const labelCls = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${tk.textFaint}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full max-w-md rounded-2xl border ${tk.border} p-6 shadow-xl ${d ? "bg-[#111]" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-base ${tk.text}`}>Log a trade</h3>
          <button onClick={onClose} className={`text-2xl leading-none transition-colors ${tk.textMuted}`}>×</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Coin + Ticker */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Coin</label>
              <input className={inputCls} placeholder="Bitcoin"
                value={log.coin} onChange={e => setLog(l => ({ ...l, coin: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Ticker</label>
              <input className={inputCls} placeholder="BTC"
                value={log.ticker} onChange={e => setLog(l => ({ ...l, ticker: e.target.value.toUpperCase() }))} />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className={labelCls}>Type</label>
            <div className={`flex rounded-md border ${tk.border} overflow-hidden`}>
              {(["BUY", "SELL"] as const).map(t => (
                <button key={t} type="button"
                  onClick={() => setLog(l => ({ ...l, type: t }))}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    log.type === t
                      ? t === "BUY"
                        ? "bg-[#4A8FE7]/15 text-[#4A8FE7]"
                        : "bg-[#50AF95]/15 text-[#50AF95]"
                      : tk.textFaint
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Buy + Sell price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Buy price (USD)</label>
              <input className={inputCls} type="number" placeholder="61,000"
                value={log.buy_price || ""} onChange={e => setLog(l => ({ ...l, buy_price: +e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Sell price (USD)</label>
              <input className={inputCls} type="number" placeholder="Optional"
                value={log.sell_price || ""} onChange={e => setLog(l => ({ ...l, sell_price: e.target.value ? +e.target.value : undefined }))} />
            </div>
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount</label>
              <input className={inputCls} type="number" step="any" placeholder="0.5"
                value={log.amount || ""} onChange={e => setLog(l => ({ ...l, amount: +e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls} type="date"
                value={log.date} onChange={e => setLog(l => ({ ...l, date: e.target.value }))} />
            </div>
          </div>

          {/* Emotion */}
          <div>
            <label className={labelCls}>How did you feel?</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(em => {
                const color = EMOTION_COLORS[em];
                const active = log.emotion === em;
                return (
                  <button key={em} type="button"
                    onClick={() => setLog(l => ({ ...l, emotion: em }))}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                    style={{
                      borderColor: active ? color : `${color}40`,
                      color,
                      backgroundColor: active ? `${color}18` : "transparent",
                    }}
                  >
                    {em}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes (optional)</label>
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Why did you make this trade?"
              value={log.notes} onChange={e => setLog(l => ({ ...l, notes: e.target.value }))} />
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full bg-[#50AF95] hover:bg-[#3d9e82] disabled:opacity-50 text-[#0a0a0a] font-bold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Saving…
              </>
            ) : "Save trade"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();

  // ── Theme
  const [theme, setTheme] = useState<Theme>("dark");
  const tk = getTokens(theme);
  const d  = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", d);
  }, [d]);

  // ── Auth guard
  const { user, isAuthenticated, clearSession } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // ── UI state
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [logOpen, setLogOpen]     = useState(false);

  // ── Computed stats
  const closed   = MOCK_TRADES.filter(t => t.type === "SELL");
  const winners  = closed.filter(t => (t.pnl ?? 0) > 0);
  const winRate  = closed.length ? Math.round((winners.length / closed.length) * 100) : 0;
  const totalPnl = closed.reduce((s, t) => s + (t.pnl ?? 0), 0);

  const portValue = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.current_price, 0);
  const portCost  = MOCK_HOLDINGS.reduce((s, h) => s + h.amount * h.avg_buy_price, 0);
  const unrlPnl   = portValue - portCost;
  const unrlPct   = portCost ? (unrlPnl / portCost) * 100 : 0;

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
    { id: "portfolio", label: "Portfolio"   },
    { id: "trades",    label: "Trades"      },
    { id: "emotions",  label: "Emotions"    },
    { id: "ai",        label: "AI Feedback" },
  ];

  if (!isAuthenticated) return null;

  return (
    <main className={`${tk.bg} ${tk.text} font-sans min-h-screen transition-colors duration-200`}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b ${tk.border} ${tk.navBg} transition-colors duration-200`}>
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-md bg-[#50AF95] flex items-center justify-center shrink-0">
            <span className="text-[#0a0a0a] font-black text-sm">C</span>
          </div>
          <div className="leading-none">
            <span className={`font-bold text-sm tracking-tight ${tk.text}`}>CoinFession</span>
            <span className={`text-xs ml-2 ${tk.textGhost}`}>Dashboard</span>
          </div>
        </a>

        {/* Tabs — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                activeTab === tab.id ? tk.tabActive : tk.tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            className={`p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors`}
            aria-label="Toggle theme"
          >
            {d ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={() => setLogOpen(true)}
            className="text-sm bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-5 py-2 rounded-md transition-colors"
          >
            + Log Trade
          </button>

          {/* User menu */}
          <div className={`hidden md:flex items-center gap-2 pl-2 border-l ${tk.border}`}>
            <div className="w-8 h-8 rounded-full bg-[#50AF95]/20 flex items-center justify-center shrink-0">
              <span className="text-[#50AF95] font-bold text-xs">
                {user?.first_name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="leading-none">
              <p className={`text-xs font-semibold ${tk.text}`}>
                {user?.first_name} {user?.last_name}
              </p>
              <p className={`text-[11px] ${tk.textFaint}`}>@{user?.username}</p>
            </div>
            <button
              onClick={() => { clearSession(); router.replace("/login"); }}
              className={`ml-2 text-[11px] transition-colors ${tk.textFaint} hover:text-[#E05454]`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-8 pb-24">

        {/* ── GREETING ── */}
        <section className={`py-10 border-b ${tk.border}`}>
          <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-2">
            Your Trading Mirror
          </p>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight mb-2 ${tk.text}`}>
            Welcome back, {user?.first_name ?? "Trader"}.
          </h1>
          <p className={`text-sm ${tk.textMuted}`}>
            Here's what your trades say about you this month.
          </p>
        </section>

        {/* ── STAT STRIP ── */}
        <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tk.border}`}>
          <StatCard tk={tk} label="Portfolio Value"
            value={fmt(portValue)}
            sub={`${pct(unrlPct)} unrealized`}
            color={pos(unrlPnl) ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Realized P&L"
            value={fmt(totalPnl)}
            sub={`${closed.length} closed trades`}
            color={pos(totalPnl) ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Win Rate"
            value={`${winRate}%`}
            sub={`${winners.length} of ${closed.length} profitable`}
            color={winRate >= 50 ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Open Positions"
            value={`${MOCK_HOLDINGS.length}`}
            sub="active holdings"
            color="#4A8FE7" last />
        </section>

        {/* ── MOBILE TABS ── */}
        <div className={`md:hidden flex gap-1 mt-6 overflow-x-auto border-b ${tk.border} pb-2`}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 rounded-md text-xs transition-colors ${
                activeTab === tab.id ? tk.tabActive : tk.tabInactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <section className="mt-10 space-y-10">

          {/* ── PORTFOLIO ── */}
          {activeTab === "portfolio" && (
            <>
              {/* Holdings table */}
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${tk.textFaint}`}>
                  Current Holdings
                </h2>
                <div className={`border ${tk.border} rounded-xl overflow-x-auto`}>
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className={`border-b ${tk.border} ${tk.tableHead}`}>
                        {["Asset", "Holdings", "Avg Buy", "Current", "Value", "Unrealized P&L"].map((h, i) => (
                          <th key={h} className={`py-3 px-5 text-[11px] uppercase tracking-wider font-medium ${tk.textFaint} ${i === 0 ? "text-left" : "text-right"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_HOLDINGS.map((h, i) => {
                        const val  = h.amount * h.current_price;
                        const cost = h.amount * h.avg_buy_price;
                        const upnl = val - cost;
                        const upct = (upnl / cost) * 100;
                        return (
                          <tr key={h.ticker}
                            className={`${tk.rowHover} transition-colors ${i < MOCK_HOLDINGS.length - 1 ? `border-b ${tk.borderSubtle}` : ""}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0"
                                  style={{ backgroundColor: h.color }}>
                                  {h.ticker[0]}
                                </div>
                                <div>
                                  <div className={`font-semibold text-sm ${tk.text}`}>{h.coin}</div>
                                  <div className={`text-[11px] ${tk.textFaint}`}>{h.ticker}</div>
                                </div>
                              </div>
                            </td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMid}`}>
                              {h.amount} {h.ticker}
                            </td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>
                              {fmtDec(h.avg_buy_price)}
                            </td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.text}`}>
                              {fmtDec(h.current_price)}
                            </td>
                            <td className={`px-5 py-4 text-right font-mono text-sm font-semibold ${tk.text}`}>
                              {fmt(val)}
                            </td>
                            <td className="px-5 py-4 text-right font-mono text-sm"
                              style={{ color: pos(upnl) ? "#50AF95" : "#E05454" }}>
                              {fmt(upnl)}{" "}
                              <span className="text-[11px] opacity-70">({pct(upct)})</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly P&L bar chart */}
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${tk.textFaint}`}>
                  Monthly P&L
                </h2>
                <div className={`border ${tk.border} rounded-xl p-6`}>
                  <div className="flex items-end gap-3" style={{ height: 140 }}>
                    {MOCK_MONTHLY.map(m => {
                      const barH = (Math.abs(m.pnl) / maxBar) * 96;
                      const isPos = m.pnl >= 0;
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[11px] font-mono"
                            style={{ color: isPos ? "#50AF95" : "#E05454" }}>
                            {isPos ? "+" : ""}{(m.pnl / 1000).toFixed(1)}k
                          </span>
                          <div className="w-full flex items-end" style={{ height: 96 }}>
                            <div className="w-full rounded-sm"
                              style={{
                                height: `${Math.max(barH, 3)}px`,
                                backgroundColor: isPos ? "#50AF95" : "#E05454",
                                opacity: 0.85,
                              }} />
                          </div>
                          <span className={`text-[11px] ${tk.textFaint}`}>{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── TRADES ── */}
          {activeTab === "trades" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest ${tk.textFaint}`}>
                  Trade History
                </h2>
                <button
                  onClick={() => setLogOpen(true)}
                  className="text-xs text-[#50AF95] font-semibold hover:underline"
                >
                  + Log new trade
                </button>
              </div>
              <div className={`border ${tk.border} rounded-xl overflow-x-auto`}>
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className={`border-b ${tk.border} ${tk.tableHead}`}>
                      {["Date", "Asset", "Type", "Buy Price", "Sell Price", "P&L", "Emotion"].map((h, i) => (
                        <th key={h}
                          className={`py-3 px-5 text-[11px] uppercase tracking-wider font-medium ${tk.textFaint} ${i <= 2 ? "text-left" : i < 6 ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_TRADES.map((t, i) => (
                      <tr key={t.id}
                        className={`${tk.rowHover} transition-colors ${i < MOCK_TRADES.length - 1 ? `border-b ${tk.borderSubtle}` : ""}`}>
                        <td className={`px-5 py-4 text-xs ${tk.textMuted}`}>{t.date}</td>
                        <td className="px-5 py-4">
                          <div className={`font-semibold text-sm ${tk.text}`}>{t.ticker}</div>
                          <div className={`text-[11px] ${tk.textFaint}`}>{t.coin}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-bold px-2 py-1 rounded ${
                            t.type === "BUY"
                              ? "bg-[#4A8FE7]/10 text-[#4A8FE7]"
                              : "bg-[#50AF95]/10 text-[#50AF95]"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>
                          {fmtDec(t.buy_price)}
                        </td>
                        <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>
                          {t.sell_price ? fmtDec(t.sell_price) : <span className={tk.openBadge}>—</span>}
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-sm">
                          {t.pnl !== undefined ? (
                            <span style={{ color: pos(t.pnl) ? "#50AF95" : "#E05454" }}>
                              {fmt(t.pnl)}{" "}
                              <span className="text-[11px] opacity-70">({pct(t.pnl_pct!)})</span>
                            </span>
                          ) : (
                            <span className={`text-xs ${tk.openBadge}`}>Open</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <EmotionBadge emotion={t.emotion} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EMOTIONS ── */}
          {activeTab === "emotions" && (
            <>
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${tk.textFaint}`}>
                  Emotion Patterns
                </h2>
                <p className={`text-sm mb-6 ${tk.textMuted}`}>
                  Which emotional state is making you money — and which one is bleeding you out.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emotionStats.map(({ emotion, count, total_pnl }) => (
                    <div key={emotion} className={`border ${tk.border} rounded-xl p-5 ${tk.rowHover} transition-colors`}>
                      <div className="flex items-center justify-between mb-3">
                        <EmotionBadge emotion={emotion} size="md" />
                        <span className={`text-xs ${tk.textMuted}`}>{count} trade{count > 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-black"
                          style={{ color: pos(total_pnl) ? "#50AF95" : "#E05454" }}>
                          {fmt(total_pnl)}
                        </span>
                        <span className={`text-xs ${tk.textFaint}`}>total P&L in this state</span>
                      </div>
                      <div className={`h-1 rounded-full overflow-hidden ${d ? "bg-white/[0.07]" : "bg-black/[0.07]"}`}>
                        <div className="h-full rounded-full"
                          style={{
                            width: `${(count / MOCK_TRADES.length) * 100}%`,
                            backgroundColor: EMOTION_COLORS[emotion],
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern alert */}
              <div className={`border ${tk.alertBorder} rounded-xl p-6 ${tk.alertBg}`}>
                <span className="text-[11px] font-bold px-2 py-1 rounded bg-[#E05454]/10 text-[#E05454]">
                  Pattern Alert
                </span>
                <p className={`text-sm leading-relaxed mt-4 ${tk.textMid}`}>
                  Your <span className={`font-semibold ${tk.text}`}>"Panic Sold"</span> and{" "}
                  <span className={`font-semibold ${tk.text}`}>"Greedy"</span> trades account for{" "}
                  <span className="text-[#E05454] font-bold">100% of your losses</span>.
                  Every disciplined trade was profitable. Your strategy works. Your emotions don&apos;t.
                </p>
              </div>
            </>
          )}

          {/* ── AI FEEDBACK ── */}
          {activeTab === "ai" && (
            <>
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${tk.textFaint}`}>
                  AI Journal Analysis
                </h2>
                <p className={`text-sm mb-6 ${tk.textMuted}`}>
                  Brutally honest feedback based on your actual trading history. Powered by Claude.
                </p>
              </div>

              <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
                <div className={`${tk.tableHead} border-b ${tk.border} px-5 py-3 flex items-center gap-2`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#50AF95] animate-pulse inline-block" />
                  <span className={`text-xs ${tk.textMuted}`}>Claude Analysis — April 2025</span>
                </div>
                <div className="p-6 space-y-4 text-sm leading-relaxed">
                  <p className={tk.textMid}>
                    Looking at your last 6 trades, the pattern is obvious:{" "}
                    <span className={`font-semibold ${tk.text}`}>
                      you know how to trade, but you don&apos;t trust yourself when it counts.
                    </span>
                  </p>
                  <p className={tk.textMid}>
                    Your disciplined trades returned an average of{" "}
                    <span className="text-[#50AF95] font-semibold">+14.6%</span>. Your emotional
                    trades (Panic Sold, Greedy) lost an average of{" "}
                    <span className="text-[#E05454] font-semibold">-22.65%</span>.
                    You&apos;re not bad at picking entries — you&apos;re bad at managing your
                    psychology at the exit.
                  </p>
                  <p className={tk.textMid}>
                    The ETH panic sell on March 18th is particularly telling. You sold at $2,310 —
                    ETH is now at $3,180.{" "}
                    <span className={`font-semibold ${tk.text}`}>
                      You would be up $760 on that position if you held your original thesis.
                    </span>{" "}
                    What changed? Not the asset. You did.
                  </p>
                  <div className="border-l-2 border-[#50AF95] pl-4 py-1">
                    <p className={`text-[11px] uppercase tracking-widest mb-1.5 font-semibold ${tk.textFaint}`}>
                      Recommendation
                    </p>
                    <p className={tk.textMid}>
                      Before every sell, write down the original reason you bought. If that reason
                      is still valid, don&apos;t sell. Set a rule: no sells within 24 hours of a red
                      day.{" "}
                      <span className={`font-semibold ${tk.text}`}>
                        The enemy is you, not the market.
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                className={`w-full border ${tk.border} ${tk.textMuted} hover:border-[#50AF95]/50 hover:text-[#50AF95] py-3.5 rounded-xl text-sm font-semibold transition-colors`}
              >
                Regenerate Analysis →
              </button>
            </>
          )}

        </section>
      </div>

      {/* ── LOG TRADE MODAL ── */}
      {logOpen && <LogModal tk={tk} onClose={() => setLogOpen(false)} d={d} />}

    </main>
  );
}