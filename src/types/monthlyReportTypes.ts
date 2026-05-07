// ═══════════════════════════════════════════════════════════════
// MONTHLY REPORT TYPES
// ═══════════════════════════════════════════════════════════════

export interface AvailableMonth {
  year: number;
  month: number;
  month_label: string;
  realized_pnl: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  is_profit: boolean;
  cumulative_pnl: number;
}

export interface MonthlyReportMetrics {
  year: number;
  month: number;
  month_label: string;
  realized_pnl: number;
  win_rate: number;
  total_trades: number;
  spot_trades: number;
  leverage_trades: number;
  closed_trades: number;
  winning_trades: number;
  losing_trades: number;
  total_fees: number;
  fees_pct_of_pnl: number;
  avg_pnl_per_trade: number;
  avg_hold_time_days: number;
  largest_win: number;
  largest_loss: number;
  profit_factor: number;
}

export interface TradeEmotion {
  id: number;
  name: string;
  color: string;
}

export interface MonthTrade {
  id: number;
  date: string;
  trade_type: string;
  coin_symbol: string;
  coin_name: string;
  quantity: number;
  buy_price: number | null;
  sell_price: number | null;
  fee: number;
  realized_pnl: number | null;
  is_open: boolean;
  emotions: TradeEmotion[];
  notes: string;
}

export interface BestWorstTrade {
  best_trade: MonthTrade | null;
  worst_trade: MonthTrade | null;
}

export interface MonthCoinPnl {
  coin_id: number;
  symbol: string;
  name: string;
  realized_pnl: number;
  trade_count: number;
  is_profit: boolean;
}

export interface MonthlyBar {
  year: number;
  month: number;
  month_label: string;
  realized_pnl: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  is_profit: boolean;
}

export interface CumulativePoint {
  year: number;
  month: number;
  month_label: string;
  monthly_pnl: number;
  cumulative_pnl: number;
}

export interface MonthlyReportDetail {
  metrics: MonthlyReportMetrics;
  trades: MonthTrade[];
  best_worst: BestWorstTrade;
  pnl_by_coin: MonthCoinPnl[];
  monthly_bars: MonthlyBar[];
  cumulative_pnl: CumulativePoint[];
  available_months: AvailableMonth[];
}

export interface MonthlyReportListResponse {
  available_months: AvailableMonth[];
  total_months: number;
}
