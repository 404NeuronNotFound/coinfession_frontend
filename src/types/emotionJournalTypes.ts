export interface EmotionStat {
  id: number;
  name: string;
  color: string;
  trade_count: number;
  closed_count: number;
  win_rate: number;
  avg_pnl: number;
  total_pnl: number;
}

export interface EmotionTrade {
  id: number;
  date: string;
  trade_date: string;
  trade_type: string;
  coin_symbol: string;
  coin_name: string;
  emotion_name: string;
  emotion_color: string;
  emotion_id: number | null;
  realized_pnl: number | null;
  is_open: boolean;
  notes: string;
}

export interface PatternInsight {
  type: "good" | "bad" | "warn";
  title: string;
  body: string;
}

export interface HeatmapDay {
  date: string;
  trade_count: number;
  intensity: number;
}

export interface EmotionJournalResponse {
  emotion_stats: EmotionStat[];
  trades: EmotionTrade[];
  insights: PatternInsight[];
  heatmap: HeatmapDay[];
  available_years: number[];
  selected_year: number;
}

export interface EmotionJournalFilters {
  emotion_id?: number | null;
  weeks?: number;
  year?: number;
}
