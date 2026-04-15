import { Tokens } from "@/lib/theme";

interface StatCardProps {
  label:   string;
  value:   string;
  sub:     string;
  color:   string;   // accent color for the value
  /** Remove right border on the last card in a row */
  last?:   boolean;
  tk:      Tokens;
}

/**
 * StatCard — a single labeled metric with a colored value and subtitle.
 *
 * Reusable on: Dashboard stat strip, Monthly report, Profile summary.
 *
 * Usage:
 *   <StatCard tk={tk} label="Win Rate" value="75%" sub="3 of 4 trades" color="#50AF95" />
 */
export default function StatCard({ label, value, sub, color, last = false, tk }: StatCardProps) {
  return (
    <div className={`py-8 px-6 ${!last ? tk.statBorder : ""}`}>
      <div className={`text-[11px] uppercase tracking-widest mb-2 ${tk.textFaint}`}>
        {label}
      </div>
      <div className="text-2xl font-black tracking-tight mb-1" style={{ color }}>
        {value}
      </div>
      <div className={`text-[11px] ${tk.textMuted}`}>{sub}</div>
    </div>
  );
}