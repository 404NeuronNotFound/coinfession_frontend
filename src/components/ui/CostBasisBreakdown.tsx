'use client';

interface CostBasisItem {
  coin: string;
  ticker: string;
  avgBuyPrice: number;
  totalCost: number;
  currentValue: number;
  pnl: number;
  pnlPct: number;
  color: string;
}

interface CostBasisBreakdownProps {
  data: CostBasisItem[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const pos = (n: number) => n >= 0;

export default function CostBasisBreakdown({ data }: CostBasisBreakdownProps) {
  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Cost Basis Breakdown
      </h3>

      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: item.color }}
              >
                {item.ticker[0]}
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-foreground">{item.ticker}</div>
                <div className="text-xs text-muted-foreground">{fmtDec(item.avgBuyPrice)} avg</div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-foreground">{fmt(item.totalCost)}</div>
              <div className="text-xs text-muted-foreground">cost</div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-foreground">{fmt(item.currentValue)}</div>
              <div className="text-xs text-muted-foreground">current</div>
            </div>

            <div className="text-right space-y-1">
              <div
                className="text-xs sm:text-sm font-semibold"
                style={{ color: pos(item.pnl) ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
              >
                {fmt(item.pnl)}
              </div>
              <div className="text-xs text-muted-foreground">{pct(item.pnlPct)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
