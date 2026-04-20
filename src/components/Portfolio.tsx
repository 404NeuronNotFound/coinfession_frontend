"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/ui/DashboardHeader";
import PortfolioStats from "@/components/ui/PortfolioStats";
import AllocationChart from "@/components/ui/AllocationChart";
import CostBasisBreakdown from "@/components/ui/CostBasisBreakdown";
import HoldingCard from "@/components/ui/HoldingCard";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";

interface Holding {
  id: number;
  coin: string;
  ticker: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  color: string;
  percentage: number;
}

const MOCK_HOLDINGS: Holding[] = [
  {
    id: 1,
    coin: "Bitcoin",
    ticker: "BTC",
    amount: 0.42,
    avgBuyPrice: 58200,
    currentPrice: 62400,
    color: "#F7931A",
    percentage: 70.9,
  },
  {
    id: 2,
    coin: "Ethereum",
    ticker: "ETH",
    amount: 3.1,
    avgBuyPrice: 2800,
    currentPrice: 2540,
    color: "#627EEA",
    percentage: 21.3,
  },
  {
    id: 3,
    coin: "Solana",
    ticker: "SOL",
    amount: 3,
    avgBuyPrice: 142,
    currentPrice: 168,
    color: "#9945FF",
    percentage: 2.3,
  },
  {
    id: 4,
    coin: "Avalanche",
    ticker: "AVAX",
    amount: 12,
    avgBuyPrice: 32.3,
    currentPrice: 36.6,
    color: "#E84142",
    percentage: 2.3,
  },
  {
    id: 5,
    coin: "USDC",
    ticker: "USDC",
    amount: 1200,
    avgBuyPrice: 1.0,
    currentPrice: 1.0,
    color: "#2775CA",
    percentage: 3.2,
  },
];

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

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // Calculate stats
  const totalValue = MOCK_HOLDINGS.reduce((sum, h) => sum + h.amount * h.currentPrice, 0);
  const totalCost = MOCK_HOLDINGS.reduce((sum, h) => sum + h.amount * h.avgBuyPrice, 0);
  const unrealizedPnL = totalValue - totalCost;
  const unrealizedPct = totalCost ? (unrealizedPnL / totalCost) * 100 : 0;
  const coinsHeld = MOCK_HOLDINGS.length;

  const stats = [
    {
      label: "Total Value",
      value: fmt(totalValue),
      subtext: `${fmt(totalValue - totalCost)} today`,
      color: pos(unrealizedPnL) ? ("success" as const) : ("warning" as const),
    },
    {
      label: "Total Cost Basis",
      value: fmt(totalCost),
      subtext: "amount invested",
      color: "default" as const,
    },
    {
      label: "Unrealized P&L",
      value: fmt(unrealizedPnL),
      subtext: `${pct(unrealizedPct)} overall`,
      color: pos(unrealizedPnL) ? ("success" as const) : ("warning" as const),
    },
    {
      label: "Coins Held",
      value: `${coinsHeld}`,
      subtext: "active positions",
      color: "default" as const,
    },
  ];

  const costBasisData = MOCK_HOLDINGS.map((h) => ({
    coin: h.coin,
    ticker: h.ticker,
    avgBuyPrice: h.avgBuyPrice,
    totalCost: h.amount * h.avgBuyPrice,
    currentValue: h.amount * h.currentPrice,
    pnl: h.amount * h.currentPrice - h.amount * h.avgBuyPrice,
    pnlPct: ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100,
    color: h.color,
  }));

  if (!isAuthenticated) return null;

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
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Live prices via CoinGecko · updated 2 min ago
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => console.log("Refresh prices")} size="sm" className="text-xs sm:text-sm">
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <section className="mb-6 sm:mb-8">
          <PortfolioStats stats={stats} />
        </section>

        {/* Progress Bar */}
        <section className="mb-6 sm:mb-8">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full flex"
              style={{
                background: `linear-gradient(to right, ${MOCK_HOLDINGS.map((h) => h.color).join(', ')})`,
              }}
            />
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Allocation Chart */}
          <AllocationChart holdings={MOCK_HOLDINGS} />

          {/* Cost Basis Breakdown */}
          <CostBasisBreakdown data={costBasisData} />
        </div>

        {/* Holdings */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Holdings</h2>
          <div className="space-y-4">
            {MOCK_HOLDINGS.map((holding) => (
              <HoldingCard key={holding.id} holding={holding} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
