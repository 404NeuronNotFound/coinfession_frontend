"use client";

import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="bg-[#0a0a0a] text-white overflow-x-hidden font-sans">

      {/* ─── NAV ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#50AF95] flex items-center justify-center">
            <span className="text-[#0a0a0a] font-bold text-sm">₮</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Tether</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          {["Why Tether", "How it works", "Transparency", "News"].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors duration-200">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="text-sm text-white/70 hover:text-white px-4 py-2 transition-colors">
            Log In
          </button>
          <button className="text-sm bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-semibold px-5 py-2 rounded-full transition-colors duration-200">
            Sign Up
          </button>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(80,175,149,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(80,175,149,0.6) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#50AF95]/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#50AF95]/5 blur-[80px] pointer-events-none" />

        {/* Floating token pills */}
        <FloatingTokens />

        {/* Hero text */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#50AF95] animate-pulse" />
            $156B+ in circulation across 15+ blockchains
          </div>

          <h1
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none"
            style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}
          >
            The World&apos;s
            <br />
            <span className="text-[#50AF95]">Most Trusted</span>
            <br />
            Stablecoin
          </h1>

          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Tether tokens are the most traded cryptocurrency in the world —
            digital dollars built for speed, stability, and global reach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105">
              Create Account
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200">
              Learn How It Works →
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ─── STATS STRIP ─────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.02] py-10">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "$156B+", label: "Total Supply" },
            { value: "15+", label: "Blockchains" },
            { value: "#1", label: "Most Traded Crypto" },
            { value: "$60T+", label: "Annual Volume" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-[#50AF95] tracking-tight mb-1">
                {value}
              </div>
              <div className="text-white/40 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TOKENS SECTION ──────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-xl">
            <p className="text-[#50AF95] text-sm font-semibold uppercase tracking-widest mb-4">
              Our Tokens
            </p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight mb-4"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Stability in every currency
            </h2>
            <p className="text-white/50">
              From dollars to euros to gold — Tether offers stable digital
              assets pegged to real-world value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                symbol: "₮",
                name: "Tether USD",
                ticker: "USDT",
                color: "#50AF95",
                bg: "#50AF95",
                desc: "The most widely used stablecoin, pegged 1:1 to the US Dollar.",
                supply: "$156.4B",
              },
              {
                symbol: "€",
                name: "Tether EUR",
                ticker: "EURT",
                color: "#4A8FE7",
                bg: "#4A8FE7",
                desc: "Euro-pegged stability for European markets and global traders.",
                supply: "$48.2M",
              },
              {
                symbol: "◈",
                name: "Tether Gold",
                ticker: "XAUt",
                color: "#C0A161",
                bg: "#C0A161",
                desc: "Each token backed by one troy ounce of physical gold.",
                supply: "$712M",
              },
            ].map((token) => (
              <TokenCard key={token.ticker} {...token} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-28 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#50AF95] text-sm font-semibold uppercase tracking-widest mb-4">
              How It Works
            </p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Simple. Stable. Secure.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create an account",
                desc: "Sign up and complete verification to access Tether tokens instantly.",
              },
              {
                step: "02",
                title: "Deposit funds",
                desc: "Fund your account with USD, EUR, or other supported currencies.",
              },
              {
                step: "03",
                title: "Use anywhere",
                desc: "Send, receive, and trade USDT on 15+ blockchain networks globally.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative group">
                <div className="text-[80px] font-black text-white/[0.04] leading-none mb-4 group-hover:text-white/[0.07] transition-colors">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-white/50 leading-relaxed">{desc}</p>
                <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#50AF95]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRANSPARENCY ────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <p className="text-[#50AF95] text-sm font-semibold uppercase tracking-widest mb-4">
              Transparency
            </p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Every token
              <br />
              fully backed
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed max-w-md">
              Tether publishes quarterly attestations from independent
              accounting firms, confirming that all tokens are 100% backed by
              reserves.
            </p>
            <button className="border border-[#50AF95]/40 hover:border-[#50AF95] text-[#50AF95] px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200">
              View Transparency Reports →
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { label: "Cash & Equivalents", pct: "83%", color: "#50AF95" },
              { label: "US Treasury Bills", pct: "76%", color: "#4A8FE7" },
              { label: "Secured Loans", pct: "8%", color: "#C0A161" },
              { label: "Other Assets", pct: "9%", color: "#A06AF5" },
            ].map(({ label, pct, color }) => (
              <div
                key={label}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition-colors"
              >
                <div className="text-3xl font-black mb-2" style={{ color }}>
                  {pct}
                </div>
                <div className="text-white/50 text-sm">{label}</div>
                <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: pct, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-[#50AF95]/5 blur-[80px] rounded-full" />
          <div className="relative z-10 border border-white/10 rounded-3xl p-12 bg-white/[0.02]">
            <h2
              className="text-4xl md:text-5xl font-black tracking-tight mb-6"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Ready to get started?
            </h2>
            <p className="text-white/50 mb-8 text-lg">
              Join millions of users who trust Tether for global payments,
              trading, and savings.
            </p>
            <button className="bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-10 py-4 rounded-full text-base transition-all duration-200 hover:scale-105">
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-[#50AF95] flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xs">₮</span>
              </div>
              <span className="font-semibold">Tether</span>
            </div>
            <p className="text-white/30 text-sm max-w-xs">
              The world&apos;s most trusted and widely used stablecoin.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            {[
              {
                title: "Product",
                links: ["Why Tether", "How it works", "Tether Gold", "EURT"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Transparency"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="text-white/30 mb-4 uppercase text-xs tracking-widest">
                  {title}
                </div>
                {links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-white/60 hover:text-white mb-2 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 text-white/20 text-xs flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Tether Operations Limited. All rights reserved.</span>
          <span>Built with Next.js · Tailwind CSS · shadcn/ui</span>
        </div>
      </footer>
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────────── */

function TokenCard({
  symbol,
  name,
  ticker,
  color,
  bg,
  desc,
  supply,
}: {
  symbol: string;
  name: string;
  ticker: string;
  color: string;
  bg: string;
  desc: string;
  supply: string;
}) {
  return (
    <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden">
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: bg }}
      />
      <div className="relative z-10">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-5 text-[#0a0a0a]"
          style={{ backgroundColor: bg }}
        >
          {symbol}
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="font-bold text-lg">{name}</h3>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ color, backgroundColor: `${bg}20` }}
          >
            {ticker}
          </span>
        </div>
        <p className="text-white/40 text-sm mb-6 leading-relaxed">{desc}</p>
        <div className="flex items-center justify-between text-sm border-t border-white/5 pt-4">
          <span className="text-white/30">Supply</span>
          <span className="font-semibold" style={{ color }}>
            {supply}
          </span>
        </div>
      </div>
    </div>
  );
}

function FloatingTokens() {
  const tokens = [
    { symbol: "₮", label: "USDT", color: "#50AF95", x: "8%", y: "20%", delay: "0s" },
    { symbol: "◈", label: "XAUt", color: "#C0A161", x: "88%", y: "15%", delay: "1.2s" },
    { symbol: "€", label: "EURT", color: "#4A8FE7", x: "5%", y: "72%", delay: "0.6s" },
    { symbol: "₮", label: "USDT", color: "#50AF95", x: "85%", y: "68%", delay: "1.8s" },
    { symbol: "Ξ", label: "ETH", color: "#A06AF5", x: "92%", y: "42%", delay: "0.9s" },
  ];

  return (
    <>
      {tokens.map((t, i) => (
        <div
          key={i}
          className="absolute hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 py-1.5 text-xs backdrop-blur-sm animate-float"
          style={{
            left: t.x,
            top: t.y,
            animationDelay: t.delay,
            animationDuration: "6s",
          }}
        >
          <span className="font-bold" style={{ color: t.color }}>
            {t.symbol}
          </span>
          <span className="text-white/60">{t.label}</span>
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}