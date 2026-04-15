// ─────────────────────────────────────────────────────────
// types/trade.ts
//
// All trade, holding, and dashboard data shapes.
// Used across: dashboard, trades API, stores, reports.
// ─────────────────────────────────────────────────────────

export type EmotionTag =
  | "Disciplined"
  | "Patient"
  | "FOMO"
  | "Greedy"
  | "Panic Sold";

export type TradeType = "BUY" | "SELL";

// ── Single trade ──────────────────────────────────────────
export interface Trade {
  id:           number;
  coin:         string;
  ticker:       string;
  type:         TradeType;
  buy_price:    number;
  sell_price?:  number;
  amount:       number;
  date:         string;       // ISO date string: "2025-03-12"
  emotion:      EmotionTag;
  pnl?:         number;       // realized P&L in USD (sell trades only)
  pnl_pct?:     number;       // P&L as percentage
  notes?:       string;
}

// ── Log trade payload ─────────────────────────────────────
export interface LogTradePayload {
  coin:        string;
  ticker:      string;
  type:        TradeType;
  buy_price:   number;
  sell_price?: number;
  amount:      number;
  date:        string;
  emotion:     EmotionTag;
  notes?:      string;
}

// ── Holding (open position) ───────────────────────────────
export interface Holding {
  coin:          string;
  ticker:        string;
  amount:        number;
  avg_buy_price: number;
  current_price: number;
  color:         string;      // display color for the coin icon
}

// ── Monthly P&L data point ────────────────────────────────
export interface MonthlyPnl {
  month: string;  // "Jan", "Feb", etc.
  pnl:   number;
}

// ── Emotion breakdown row ─────────────────────────────────
export interface EmotionStat {
  emotion: EmotionTag;
  count:   number;
  total_pnl: number;
}

// ── Dashboard summary (from API or computed) ──────────────
export interface DashboardStats {
  portfolio_value:  number;
  unrealized_pnl:   number;
  unrealized_pct:   number;
  realized_pnl:     number;
  win_rate:         number;
  total_trades:     number;
  winning_trades:   number;
  open_positions:   number;
}