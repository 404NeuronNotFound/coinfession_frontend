'use client';

interface Holding {
  id: number;
  coin: string;
  ticker: string;
  amount: number;
  avgBuyPrice: number;
  currentPrice: number;
  color: string;
  percentage: number;
  change24h?: number;
  unrealizedPnl?: number;
  unrealizedPnlPct?: number;
  currentValue?: number;
}

interface HoldingCardProps {
  holding: Holding;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

export default function HoldingCard({ holding }: HoldingCardProps) {
  const totalValue = holding.currentValue ?? holding.amount * holding.currentPrice;
  const totalCost = holding.amount * holding.avgBuyPrice;
  const pnl = holding.unrealizedPnl ?? (totalValue - totalCost);
  const pnlPct = holding.unrealizedPnlPct ?? ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100;
  const priceChange24h = holding.change24h ?? 0;

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: holding.color }}
          >
            {holding.ticker[0]}
          </div>
          <div>
            <div className="text-sm sm:text-base font-semibold text-foreground">{holding.coin}</div>
            <div className="text-xs text-muted-foreground">
              {holding.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {holding.ticker} · {holding.percentage.toFixed(1)}% of portfolio
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl font-black text-foreground">{fmtDec(totalValue)}</div>
          <div className={`text-xs sm:text-sm font-semibold ${pos(priceChange24h) ? "text-green-600" : "text-red-600"}`}>
            {pct(priceChange24h)} 24h
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mb-4 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points="0,15 10,12 20,14 30,10 40,13 50,8 60,11 70,9 80,12 90,10 100,13"
            fill="none"
            stroke={holding.color}
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
            Avg Buy
          </div>
          <div className="text-sm sm:text-base font-semibold text-foreground">{fmtDec(holding.avgBuyPrice)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
            Current Price
          </div>
          <div className="text-sm sm:text-base font-semibold text-foreground">{fmtDec(holding.currentPrice)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
            Unrealized P&L
          </div>
          <div
            className="text-sm sm:text-base font-semibold"
            style={{ color: pos(pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
          >
            {pct(pnlPct)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
            Return
          </div>
          <div
            className="text-sm sm:text-base font-semibold"
            style={{ color: pos(pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
          >
            {fmt(pnl)}
          </div>
        </div>
      </div>
    </div>
  );
}
