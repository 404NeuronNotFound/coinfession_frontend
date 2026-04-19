'use client';

interface Holding {
  coin: string;
  ticker: string;
  color: string;
  percentage: number;
}

interface AllocationChartProps {
  holdings: Holding[];
}

export default function AllocationChart({ holdings }: AllocationChartProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  let currentAngle = -90; // Start from top

  const getCoordinates = (angle: number, r: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 50 + r * Math.cos(rad),
      y: 50 + r * Math.sin(rad),
    };
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-border bg-card">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-6">
        Allocation
      </h3>

      <div className="flex flex-col items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {holdings.map((holding, i) => {
              const sliceAngle = (holding.percentage / 100) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;

              const startCoords = getCoordinates(startAngle, radius);
              const endCoords = getCoordinates(endAngle, radius);

              const largeArc = sliceAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${startCoords.x} ${startCoords.y}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${endCoords.x} ${endCoords.y}`,
                `L ${50 + (radius - 15) * Math.cos((endAngle * Math.PI) / 180)} ${50 + (radius - 15) * Math.sin((endAngle * Math.PI) / 180)}`,
                `A ${radius - 15} ${radius - 15} 0 ${largeArc} 0 ${50 + (radius - 15) * Math.cos((startAngle * Math.PI) / 180)} ${50 + (radius - 15) * Math.sin((startAngle * Math.PI) / 180)}`,
                'Z',
              ].join(' ');

              currentAngle = endAngle;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={holding.color}
                  stroke="none"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2">
          {holdings.map((holding, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: holding.color }}
              />
              <span className="text-xs sm:text-sm text-foreground">{holding.ticker}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
