"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────
type EmotionTag = "FOMO" | "Disciplined" | "Panic Sold" | "Greedy" | "Patient";
type Tab = "portfolio" | "trades" | "emotions" | "ai";
type Theme = "dark" | "light";

interface Trade {
  id: number;
  coin: string;
  ticker: string;
  type: "BUY" | "SELL";
  buyPrice: number;
  sellPrice?: number;
  amount: number;
  date: string;
  emotion: EmotionTag;
  pnl?: number;
  pnlPct?: number;
}

// ─── Mock data ────────────────────────────────────────────
const TRADES: Trade[] = [
  { id: 1, coin: "Bitcoin",  ticker: "BTC",  type: "SELL", buyPrice: 58200, sellPrice: 67400, amount: 0.5,   date: "2025-03-12", emotion: "Disciplined", pnl: 4600,  pnlPct: 15.8  },
  { id: 2, coin: "Ethereum", ticker: "ETH",  type: "SELL", buyPrice: 2800,  sellPrice: 2310,  amount: 2,     date: "2025-03-18", emotion: "Panic Sold",  pnl: -980,  pnlPct: -17.5 },
  { id: 3, coin: "Solana",   ticker: "SOL",  type: "BUY",  buyPrice: 142,   sellPrice: undefined, amount: 10,date: "2025-03-22", emotion: "FOMO"                               },
  { id: 4, coin: "Bitcoin",  ticker: "BTC",  type: "SELL", buyPrice: 61000, sellPrice: 69200, amount: 0.25,  date: "2025-03-28", emotion: "Patient",    pnl: 2050,  pnlPct: 13.4  },
  { id: 5, coin: "Dogecoin", ticker: "DOGE", type: "SELL", buyPrice: 0.18,  sellPrice: 0.13,  amount: 5000,  date: "2025-04-01", emotion: "Greedy",     pnl: -250,  pnlPct: -27.8 },
  { id: 6, coin: "Ethereum", ticker: "ETH",  type: "BUY",  buyPrice: 1920,  sellPrice: undefined, amount: 1.5,date: "2025-04-05", emotion: "Disciplined"                        },
];

const HOLDINGS = [
  { coin: "Bitcoin",  ticker: "BTC", amount: 0.75, avgBuy: 59600, currentPrice: 83400, color: "#F7931A" },
  { coin: "Ethereum", ticker: "ETH", amount: 1.5,  avgBuy: 1920,  currentPrice: 3180,  color: "#627EEA" },
  { coin: "Solana",   ticker: "SOL", amount: 10,   avgBuy: 142,   currentPrice: 178,   color: "#9945FF" },
];

const EMOTION_COLORS: Record<EmotionTag, string> = {
  "Disciplined": "#50AF95",
  "Patient":     "#4A8FE7",
  "FOMO":        "#C0A161",
  "Greedy":      "#E07B54",
  "Panic Sold":  "#E05454",
};

const MONTHLY = [
  { month: "Oct", pnl: 1200  },
  { month: "Nov", pnl: -340  },
  { month: "Dec", pnl: 3100  },
  { month: "Jan", pnl: 890   },
  { month: "Feb", pnl: -720  },
  { month: "Mar", pnl: 5420  },
];

const STACK = ["Next.js", "Django", "PostgreSQL", "Tailwind CSS", "CoinGecko API", "Claude API"];

// ─── Helpers ──────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

// ─── SVG Social Icons ─────────────────────────────────────
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// ─── Theme-aware tokens ───────────────────────────────────
function useThemeTokens(theme: Theme) {
  const d = theme === "dark";
  return {
    bg:          d ? "bg-[#0a0a0a]"          : "bg-[#f5f5f0]",
    bgCard:      d ? "bg-[#111111]"          : "bg-white",
    bgSubtle:    d ? "bg-white/[0.02]"       : "bg-black/[0.02]",
    bgInput:     d ? "bg-white/[0.04]"       : "bg-black/[0.04]",
    bgModal:     d ? "bg-[#111]"             : "bg-white",
    border:      d ? "border-white/[0.08]"   : "border-black/[0.09]",
    borderSubtle:d ? "border-white/[0.05]"   : "border-black/[0.05]",
    text:        d ? "text-white"            : "text-[#0a0a0a]",
    textMid:     d ? "text-white/70"         : "text-black/70",
    textMuted:   d ? "text-white/50"         : "text-black/50",
    textFaint:   d ? "text-white/30"         : "text-black/35",
    textGhost:   d ? "text-white/20"         : "text-black/25",
    navBg:       d ? "bg-[#0a0a0a]"          : "bg-[#f5f5f0]",
    tabActive:   d ? "bg-white/[0.08] text-white" : "bg-black/[0.07] text-[#0a0a0a]",
    tabInactive: d ? "text-white/45 hover:text-white" : "text-black/45 hover:text-[#0a0a0a]",
    tableHead:   d ? "bg-white/[0.02]"       : "bg-black/[0.02]",
    rowHover:    d ? "hover:bg-white/[0.025]": "hover:bg-black/[0.025]",
    statBorder:  d ? "border-r border-white/[0.08]" : "border-r border-black/[0.08]",
    inputFocus:  d ? "focus:border-[#50AF95]/50" : "focus:border-[#50AF95]/70",
    inputBorder: d ? "border-white/[0.08]"   : "border-black/[0.1]",
    inputPlaceholder: d ? "placeholder:text-white/20" : "placeholder:text-black/25",
    tagBg:       d ? "bg-white/[0.06]"       : "bg-black/[0.06]",
    socialBorder:d ? "border-white/[0.1]"    : "border-black/[0.12]",
    socialHover: d ? "hover:border-white/25 hover:bg-white/[0.04]" : "hover:border-black/25 hover:bg-black/[0.04]",
    stackPill:   d ? "border-white/[0.08] text-white/40" : "border-black/[0.1] text-black/45",
    footerLink:  d ? "text-white/50 hover:text-white" : "text-black/55 hover:text-[#0a0a0a]",
    footerTitle: d ? "text-white/30"         : "text-black/35",
    footerDesc:  d ? "text-white/35"         : "text-black/40",
    alertBorder: d ? "border-white/[0.06]"   : "border-black/[0.08]",
    alertBg:     d ? "bg-white/[0.015]"      : "bg-black/[0.02]",
    divider:     d ? "divide-white/[0.05]"   : "divide-black/[0.06]",
    openBadge:   d ? "text-white/25"         : "text-black/30",
  };
}

// ─── StatCard ─────────────────────────────────────────────
function StatCard({ label, value, sub, color, last, tk }: {
  label: string; value: string; sub: string; color: string; last?: boolean;
  tk: ReturnType<typeof useThemeTokens>;
}) {
  return (
    <div className={`py-8 px-6 ${!last ? tk.statBorder : ""}`}>
      <div className={`text-[11px] uppercase tracking-widest mb-2 ${tk.textFaint}`}>{label}</div>
      <div className="text-2xl font-black tracking-tight mb-1" style={{ color }}>{value}</div>
      <div className={`text-[11px] ${tk.textMuted}`}>{sub}</div>
    </div>
  );
}

// ─── SunIcon / MoonIcon ───────────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");
  const [logOpen, setLogOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionTag | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  const tk = useThemeTokens(theme);

  // sync <html> class for Tailwind dark: if needed elsewhere
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const closedTrades   = TRADES.filter((t) => t.type === "SELL");
  const winners        = closedTrades.filter((t) => (t.pnl ?? 0) > 0);
  const winRate        = Math.round((winners.length / closedTrades.length) * 100);
  const totalPnl       = closedTrades.reduce((s, t) => s + (t.pnl ?? 0), 0);
  const portfolioValue = HOLDINGS.reduce((s, h) => s + h.amount * h.currentPrice, 0);
  const portfolioCost  = HOLDINGS.reduce((s, h) => s + h.amount * h.avgBuy, 0);
  const unrealizedPnl  = portfolioValue - portfolioCost;

  const emotionCounts: Record<string, number> = {};
  TRADES.forEach((t) => { emotionCounts[t.emotion] = (emotionCounts[t.emotion] ?? 0) + 1; });

  const maxBar = Math.max(...MONTHLY.map((m) => Math.abs(m.pnl)));

  const TABS: { id: Tab; label: string }[] = [
    { id: "portfolio", label: "Portfolio"   },
    { id: "trades",    label: "Trades"      },
    { id: "emotions",  label: "Emotions"    },
    { id: "ai",        label: "AI Feedback" },
  ];

  const themeBtn = `p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors`;

  return (
    <main className={`${tk.bg} ${tk.text} font-sans min-h-screen transition-colors duration-200`}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b ${tk.border} ${tk.navBg} transition-colors duration-200`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img 
              src="/CoinFessionLogo.svg" 
              alt="CoinFession Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className={`font-bold text-sm tracking-tight ${tk.text}`}>CoinFession</span>
            <span className={`text-xs ml-2 ${tk.textGhost}`}>Trade Journal</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {TABS.map((tab) => (
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

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={themeBtn}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={() => setLogOpen(true)}
            className="text-sm bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-5 py-2 rounded-md transition-colors"
          >
            + Log Trade
          </button>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-8 pb-24">

        {/* ── HERO ── */}
        <section className={`py-14 border-b ${tk.border}`}>
          <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-4">
            Your Trading Mirror
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-4">
            Stop repeating<br />
            <span className="text-[#50AF95]">the same mistakes.</span>
          </h1>
          <p className={`text-sm max-w-lg leading-relaxed ${tk.textMuted}`}>
            Log every trade, track your real P&amp;L, and let AI tell you exactly what your patterns
            say about you. Most traders lose because they never look back. This is your mirror.
          </p>
        </section>

        {/* ── STAT STRIP ── */}
        <section className={`grid grid-cols-2 md:grid-cols-4 border-b ${tk.border}`}>
          <StatCard tk={tk} label="Portfolio Value"  value={fmt(portfolioValue)}  sub={`${pct((unrealizedPnl / portfolioCost) * 100)} unrealized`} color={unrealizedPnl >= 0 ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Realized P&L"     value={fmt(totalPnl)}        sub={`${closedTrades.length} closed trades`}                    color={totalPnl >= 0 ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Win Rate"          value={`${winRate}%`}        sub={`${winners.length} of ${closedTrades.length} profitable`}  color={winRate >= 50 ? "#50AF95" : "#E05454"} />
          <StatCard tk={tk} label="Open Positions"    value={`${HOLDINGS.length}`} sub="active holdings"                                          color="#4A8FE7" last />
        </section>

        {/* ── MOBILE TAB BAR ── */}
        <div className="md:hidden flex gap-1 mt-6 mb-2 overflow-x-auto">
          {TABS.map((tab) => (
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
        <section className="mt-10">

          {/* PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-10">
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${tk.textFaint}`}>Current Holdings</h2>
                <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b ${tk.border} ${tk.tableHead}`}>
                        {["Asset", "Holdings", "Avg Buy", "Current Price", "Value", "Unrealized P&L"].map((h, i) => (
                          <th key={h} className={`py-3 px-5 text-[11px] uppercase tracking-wider font-medium ${tk.textFaint} ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOLDINGS.map((h, i) => {
                        const value   = h.amount * h.currentPrice;
                        const cost    = h.amount * h.avgBuy;
                        const upnl    = value - cost;
                        const upnlPct = (upnl / cost) * 100;
                        return (
                          <tr key={h.ticker} className={`${tk.rowHover} transition-colors ${i < HOLDINGS.length - 1 ? `border-b ${tk.borderSubtle}` : ""}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: h.color }}>
                                  {h.ticker[0]}
                                </div>
                                <div>
                                  <div className={`font-semibold text-sm ${tk.text}`}>{h.coin}</div>
                                  <div className={`text-[11px] ${tk.textFaint}`}>{h.ticker}</div>
                                </div>
                              </div>
                            </td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMid}`}>{h.amount} {h.ticker}</td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>{fmt(h.avgBuy)}</td>
                            <td className={`px-5 py-4 text-right font-mono text-sm ${tk.text}`}>{fmt(h.currentPrice)}</td>
                            <td className={`px-5 py-4 text-right font-mono text-sm font-semibold ${tk.text}`}>{fmt(value)}</td>
                            <td className="px-5 py-4 text-right font-mono text-sm" style={{ color: upnl >= 0 ? "#50AF95" : "#E05454" }}>
                              {fmt(upnl)} <span className="text-[11px] opacity-70">({pct(upnlPct)})</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Monthly bar chart */}
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${tk.textFaint}`}>Monthly P&L</h2>
                <div className={`border ${tk.border} rounded-xl p-6`}>
                  <div className="flex items-end gap-3" style={{ height: "140px" }}>
                    {MONTHLY.map((m) => {
                      const barH = (Math.abs(m.pnl) / maxBar) * 96;
                      const pos  = m.pnl >= 0;
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-[11px] font-mono" style={{ color: pos ? "#50AF95" : "#E05454" }}>
                            {pos ? "+" : ""}{(m.pnl / 1000).toFixed(1)}k
                          </span>
                          <div className="w-full flex items-end" style={{ height: "96px" }}>
                            <div
                              className="w-full rounded-sm"
                              style={{ height: `${Math.max(barH, 3)}px`, backgroundColor: pos ? "#50AF95" : "#E05454", opacity: 0.85 }}
                            />
                          </div>
                          <span className={`text-[11px] ${tk.textFaint}`}>{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TRADES */}
          {activeTab === "trades" && (
            <div>
              <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-5 ${tk.textFaint}`}>Trade History</h2>
              <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${tk.border} ${tk.tableHead}`}>
                      {["Date", "Asset", "Type", "Buy Price", "Sell Price", "P&L", "Emotion"].map((h, i) => (
                        <th key={h} className={`py-3 px-5 text-[11px] uppercase tracking-wider font-medium ${tk.textFaint} ${i <= 2 ? "text-left" : i < 6 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TRADES.map((t, i) => (
                      <tr key={t.id} className={`${tk.rowHover} transition-colors ${i < TRADES.length - 1 ? `border-b ${tk.borderSubtle}` : ""}`}>
                        <td className={`px-5 py-4 text-xs ${tk.textMuted}`}>{t.date}</td>
                        <td className="px-5 py-4">
                          <div className={`font-semibold text-sm ${tk.text}`}>{t.ticker}</div>
                          <div className={`text-[11px] ${tk.textFaint}`}>{t.coin}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[11px] font-bold px-2 py-1 rounded ${t.type === "BUY" ? "bg-[#4A8FE7]/10 text-[#4A8FE7]" : "bg-[#50AF95]/10 text-[#50AF95]"}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>{fmt(t.buyPrice)}</td>
                        <td className={`px-5 py-4 text-right font-mono text-sm ${tk.textMuted}`}>
                          {t.sellPrice ? fmt(t.sellPrice) : <span className={tk.openBadge}>—</span>}
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-sm">
                          {t.pnl !== undefined ? (
                            <span style={{ color: t.pnl >= 0 ? "#50AF95" : "#E05454" }}>
                              {fmt(t.pnl)} <span className="text-[11px] opacity-70">({pct(t.pnlPct!)})</span>
                            </span>
                          ) : (
                            <span className={`text-xs ${tk.openBadge}`}>Open</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{ color: EMOTION_COLORS[t.emotion], backgroundColor: `${EMOTION_COLORS[t.emotion]}18` }}
                          >
                            {t.emotion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EMOTIONS */}
          {activeTab === "emotions" && (
            <div className="space-y-8">
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${tk.textFaint}`}>Emotion Patterns</h2>
                <p className={`text-sm mb-6 ${tk.textMuted}`}>Your most common emotional states when trading. The numbers don't lie.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]).map(([emotion, count]) => {
                    const color = EMOTION_COLORS[emotion as EmotionTag];
                    const emotionPnl = TRADES
                      .filter((t) => t.emotion === emotion && t.pnl !== undefined)
                      .reduce((s, t) => s + (t.pnl ?? 0), 0);
                    return (
                      <div
                        key={emotion}
                        className={`border ${tk.border} rounded-xl p-5 transition-colors cursor-pointer`}
                        style={{ borderColor: undefined }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ color, backgroundColor: `${color}18` }}>
                            {emotion}
                          </span>
                          <span className={`text-xs ${tk.textMuted}`}>{count} trade{count > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-black" style={{ color: emotionPnl >= 0 ? "#50AF95" : "#E05454" }}>
                            {fmt(emotionPnl)}
                          </span>
                          <span className={`text-xs ${tk.textFaint}`}>total P&L in this state</span>
                        </div>
                        <div className={`h-1 rounded-full overflow-hidden ${theme === "dark" ? "bg-white/[0.07]" : "bg-black/[0.07]"}`}>
                          <div className="h-full rounded-full" style={{ width: `${(count / TRADES.length) * 100}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`border ${tk.alertBorder} rounded-xl p-6 ${tk.alertBg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold px-2 py-1 rounded bg-[#E05454]/10 text-[#E05454]">Pattern Alert</span>
                </div>
                <p className={`text-sm leading-relaxed ${tk.textMid}`}>
                  Your <span className={`font-semibold ${tk.text}`}>"Panic Sold"</span> and{" "}
                  <span className={`font-semibold ${tk.text}`}>"Greedy"</span> trades account for{" "}
                  <span className="text-[#E05454] font-bold">100% of your losses</span>. Every disciplined
                  trade you made was profitable. Your strategy works. Your emotions don't.
                </p>
              </div>
            </div>
          )}

          {/* AI FEEDBACK */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-[11px] font-semibold uppercase tracking-widest mb-2 ${tk.textFaint}`}>AI Journal Analysis</h2>
                <p className={`text-sm mb-6 ${tk.textMuted}`}>Brutally honest feedback based on your actual trading history. Powered by Claude.</p>
              </div>

              <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
                <div className={`${tk.tableHead} border-b ${tk.border} px-5 py-3 flex items-center gap-2`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#50AF95] animate-pulse inline-block" />
                  <span className={`text-xs ${tk.textMuted}`}>Claude Analysis — April 2025</span>
                </div>
                <div className="p-6 space-y-4 text-sm leading-relaxed">
                  <p className={tk.textMid}>
                    Looking at your last 6 trades, the pattern is obvious:{" "}
                    <span className={`font-semibold ${tk.text}`}>you know how to trade, but you don't trust yourself when it counts.</span>
                  </p>
                  <p className={tk.textMid}>
                    Your disciplined and patient trades returned an average of{" "}
                    <span className="text-[#50AF95] font-semibold">+14.6%</span>. Your emotional trades
                    (Panic Sold, Greedy) lost an average of{" "}
                    <span className="text-[#E05454] font-semibold">-22.65%</span>. You're not bad at
                    picking entries — you're bad at managing your psychology at the exit.
                  </p>
                  <p className={tk.textMid}>
                    The ETH panic sell on March 18th is particularly telling. You sold at $2,310 — ETH
                    is now at $3,180.{" "}
                    <span className={`font-semibold ${tk.text}`}>You would be up $760 on that position if you held your original thesis.</span>{" "}
                    What changed? Not the asset. You did.
                  </p>
                  <div className="border-l-2 border-[#50AF95] pl-4 py-1 mt-2">
                    <p className={`text-[11px] uppercase tracking-widest mb-1.5 font-semibold ${tk.textFaint}`}>Recommendation</p>
                    <p className={tk.textMid}>
                      Before every sell, write down the original reason you bought. If that reason is still
                      valid, don't sell. Set a rule: no sells within 24 hours of a red day. Your data shows
                      you are a profitable trader when disciplined —{" "}
                      <span className={`font-semibold ${tk.text}`}>the enemy is you, not the market.</span>
                    </p>
                  </div>
                </div>
              </div>

              <button className={`w-full border ${tk.border} ${tk.textMuted} hover:border-[#50AF95]/50 hover:text-[#50AF95] py-3.5 rounded-xl text-sm font-semibold transition-colors`}>
                Regenerate Analysis →
              </button>
            </div>
          )}

        </section>
      </div>

      {/* ── LOG TRADE MODAL ── */}
      {logOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-6"
          onClick={(e) => e.target === e.currentTarget && setLogOpen(false)}
        >
          <div className={`${tk.bgModal} border ${tk.border} rounded-2xl w-full max-w-md p-6 shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold text-base ${tk.text}`}>Log a Trade</h3>
              <button onClick={() => setLogOpen(false)} className={`text-2xl leading-none transition-colors ${tk.textMuted} hover:${tk.text}`}>×</button>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { label: "Coin",             placeholder: "e.g. Bitcoin" },
                { label: "Buy Price (USD)",  placeholder: "61,000" },
                { label: "Sell Price (USD)", placeholder: "Leave blank if still holding" },
                { label: "Amount",           placeholder: "0.5" },
                { label: "Date",             placeholder: "2025-04-09" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className={`block text-[11px] uppercase tracking-wider mb-1.5 ${tk.textFaint}`}>{label}</label>
                  <input
                    className={`w-full ${tk.bgInput} border ${tk.inputBorder} rounded-md px-4 py-2.5 ${tk.text} text-sm outline-none ${tk.inputFocus} ${tk.inputPlaceholder} transition-colors`}
                    placeholder={placeholder}
                  />
                </div>
              ))}
              <div>
                <label className={`block text-[11px] uppercase tracking-wider mb-2 ${tk.textFaint}`}>How did you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(EMOTION_COLORS) as EmotionTag[]).map((e) => (
                    <button
                      key={e}
                      onClick={() => setSelectedEmotion(selectedEmotion === e ? null : e)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors"
                      style={{
                        borderColor: selectedEmotion === e ? EMOTION_COLORS[e] : `${EMOTION_COLORS[e]}40`,
                        color: EMOTION_COLORS[e],
                        backgroundColor: selectedEmotion === e ? `${EMOTION_COLORS[e]}18` : "transparent",
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold py-3 rounded-md text-sm transition-colors">
              Save Trade
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className={`border-t ${tk.border} px-8 py-14 transition-colors duration-200`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

          {/* Brand + socials */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img 
                  src="/CoinFessionLogo.svg" 
                  alt="CoinFession Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={`font-bold text-sm ${tk.text}`}>CoinFession</span>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${tk.footerDesc}`}>
              A trade journal for crypto investors who want to stop repeating mistakes
              and start learning from their own patterns.
            </p>

            {/* Social icons with real SVG logos */}
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/kxvxn.js"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`w-9 h-9 rounded-md border ${tk.socialBorder} flex items-center justify-center ${tk.socialHover} transition-colors`}
                style={{ color: "#E1306C" }}
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://www.tiktok.com/@keybcuts.codes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className={`w-9 h-9 rounded-md border ${tk.socialBorder} flex items-center justify-center ${tk.socialHover} transition-colors`}
                style={{ color: theme === "dark" ? "#ffffff" : "#0a0a0a" }}
              >
                <TikTokIcon size={16} />
              </a>
              <a
                href="https://github.com/404NeuronNotFound"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={`w-9 h-9 rounded-md border ${tk.socialBorder} flex items-center justify-center ${tk.socialHover} transition-colors`}
                style={{ color: theme === "dark" ? "#e6edf3" : "#24292f" }}
              >
                <GitHubIcon size={17} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm">
            {[
              {
                title: "Product",
                links: [
                  { label: "Dashboard",      href: "#" },
                  { label: "Trade Log",      href: "#" },
                  { label: "Emotions",       href: "#" },
                  { label: "AI Feedback",    href: "#" },
                  { label: "Monthly Report", href: "#" },
                ],
              },
              {
                title: "Connect",
                links: [
                  { label: "@kxvxn.js",        href: "https://www.instagram.com/kxvxn.js" },
                  { label: "@keybcuts.codes",   href: "https://www.tiktok.com/@keybcuts.codes" },
                  { label: "404NeuronNotFound", href: "https://github.com/404NeuronNotFound" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Use",   href: "#" },
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className={`mb-4 uppercase text-[11px] tracking-widest ${tk.footerTitle}`}>{title}</div>
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`block mb-2 text-xs transition-colors ${tk.footerLink}`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Stack + credits */}
        <div className={`max-w-6xl mx-auto mt-10 pt-6 border-t ${tk.border}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech) => (
                <span key={tech} className={`text-[11px] px-2.5 py-1 rounded border font-mono ${tk.stackPill}`}>
                  {tech}
                </span>
              ))}
            </div>
            <div className="text-right shrink-0">
              <div className={`text-xs mb-1 ${tk.textMuted}`}>
                Developed by{" "}
                <a
                  href="https://github.com/404NeuronNotFound"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#50AF95] hover:underline font-semibold"
                >
                  Keybeen
                </a>
              </div>
              <div className={`text-[11px] flex items-center justify-end gap-1.5 ${tk.textFaint}`}>
                Featuring
                <span className={`font-semibold ${tk.textMuted}`}>Claude Code</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#50AF95] inline-block" />
              </div>
            </div>
          </div>
          <div className={`mt-5 text-[11px] ${tk.textGhost}`}>
            © {new Date().getFullYear()} CoinFession. Built for traders who want the truth.
          </div>
        </div>
      </footer>
    </main>
  );
}