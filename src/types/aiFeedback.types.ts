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

export interface AIFeedbackParsed {
  overall: string;
  scores: AIFeedbackScores;
  whats_working: AIFeedbackSection[];
  whats_hurting: AIFeedbackSection[];
  one_thing_to_fix: string;
  action_items?: AIFeedbackActionItem[];
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
