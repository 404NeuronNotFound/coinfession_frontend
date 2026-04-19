'use client';

interface WinLossData {
  wins: number;
  losses: number;
  breakEven: number;
}

interface WinLossRatioProps {
  data: WinLossData;
}

export default function WinLossRatio({ data }: WinLossRatioProps) {
  const total = data.wins + data.losses + data.breakEven;
  const winPct = (data.wins / total) * 100;
  const lossPct = (data.losses / total) * 100;
  const breakEvenPct = (data.breakEven / total) * 100;

  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = -90;
  const getCoordinates = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 50 + r * Math.cos(rad),
      y: 50 + r * Math.sin(rad),
    };
  };

  const createSlice = (percentage: number, color: string) => {
    const sliceAngle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startCoords = getCoordinates(startAngle, radius);
    const endCoords = getCoordinates(endAngle, radius);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const innerRadius = radius - 12;

    const startInner = getCoordinates(startAngle, innerRadius);
    const endInner = getCoordinates(endAngle, innerRadius);

    const pathData = [
      `M ${startCoords.x} ${startCoords.y}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${endCoords.x} ${endCoords.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
      'Z',
    ].join(' ');

    currentAngle = endAngle;
    return { pathData, color };
  };

  const slices = [
    createSlice(winPct, '#22c55e'),
    createSlice(lossPct, '#ef4444'),
    createSlice(breakEvenPct, '#6b7280'),
  ];

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Win / Loss Ratio
      </h3>

      <div className="flex flex-col items-center gap-6">
        {/* Pie Chart */}
        <div className="w-40 h-40 sm:w-48 sm:h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {slices.map((slice, i) => (
              <path
                key={i}
                d={slice.pathData}
                fill={slice.color}
                stroke="none"
              />
            ))}
          </svg>
        </div>

        {/* Stats */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-sm text-foreground font-semibold">{data.wins}</span>
              <span className="text-xs text-muted-foreground">Winning</span>
            </div>
            <span className="text-sm font-semibold text-green-600">{winPct.toFixed(0)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-sm text-foreground font-semibold">{data.losses}</span>
              <span className="text-xs text-muted-foreground">Losing</span>
            </div>
            <span className="text-sm font-semibold text-red-600">{lossPct.toFixed(0)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-sm text-foreground font-semibold">{data.breakEven}</span>
              <span className="text-xs text-muted-foreground">Break-even</span>
            </div>
            <span className="text-sm font-semibold text-gray-500">{breakEvenPct.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
