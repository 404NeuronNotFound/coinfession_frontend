import { EmotionTag } from "@/types/trade";

export const EMOTION_COLORS: Record<EmotionTag, string> = {
  "Disciplined": "#50AF95",
  "Patient":     "#4A8FE7",
  "FOMO":        "#F59E0B",
  "Greedy":      "#EC4899",
  "Panic Sold":  "#E05454",
};

interface EmotionBadgeProps {
  emotion: EmotionTag;
  size?: "sm" | "md" | "lg";
}

/**
 * EmotionBadge — displays an emotion tag with its associated color.
 *
 * Usage:
 *   <EmotionBadge emotion="Disciplined" />
 *   <EmotionBadge emotion="FOMO" size="md" />
 */
export default function EmotionBadge({ emotion, size = "sm" }: EmotionBadgeProps) {
  const color = EMOTION_COLORS[emotion];

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <span
      className={`inline-block rounded-full border font-semibold transition-colors ${sizeClasses[size]}`}
      style={{
        borderColor: color,
        color,
        backgroundColor: `${color}15`,
      }}
    >
      {emotion}
    </span>
  );
}
