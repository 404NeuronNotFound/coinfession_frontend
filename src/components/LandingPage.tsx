"use client";

import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  ChartIcon,
  ShieldIcon,
  WinRateIcon,
  TrendingUpIcon,
  SmileFaceLargeIcon,
  RobotHeadLargeIcon,
} from "@/components/ui/Icons";

// ─── All sections are combined here because they are
//     landing-page-specific and won't be reused elsewhere.
// ─────────────────────────────────────────────────────────

// ── Hero ──────────────────────────────────────────────────
function Hero() {
  return (
    <section className="pt-20 sm:pt-28 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-8 border-b border-border">
      <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-4 sm:mb-5">
        For Crypto Traders Who Want the Truth
      </p>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none mb-4 sm:mb-6 text-foreground">
        Stop repeating<br />
        <span className="text-primary">the same mistakes.</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8 sm:mb-10 text-muted-foreground">
        CoinFession is a trade journal built for crypto investors. Log every buy and sell,
        track your real P&L, spot your emotional patterns, and let Machine Learning analyze
        your trading behavior. Chat with Fric, your AI trading coach powered by local LLM.
        Most traders lose because they never look back.{" "}
        <span className="font-semibold text-foreground">This is your mirror.</span>
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-14">
        <Button asChild size="lg" className="text-sm sm:text-base">
          <a href="/register">Start Journaling Free</a>
        </Button>
        <Button variant="outline" asChild size="lg" className="text-sm sm:text-base">
          <a href="#features">See Features →</a>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-start sm:items-center text-xs text-muted-foreground">
        {["Free to start", "No credit card required", "Machine Learning powered", "CoinGecko live prices"].map(
          (item, i, arr) => (
            <span key={item} className="flex items-center gap-4 sm:gap-6">
              {item}
              {i < arr.length - 1 && <span className="w-px h-3 inline-block border-l border-border hidden sm:inline-block" />}
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
            className={`py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
          >
            <div className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-1">{value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  { Icon: ShieldIcon, title: "Trade Log", desc: "Log every buy and sell — coin, price, amount, date. Clean, fast, no friction." },
  { Icon: ChartIcon, title: "Real P&L Tracking", desc: "Auto-calculate realized and unrealized profit and loss per trade and per coin." },
  { Icon: TrendingUpIcon, title: "Portfolio Overview", desc: "See all your current holdings in one view with live prices from CoinGecko API." },
  { Icon: WinRateIcon, title: "Win Rate Tracker", desc: "Know your actual win percentage. Not vibes. Not guesses. Your real numbers." },
  { Icon: SmileFaceLargeIcon, title: "Emotion Log", desc: "Tag each trade — FOMO, Disciplined, Panic Sold, Greedy, Patient. Spot your patterns over time." },
  { Icon: RobotHeadLargeIcon, title: "ML Analysis & Fric 🐸", desc: "Machine Learning analyzes your patterns. Chat with Fric, your AI trading coach with live CoinGecko prices." },
];

function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-border">
      <div className="mb-10 sm:mb-12 md:mb-14">
        <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-2 sm:mb-3">Features</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2 sm:mb-3 text-foreground">
          Everything you need to trade better.
        </h2>
        <p className="text-xs sm:text-sm max-w-md leading-relaxed text-muted-foreground">
          Six tools built around one painful truth: most crypto traders repeat the same mistakes
          because they never track them.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
        {FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="bg-background p-6 sm:p-8 hover:bg-muted transition-colors">
            <div className="mb-4 text-primary">
              <Icon />
            </div>
            <h3 className="font-bold text-sm sm:text-base mb-2 text-foreground">{title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{desc}</p>
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
    title: "Get ML insights & chat with Fric",
    desc: "Machine Learning analyzes your trading patterns with data-driven predictions. Chat with Fric the Frog, your personal AI trading coach.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-border bg-muted/30">
      <div className="mb-10 sm:mb-12 md:mb-14">
        <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-2 sm:mb-3">How it works</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Three steps. No excuses.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {STEPS.map(({ step, title, desc }) => (
          <div key={step} className="pt-6 border-t-2 border-primary">
            <div className="text-5xl sm:text-6xl font-black leading-none mb-4 select-none text-muted-foreground/30">{step}</div>
            <h3 className="text-sm sm:text-base font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{desc}</p>
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
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-border">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-2 sm:mb-3">Emotion Log</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-5 text-foreground">
            Your feelings<br />have a price tag.
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-muted-foreground">
            Every trade, you pick how you felt — Disciplined, Patient, FOMO, Greedy, or Panic Sold.
            Over time CoinFession shows you exactly which emotional states are making you money
            and which ones are bleeding your portfolio.
          </p>
          <div className="border-l-2 border-destructive pl-4 py-1">
            <p className="text-xs sm:text-sm leading-relaxed text-foreground">
              Most traders already know what they do wrong. They just never see it written down
              next to a dollar amount. That changes everything.
            </p>
          </div>
        </div>

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className="border border-border rounded-lg sm:rounded-xl overflow-hidden">
            <div className="bg-muted border-b border-border px-4 sm:px-5 py-2 sm:py-3">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                Emotion breakdown — your account
              </span>
            </div>
            {EMOTIONS.map(({ tag, color, pnl, trades }) => {
              const isPos = pnl.startsWith("+");
              const isNeg = pnl.startsWith("-");
              return (
                <div
                  key={tag}
                  className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ color, backgroundColor: `${color}18` }}
                    >
                      {tag}
                    </span>
                    <span className="text-xs text-muted-foreground">{trades} trade{trades > 1 ? "s" : ""}</span>
                  </div>
                  <span
                    className="font-mono text-xs sm:text-sm font-semibold"
                    style={{ color: isPos ? "#50AF95" : isNeg ? "#E05454" : undefined }}
                  >
                    <span className={isPos || isNeg ? "" : "text-muted-foreground"}>{pnl}</span>
                  </span>
                </div>
              );
            })}
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-muted/50">
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
    <section id="ml-ai" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-border bg-muted/30">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">

        {/* Preview card */}
        <div className="flex-1 w-full">
          <div className="border border-border rounded-lg sm:rounded-xl overflow-hidden">
            <div className="bg-muted border-b border-border px-4 sm:px-5 py-2 sm:py-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              <span className="text-xs text-muted-foreground">Machine Learning — analyzing your patterns</span>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed">
              <p className="text-muted-foreground">
                ML model trained on your trading history identifies:{" "}
                <span className="font-semibold text-foreground">
                  you have strong entry timing but weak exit discipline.
                </span>
              </p>
              <p className="text-muted-foreground">
                Your disciplined trades show{" "}
                <span className="text-primary font-semibold">+14.6%</span> average return with{" "}
                <span className="text-primary font-semibold">78% win probability</span>. Emotional
                trades average{" "}
                <span className="text-destructive font-semibold">-22.6%</span> with only{" "}
                <span className="text-destructive font-semibold">23% win probability</span>.
              </p>
              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-widest mb-1.5 font-semibold text-muted-foreground">
                  🐸 Fric says
                </p>
                <p className="text-muted-foreground">
                  Ribbit! Your data shows you're not bad at picking coins — you're struggling with
                  psychology at the exit. Try setting exit rules before entering trades.{" "}
                  <span className="font-semibold text-foreground">The enemy is you, not the market.</span>
                </p>
              </div>
            </div>
            <div className="border-t border-border px-4 sm:px-5 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">Powered by scikit-learn ML + Ollama LLM + CoinGecko API</span>
              <span className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                Real-time insights
              </span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="flex-1 md:max-w-sm">
          <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-2 sm:mb-3">ML Analysis & Fric 🐸</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-5 text-foreground">
            Machine Learning<br />meets your coach.
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 text-muted-foreground">
            Our ML models analyze your entire trade history — every entry, emotion tag, win
            and loss — to predict outcomes and identify patterns you can't see.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 text-muted-foreground">
            Chat with Fric the Frog, your personal AI trading coach powered by Ollama running
            locally. Ask questions in English, Bisaya, or Tagalog. Fric uses live market data
            from CoinGecko API to give you real-time insights on current prices, 24h changes,
            and unrealized P&L on your open positions.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 text-muted-foreground">
            No cloud dependency. No data sent to third parties. Your trading data stays private
            while you get professional-grade analysis with real-time market context.
          </p>
          <Button asChild size="lg" className="text-sm sm:text-base">
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
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 border-b border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10">
        <div className="max-w-xl">
          <p className="text-primary text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-2 sm:mb-3">
            Get started free
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3 sm:mb-4 text-foreground">
            Ready to trade smarter?
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Join traders who stopped guessing and started knowing. Log your first trade in under
            a minute. No credit card. No setup. Just clarity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
          <Button asChild size="lg" className="text-sm sm:text-base">
            <a href="/register">Start Free — No Card Needed</a>
          </Button>
          <Button variant="outline" asChild size="lg" className="text-sm sm:text-base">
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
