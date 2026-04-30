// ─────────────────────────────────────────────────────────
// types/dashboard.types.ts
//
// TypeScript interfaces for the Dashboard API response.
// Matches the backend DashboardResponse serializer.
// ─────────────────────────────────────────────────────────

export interface DashboardMetrics {
  portfolio_value: number;
  realized_pnl: number;
  unrealized_pnl: number;
  unrealized_pct: number;
  win_rate: number;
  winning_trades: number;
  closed_trades: number;
  winning_label: string;
  unrealized_label: string;
  realized_label: string;
}

export interface DashboardHolding {
  coin_id: number;
  symbol: string;
  name: string;
  coingecko_id: string;
  total_quantity: number;
  avg_buy_price: number;
  live_price: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
}

export interface DashboardEmotion {
  id: number;
  name: string;
  color: string;
  trade_count: number;
  percentage: number;
}

export interface DashboardRecentTrade {
  id: number;
  trade_type: string;
  coin_symbol: string;
  coin_name: string;
  quantity: number;
  price: number;
  trade_date: string;
  emotion_name: string | null;
  emotion_color: string | null;
}

export interface DashboardAISnippet {
  id: number;
  overall: string;
  month_label: string;
  created_at: string;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  holdings: DashboardHolding[];
  emotions: DashboardEmotion[];
  recent_trades: DashboardRecentTrade[];
  ai_snippet: DashboardAISnippet | null;
  prices_live: boolean;
  warning: string | null;
  last_updated: string;
}
