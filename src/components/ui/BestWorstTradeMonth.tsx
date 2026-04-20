'use client';

interface Trade {
  coin: string;
  ticker: string;
  type: string;
  buyPrice: number;
  sellPrice: number;
  pnl: number;
  emotion: string;
  date: string;
}

interface BestWorstTradeMonthProps {
  data: {
    best: Trade;
    worst: Trade;
  };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtDec = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function BestWorstTradeMonth({ data }: BestWorstTradeMonthProps) {
  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Best & Worst Trade This Month
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Best Trade */}
        <div className="p-4 sm:p-5 rounded-lg border-2 border-green-200 bg-green-50">
          <div className="text-sm sm:text-base font-semibold text-green-900 mb-3">
            Best Trade
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-green-900">{data.best.ticker} · {data.best.type}</span>
              <span className="text-xs sm:text-sm font-semibold text-green-900">{data.best.date}</span>
            </div>
            <div className="text-xs sm:text-sm text-green-900">
              {fmtDec(data.best.buyPrice)} → {fmtDec(data.best.sellPrice)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl sm:text-3xl font-black text-green-600">
              +{fmt(data.best.pnl)}
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-xs font-semibold text-green-900">
            {data.best.emotion}
          </div>
        </div>

        {/* Worst Trade */}
        <div className="p-4 sm:p-5 rounded-lg border-2 border-red-200 bg-red-50">
          <div className="text-sm sm:text-base font-semibold text-red-900 mb-3">
            Worst Trade
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-red-900">{data.worst.ticker} · {data.worst.type}</span>
              <span className="text-xs sm:text-sm font-semibold text-red-900">{data.worst.date}</span>
            </div>
            <div className="text-xs sm:text-sm text-red-900">
              {fmtDec(data.worst.buyPrice)} → {fmtDec(data.worst.sellPrice)}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl sm:text-3xl font-black text-red-600">
              {fmt(data.worst.pnl)}
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-xs font-semibold text-red-900">
            {data.worst.emotion}
          </div>
        </div>
      </div>
    </div>
  );
}
