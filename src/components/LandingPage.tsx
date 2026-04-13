"use client";

import { useState, useEffect } from "react";
import { Theme, getTokens, Tokens } from "@/lib/theme";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// ─── All sections are combined here because they are
//     landing-page-specific and won't be reused elsewhere.
// ─────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────
function Hero({ tk }: { tk: Tokens }) {
  return (
    <section className={`pt-36 pb-24 px-8 border-b ${tk.border}`}>
      <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-5">
        For Crypto Traders Who Want the Truth
      </p>
      <h1 className={`text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 ${tk.text}`}>
        Stop repeating<br />
        <span className="text-[#50AF95]">the same mistakes.</span>
      </h1>
      <p className={`text-base md:text-lg max-w-xl leading-relaxed mb-10 ${tk.textMuted}`}>
        CoinFession is a trade journal built for crypto investors. Log every buy and sell,
        track your real P&L, spot your emotional patterns, and let AI give you brutally
        honest feedback. Most traders lose because they never look back.{" "}
        <span className={`font-semibold ${tk.textMid}`}>This is your mirror.</span>
      </p>
      <div className="flex flex-wrap gap-4 mb-14">
        <a
          href="/signup"
          className="bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-8 py-3.5 rounded-md text-sm transition-colors no-underline"
        >
          Start Journaling Free
        </a>
        <a
          href="#features"
          className={`border ${tk.border} ${tk.textMid} font-medium px-8 py-3.5 rounded-md text-sm transition-colors no-underline`}
        >
          See Features →
        </a>
      </div>
      <div className={`flex flex-wrap gap-6 items-center text-xs ${tk.textFaint}`}>
        {["Free to start", "No credit card required", "Powered by Claude AI", "CoinGecko live prices"].map(
          (item, i, arr) => (
            <span key={item} className="flex items-center gap-6">
              {item}
              {i < arr.length - 1 && <span className={`w-px h-3 inline-block ${tk.borderSubtle} border-l`} />}
            </span>
          )
        )}
      </div>
    </section>
  );
}

// ── Stats strip ───────────────────────────────────────────
const STATS = [
  { value: "$60T+",  label: "Annual crypto volume tracked"  },
  { value: "15+",    label: "Blockchains supported"         },
  { value: "100%",   label: "Your data, your insights"      },
  { value: "1 min",  label: "To log your first trade"       },
];

function StatsStrip({ tk }: { tk: Tokens }) {
  return (
    <section className={`border-b ${tk.border}`}>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className={`py-10 px-8 ${i < STATS.length - 1 ? `border-r ${tk.border}` : ""}`}
          >
            <div className="text-3xl font-black text-[#50AF95] tracking-tight mb-1">{value}</div>
            <div className={`text-xs ${tk.textFaint}`}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  { icon: "📒", title: "Trade Log",          desc: "Log every buy and sell — coin, price, amount, date. Clean, fast, no friction."                          },
  { icon: "📊", title: "Real P&L Tracking",  desc: "Auto-calculate realized and unrealized profit and loss per trade and per coin."                          },
  { icon: "💼", title: "Portfolio Overview",  desc: "See all your current holdings in one view with live prices from CoinGecko."                              },
  { icon: "🎯", title: "Win Rate Tracker",    desc: "Know your actual win percentage. Not vibes. Not guesses. Your real numbers."                             },
  { icon: "🧠", title: "Emotion Log",         desc: "Tag each trade — FOMO, Disciplined, Panic Sold, Greedy, Patient. Spot your patterns over time."         },
  { icon: "🤖", title: "AI Feedback",         desc: "Claude reads your journal and tells you exactly what your patterns say about you. No filter."            },
];

function Features({ tk }: { tk: Tokens }) {
  return (
    <section id="features" className={`py-24 px-8 border-b ${tk.border}`}>
      <div className="mb-14">
        <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-3">Features</p>
        <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-3 ${tk.text}`}>
          Everything you need to trade better.
        </h2>
        <p className={`text-sm max-w-md leading-relaxed ${tk.textMuted}`}>
          Six tools built around one painful truth: most crypto traders repeat the same mistakes
          because they never track them.
        </p>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-px ${tk.borderSubtle} bg-black/[0.06]`}>
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className={`${tk.bgCard} p-8 hover:${tk.bgSubtle} transition-colors`}>
            <div className="text-2xl mb-4">{icon}</div>
            <h3 className={`font-bold text-base mb-2 ${tk.text}`}>{title}</h3>
            <p className={`text-sm leading-relaxed ${tk.textMuted}`}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────
const STEPS = [
  {
    step: "01",
    title: "Log your trades",
    desc: "Enter coin, buy price, sell price, amount, and date. Takes under a minute. Tag how you felt when you made the trade.",
  },
  {
    step: "02",
    title: "Watch patterns emerge",
    desc: "Your P&L, win rate, and emotion log build automatically. See which emotional states are costing you money.",
  },
  {
    step: "03",
    title: "Get AI feedback",
    desc: "Claude analyzes your full journal and gives you brutally honest feedback — no sugarcoating, just what the data says.",
  },
];

function HowItWorks({ tk }: { tk: Tokens }) {
  return (
    <section id="how-it-works" className={`py-24 px-8 border-b ${tk.border} ${tk.bgSubtle}`}>
      <div className="mb-14">
        <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-3">How it works</p>
        <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${tk.text}`}>
          Three steps. No excuses.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {STEPS.map(({ step, title, desc }) => (
          <div key={step} className="pt-6 border-t-2 border-[#50AF95]">
            <div className={`text-6xl font-black leading-none mb-4 select-none ${tk.textGhost}`}>{step}</div>
            <h3 className={`text-base font-bold mb-2 ${tk.text}`}>{title}</h3>
            <p className={`text-sm leading-relaxed ${tk.textMuted}`}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Emotion spotlight ─────────────────────────────────────
const EMOTIONS = [
  { tag: "Disciplined", color: "#50AF95", pnl: "+$6,650", trades: 3 },
  { tag: "Patient",     color: "#4A8FE7", pnl: "+$2,050", trades: 1 },
  { tag: "FOMO",        color: "#C0A161", pnl: "$0",       trades: 1 },
  { tag: "Greedy",      color: "#E07B54", pnl: "-$250",    trades: 1 },
  { tag: "Panic Sold",  color: "#E05454", pnl: "-$980",    trades: 1 },
];

function EmotionSpotlight({ tk }: { tk: Tokens }) {
  return (
    <section className={`py-24 px-8 border-b ${tk.border}`}>
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-3">Emotion Log</p>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-5 ${tk.text}`}>
            Your feelings<br />have a price tag.
          </h2>
          <p className={`text-sm leading-relaxed mb-6 ${tk.textMuted}`}>
            Every trade, you pick how you felt — Disciplined, Patient, FOMO, Greedy, or Panic Sold.
            Over time CoinFession shows you exactly which emotional states are making you money
            and which ones are bleeding your portfolio.
          </p>
          <div className="border-l-2 border-[#E05454] pl-4 py-1">
            <p className={`text-sm leading-relaxed ${tk.textMid}`}>
              Most traders already know what they do wrong. They just never see it written down
              next to a dollar amount. That changes everything.
            </p>
          </div>
        </div>

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
            <div className={`${tk.tableHead} border-b ${tk.border} px-5 py-3`}>
              <span className={`text-[11px] uppercase tracking-widest font-semibold ${tk.textFaint}`}>
                Emotion breakdown — your account
              </span>
            </div>
            {EMOTIONS.map(({ tag, color, pnl, trades }) => {
              const isPos = pnl.startsWith("+");
              const isNeg = pnl.startsWith("-");
              return (
                <div
                  key={tag}
                  className={`flex items-center justify-between px-5 py-4 border-b ${tk.borderSubtle} last:border-b-0 ${tk.rowHover} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color, backgroundColor: `${color}18` }}
                    >
                      {tag}
                    </span>
                    <span className={`text-xs ${tk.textFaint}`}>{trades} trade{trades > 1 ? "s" : ""}</span>
                  </div>
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: isPos ? "#50AF95" : isNeg ? "#E05454" : undefined }}
                  >
                    <span className={isPos || isNeg ? "" : tk.textFaint}>{pnl}</span>
                  </span>
                </div>
              );
            })}
            <div className={`px-5 py-4 ${tk.bgSubtle}`}>
              <p className={`text-xs leading-relaxed ${tk.textMuted}`}>
                <span className="font-semibold text-[#E05454]">Pattern detected:</span>{" "}
                100% of losses came from emotional trades. Every disciplined trade was profitable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── AI spotlight ──────────────────────────────────────────
function AISpotlight({ tk }: { tk: Tokens }) {
  return (
    <section className={`py-24 px-8 border-b ${tk.border} ${tk.bgSubtle}`}>
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className={`border ${tk.border} rounded-xl overflow-hidden`}>
            <div className={`${tk.tableHead} border-b ${tk.border} px-5 py-3 flex items-center gap-2`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#50AF95] animate-pulse inline-block" />
              <span className={`text-xs ${tk.textMuted}`}>Claude AI — analyzing your journal</span>
            </div>
            <div className="p-6 space-y-4 text-sm leading-relaxed">
              <p className={tk.textMid}>
                Looking at your last 6 trades, the pattern is obvious:{" "}
                <span className={`font-semibold ${tk.text}`}>
                  you know how to trade, but you don't trust yourself when it counts.
                </span>
              </p>
              <p className={tk.textMid}>
                Your disciplined trades returned an average of{" "}
                <span className="text-[#50AF95] font-semibold">+14.6%</span>. Your emotional
                trades lost an average of{" "}
                <span className="text-[#E05454] font-semibold">-22.6%</span>. You're not bad
                at picking entries — you're bad at managing your psychology at the exit.
              </p>
              <div className="border-l-2 border-[#50AF95] pl-4 py-1">
                <p className={`text-[11px] uppercase tracking-widest mb-1.5 font-semibold ${tk.textFaint}`}>
                  Recommendation
                </p>
                <p className={tk.textMid}>
                  Before every sell, write down the original reason you bought. If that reason is still
                  valid, don't sell.{" "}
                  <span className={`font-semibold ${tk.text}`}>The enemy is you, not the market.</span>
                </p>
              </div>
            </div>
            <div className={`border-t ${tk.border} px-5 py-3 flex items-center justify-between`}>
              <span className={`text-[11px] ${tk.textFaint}`}>Powered by Claude API · Anthropic</span>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#50AF95]/10 text-[#50AF95]">
                Brutally honest
              </span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-3">AI Feedback</p>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-5 ${tk.text}`}>
            A mirror,<br />not a cheerleader.
          </h2>
          <p className={`text-sm leading-relaxed mb-5 ${tk.textMuted}`}>
            Claude reads your entire trade journal — every entry, every emotion tag, every win
            and loss — and tells you exactly what your patterns say about you.
          </p>
          <p className={`text-sm leading-relaxed mb-8 ${tk.textMuted}`}>
            No encouragement. No vague tips. Just your data, interpreted honestly, with specific
            recommendations based on your actual behaviour.
          </p>
          <a
            href="/signup"
            className="inline-flex bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-7 py-3 rounded-md text-sm transition-colors no-underline"
          >
            Get Your First Analysis
          </a>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────
function CTA({ tk }: { tk: Tokens }) {
  return (
    <section className={`py-24 px-8 border-b ${tk.border}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <p className="text-[#50AF95] text-[11px] font-semibold uppercase tracking-widest mb-3">
            Get started free
          </p>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight mb-4 ${tk.text}`}>
            Ready to trade smarter?
          </h2>
          <p className={`text-sm leading-relaxed ${tk.textMuted}`}>
            Join traders who stopped guessing and started knowing. Log your first trade in under
            a minute. No credit card. No setup. Just clarity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="/signup"
            className="bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-9 py-3.5 rounded-md text-sm transition-colors no-underline text-center"
          >
            Start Free — No Card Needed
          </a>
          <a
            href="#features"
            className={`border ${tk.border} ${tk.textMuted} font-medium px-7 py-3.5 rounded-md text-sm transition-colors no-underline text-center`}
          >
            See Features
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function LandingPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const tk = getTokens(theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <main className={`${tk.bg} ${tk.text} font-sans min-h-screen transition-colors duration-200`}>
      <Navbar tk={tk} theme={theme} onToggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} />

      <div className="max-w-6xl mx-auto">
        <Hero           tk={tk} />
        <StatsStrip     tk={tk} />
        <Features       tk={tk} />
        <HowItWorks     tk={tk} />
        <EmotionSpotlight tk={tk} />
        <AISpotlight    tk={tk} />
        <CTA            tk={tk} />
      </div>

      <Footer tk={tk} theme={theme} />
    </main>
  );
}