// ═══════════════════════════════════════════════════════════════
// P&L ANALYSIS TYPES
// ═══════════════════════════════════════════════════════════════

export interface PnlSummary {
  realized_pnl: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  total_trades: number;
  closed_trades: number;
  winning_trades: number;
  losing_trades: number;
  breakeven_trades: number;
}

export interface CumulativePnlPoint {
  date: string;
  realized_pnl: number;
  cumulative_pnl: number;
  trade_id: number;
  coin_symbol: string;
  trade_type: string;
}

export interface MonthlyPnl {
  label: string;
  year: number;
  month: number;
  realized_pnl: number;
  is_profit: boolean;
}

export interface CoinPnl {
  coin_id: number;
  symbol: string;
  name: string;
  realized_pnl: number;
  trade_count: number;
  is_profit: boolean;
}

export interface WinLossRatio {
  winning_count: number;
  losing_count: number;
  breakeven_count: number;
  winning_pct: number;
  losing_pct: number;
  breakeven_pct: number;
}

export interface FeeImpact {
  total_fees: number;
  gross_profits: number;
  fee_impact_pct: number;
}

export interface TopTrade {
  trade_id: number;
  trade_type: string;
  coin_symbol: string;
  coin_name: string;
  date: string;
  realized_pnl: number;
  quantity: number;
  buy_price: number;
  sell_price: number;
}

export interface PnlAnalysisResponse {
  summary: PnlSummary;
  cumulative_pnl: CumulativePnlPoint[];
  monthly_pnl: MonthlyPnl[];
  pnl_by_coin: CoinPnl[];
  win_loss_ratio: WinLossRatio;
  fee_impact: FeeImpact;
  top_wins: TopTrade[];
  top_losses: TopTrade[];
}

export interface PnlFilters {
  date_from?: string;
  date_to?: string;
  coin_id?: number;
}
