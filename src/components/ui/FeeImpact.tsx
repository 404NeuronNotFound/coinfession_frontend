'use client';

interface FeeImpactData {
  totalFees: number;
  profitsFromFees: number;
  feePercentage: number;
}

interface FeeImpactProps {
  data: FeeImpactData;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function FeeImpact({ data }: FeeImpactProps) {
  const feePercentageOfProfits = (data.totalFees / data.profitsFromFees) * 100;

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Fee Impact
      </h3>

      <div className="space-y-6">
        {/* Fee Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground font-semibold">Fees consumed</span>
            <span className="text-sm font-semibold text-red-600">{data.feePercentage.toFixed(1)}% of gross profits</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-red-600"
              style={{ width: `${Math.min(feePercentageOfProfits, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
              Total Fees
            </div>
            <div className="text-lg sm:text-xl font-black text-foreground">{fmt(data.totalFees)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
              Gross Profits
            </div>
            <div className="text-lg sm:text-xl font-black text-green-600">{fmt(data.profitsFromFees)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
