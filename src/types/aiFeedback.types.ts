export interface AIFeedbackScores {
  discipline: number;
  risk_mgmt: number;
  consistency: number;
}

export interface AIFeedbackSection {
  title: string;
  body: string;
}

export interface AIFeedbackActionItem {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PerTradeAnalysis {
  trade_id: number;
  coin: string;
  position_type: string;
  trade_type: string;
  entry_price: number;
  exit_price: number;
  quantity: number;
  pnl: number;
  pnl_percent: number;
  emotions: string[];
  trade_date: string;
  feedback: string;
  recommendation: string;
}

export interface CoinRecommendation {
  coin: string;
  total_pnl: number;
  trades: number;
  win_rate: number;
  avg_pnl_per_trade: number;
  recommendation: string;
  confidence: string;
}

export interface PositionTypeAnalysis {
  total_trades: number;
  total_pnl: number;
  win_rate: number;
  avg_pnl: number;
  recommendation: string;
}

export interface MarketInsights {
  coin_recommendations: CoinRecommendation[];
  position_type_analysis: Record<string, PositionTypeAnalysis>;
  market_trend_summary: string;
}

export interface AIFeedbackParsed {
  overall: string;
  scores: AIFeedbackScores;
  whats_working: AIFeedbackSection[];
  whats_hurting: AIFeedbackSection[];
  one_thing_to_fix: string;
  action_items?: AIFeedbackActionItem[];
  per_trade_analysis?: PerTradeAnalysis[];
  market_insights?: MarketInsights;
}

export interface AIFeedbackRecord {
  id: number;
  prompt_summary: string;
  feedback_parsed: AIFeedbackParsed | null;
  created_at: string;
  month_label: string;
}

export interface AIFeedbackPreview {
  total_trades: number;
  closed_trades: number;
  winning_trades: number;
  win_rate: number;
  realized_pnl: number;
  emotions_tagged: number;
  has_enough_data: boolean;
}

export interface GeneratePayload {
  year?: number;
  month?: number;
}
