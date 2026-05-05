// ─────────────────────────────────────────────────────────
// types/trade.types.ts
//
// Backend API types for Trade Log functionality.
// Matches Django REST Framework response shapes.
// ─────────────────────────────────────────────────────────

export interface Coin {
  id: number;
  symbol: string;
  name: string;
  coingecko_id: string;
}

export interface EmotionTag {
  id: number;
  name: string;
  color: string;
}

export interface TradeEmotion {
  id: number;
  emotion_tag: EmotionTag;
}

export interface Trade {
  id: number;
  coin: Coin;
  trade_type: "buy" | "sell";
  quantity: number;
  buy_price: number | null;
  sell_price: number | null;
  fee: number;
  trade_date: string; // ISO 8601
  notes: string | null;
  emotions: TradeEmotion[];
  realized_pnl: number | null;
  roi: number | null;
  is_open: boolean;
  created_at: string; // ISO 8601
  // Long/Short fields
  position_type: 'spot' | 'long' | 'short';
  leverage: number;
  entry_price: number | null;
  exit_price: number | null;
  collateral: number | null;
  liquidation_price: number | null;
  funding_fees: number;
  close_date: string | null;
}

export interface OpenPosition {
  id: number;
  coin: Coin;
  position_type: 'long' | 'short';
  leverage: number;
  entry_price: number;
  current_price: number | null;
  collateral: number;
  quantity: number;
  unrealized_pnl: number | null;
  unrealized_roi: number | null;
  liquidation_price: number | null;
  distance_to_liquidation: number | null;
  funding_fees: number;
  trade_date: string;
  emotions: TradeEmotion[];
  notes: string;
  days_open: number;
}

export interface OpenPositionsResponse {
  open_positions: OpenPosition[];
  total_collateral: number;
  total_unrealized_pnl: number | null;
  prices_live: boolean;
}

export interface TradeFilters {
  coin?: string;
  type?: string; // "buy" | "sell"
  emotion?: string; // EmotionTag id as string
  pnl?: string; // "profit" | "loss"
  date_from?: string; // YYYY-MM-DD
  date_to?: string; // YYYY-MM-DD
  search?: string;
  sort?: string; // "date" | "-date" | "coin" | "-coin" | "qty" | "-qty" | "fee" | "-fee"
  page?: number;
  page_size?: number;
}

export interface TradeSummary {
  total_trades: number;
  closed_trades: number;
  open_trades: number;
  winning_trades: number;
  win_rate: number;
  total_realized_pnl: number;
  total_fees: number;
  avg_hold_time_days: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateTradePayload {
  coin_id: number;
  trade_type: "buy" | "sell";
  quantity?: number;
  buy_price?: number | null;
  sell_price?: number | null;
  fee: number;
  trade_date: string; // ISO 8601
  notes: string;
  emotion_tag_ids: number[];
  // Long/Short fields
  position_type?: 'spot' | 'long' | 'short';
  leverage?: number;
  entry_price?: number | null;
  exit_price?: number | null;
  collateral?: number | null;
  funding_fees?: number;
  is_open?: boolean;
  close_date?: string | null;
}

export type UpdateTradePayload = Partial<CreateTradePayload>;

export interface CoinSearchResult {
  id: number | null;
  coingecko_id: string;
  symbol: string;
  name: string;
}
