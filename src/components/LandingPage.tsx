"use client";

import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// ─── All sections are combined here because they are
//     landing-page-specific and won't be reused elsewhere.
// ─────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-36 pb-24 px-8 border-b border-border">
      <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-5">
        For Crypto Traders Who Want the Truth
      </p>
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-foreground">
        Stop repeating<br />
        <span className="text-primary">the same mistakes.</span>
      </h1>
      <p className="text-base md:text-lg max-w-xl leading-relaxed mb-10 text-muted-foreground">
        CoinFession is a trade journal built for crypto investors. Log every buy and sell,
        track your real P&L, spot your emotional patterns, and let AI give you brutally
        honest feedback. Most traders lose because they never look back.{" "}
        <span className="font-semibold text-foreground">This is your mirror.</span>
      </p>
      <div className="flex flex-wrap gap-4 mb-14">
        <Button asChild size="lg">
          <a href="/register">Start Journaling Free</a>
        </Button>
        <Button variant="outline" asChild size="lg">
          <a href="#features">See Features →</a>
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 items-center text-xs text-muted-foreground">
        {["Free to start", "No credit card required", "Powered by Claude AI", "CoinGecko live prices"].map(
          (item, i, arr) => (
            <span key={item} className="flex items-center gap-6">
              {item}
              {i < arr.length - 1 && <span className="w-px h-3 inline-block border-l border-border" />}
            </span>
          )
        )}
      </div>
    </section>
  );
}

// ── Stats strip ───────────────────────────────────────────
const STATS = [
  { value: "$60T+", label: "Annual crypto volume tracked" },
  { value: "15+", label: "Blockchains supported" },
  { value: "100%", label: "Your data, your insights" },
  { value: "1 min", label: "To log your first trade" },
];

function StatsStrip() {
  return (
    <section className="border-b border-border">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map(({ value, label }, i) => (
          <div
            key={label}
            className={`py-10 px-8 ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
          >
            <div className="text-3xl font-black text-primary tracking-tight mb-1">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  { icon: "📒", title: "Trade Log", desc: "Log every buy and sell — coin, price, amount, date. Clean, fast, no friction." },
  { icon: "📊", title: "Real P&L Tracking", desc: "Auto-calculate realized and unrealized profit and loss per trade and per coin." },
  { icon: "💼", title: "Portfolio Overview", desc: "See all your current holdings in one view with live prices from CoinGecko." },
  { icon: "🎯", title: "Win Rate Tracker", desc: "Know your actual win percentage. Not vibes. Not guesses. Your real numbers." },
  { icon: "🧠", title: "Emotion Log", desc: "Tag each trade — FOMO, Disciplined, Panic Sold, Greedy, Patient. Spot your patterns over time." },
  { icon: "🤖", title: "AI Feedback", desc: "Claude reads your journal and tells you exactly what your patterns say about you. No filter." },
];

function Features() {
  return (
    <section id="features" className="py-24 px-8 border-b border-border">
      <div className="mb-14">
        <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-3">Features</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-foreground">
          Everything you need to trade better.
        </h2>
        <p className="text-sm max-w-md leading-relaxed text-muted-foreground">
          Six tools built around one painful truth: most crypto traders repeat the same mistakes
          because they never track them.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {FEATURES.map(({ icon, title, desc }) => (
          <div key={title} className="bg-background p-8 hover:bg-muted transition-colors">
            <div className="text-2xl mb-4">{icon}</div>
            <h3 className="font-bold text-base mb-2 text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
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

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-8 border-b border-border bg-muted/30">
      <div className="mb-14">
        <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-3">How it works</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Three steps. No excuses.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {STEPS.map(({ step, title, desc }) => (
          <div key={step} className="pt-6 border-t-2 border-primary">
            <div className="text-6xl font-black leading-none mb-4 select-none text-muted-foreground/30">{step}</div>
            <h3 className="text-base font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Emotion spotlight ─────────────────────────────────────
const EMOTIONS = [
  { tag: "Disciplined", color: "#50AF95", pnl: "+$6,650", trades: 3 },
  { tag: "Patient", color: "#4A8FE7", pnl: "+$2,050", trades: 1 },
  { tag: "FOMO", color: "#C0A161", pnl: "$0", trades: 1 },
  { tag: "Greedy", color: "#E07B54", pnl: "-$250", trades: 1 },
  { tag: "Panic Sold", color: "#E05454", pnl: "-$980", trades: 1 },
];

function EmotionSpotlight() {
  return (
    <section className="py-24 px-8 border-b border-border">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-3">Emotion Log</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5 text-foreground">
            Your feelings<br />have a price tag.
          </h2>
          <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
            Every trade, you pick how you felt — Disciplined, Patient, FOMO, Greedy, or Panic Sold.
            Over time CoinFession shows you exactly which emotional states are making you money
            and which ones are bleeding your portfolio.
          </p>
          <div className="border-l-2 border-destructive pl-4 py-1">
            <p className="text-sm leading-relaxed text-foreground">
              Most traders already know what they do wrong. They just never see it written down
              next to a dollar amount. That changes everything.
            </p>
          </div>
        </div>

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-muted border-b border-border px-5 py-3">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                Emotion breakdown — your account
              </span>
            </div>
            {EMOTIONS.map(({ tag, color, pnl, trades }) => {
              const isPos = pnl.startsWith("+");
              const isNeg = pnl.startsWith("-");
              return (
                <div
                  key={tag}
                  className="flex items-center justify-between px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color, backgroundColor: `${color}18` }}
                    >
                      {tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{trades} trade{trades > 1 ? "s" : ""}</span>
                  </div>
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: isPos ? "#50AF95" : isNeg ? "#E05454" : undefined }}
                  >
                    <span className={isPos || isNeg ? "" : "text-muted-foreground"}>{pnl}</span>
                  </span>
                </div>
              );
            })}
            <div className="px-5 py-4 bg-muted/50">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-destructive">Pattern detected:</span>{" "}
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
function AISpotlight() {
  return (
    <section id="claude-ai" className="py-24 px-8 border-b border-border bg-muted/30">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-muted border-b border-border px-5 py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              <span className="text-xs text-muted-foreground">Claude AI — analyzing your journal</span>
            </div>
            <div className="p-6 space-y-4 text-sm leading-relaxed">
              <p className="text-muted-foreground">
                Looking at your last 6 trades, the pattern is obvious:{" "}
                <span className="font-semibold text-foreground">
                  you know how to trade, but you don't trust yourself when it counts.
                </span>
              </p>
              <p className="text-muted-foreground">
                Your disciplined trades returned an average of{" "}
                <span className="text-primary font-semibold">+14.6%</span>. Your emotional
                trades lost an average of{" "}
                <span className="text-destructive font-semibold">-22.6%</span>. You're not bad
                at picking entries — you're bad at managing your psychology at the exit.
              </p>
              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="text-[11px] uppercase tracking-widest mb-1.5 font-semibold text-muted-foreground">
                  Recommendation
                </p>
                <p className="text-muted-foreground">
                  Before every sell, write down the original reason you bought. If that reason is still
                  valid, don't sell.{" "}
                  <span className="font-semibold text-foreground">The enemy is you, not the market.</span>
                </p>
              </div>
            </div>
            <div className="border-t border-border px-5 py-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Powered by Claude API · Anthropic</span>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Brutally honest
              </span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-3">AI Feedback</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-5 text-foreground">
            A mirror,<br />not a cheerleader.
          </h2>
          <p className="text-sm leading-relaxed mb-5 text-muted-foreground">
            Claude reads your entire trade journal — every entry, every emotion tag, every win
            and loss — and tells you exactly what your patterns say about you.
          </p>
          <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
            No encouragement. No vague tips. Just your data, interpreted honestly, with specific
            recommendations based on your actual behaviour.
          </p>
          <Button asChild size="lg">
            <a href="/register">Get Your First Analysis</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 px-8 border-b border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl">
          <p className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-3">
            Get started free
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">
            Ready to trade smarter?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Join traders who stopped guessing and started knowing. Log your first trade in under
            a minute. No credit card. No setup. Just clarity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Button asChild size="lg">
            <a href="/register">Start Free — No Card Needed</a>
          </Button>
          <Button variant="outline" asChild size="lg">
            <a href="#features">See Features</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function LandingPage() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const d = theme === "dark";

  return (
    <main className={`font-sans min-h-screen transition-colors duration-200 ${d ? "bg-background text-foreground" : "bg-white text-foreground"}`}>
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <Hero />
        <StatsStrip />
        <Features />
        <HowItWorks />
        <EmotionSpotlight />
        <AISpotlight />
        <CTA />
      </div>

      <Footer />
    </main>
  );
}
