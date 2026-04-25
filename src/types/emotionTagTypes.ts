// ─────────────────────────────────────────────────────────
// types/emotionTag.types.ts
//
// TypeScript interfaces for Emotion Tags feature
// ─────────────────────────────────────────────────────────

export interface EmotionTag {
  id: number;
  name: string;
  color: string;
  trade_count: number;
  win_rate: number;
  avg_pnl: number;
}

export interface SuggestedTag {
  name: string;
  color: string;
}

export interface CreateTagPayload {
  name: string;
  color: string;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string;
}

export interface TagApiError {
  name?: string[];
  color?: string[];
  detail?: string;
}
