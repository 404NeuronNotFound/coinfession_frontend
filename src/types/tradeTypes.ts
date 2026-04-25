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
  is_open: boolean;
  created_at: string; // ISO 8601
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
  quantity: number;
  buy_price: number | null;
  sell_price: number | null;
  fee: number;
  trade_date: string; // ISO 8601
  notes: string;
  emotion_tag_ids: number[];
}

export type UpdateTradePayload = Partial<CreateTradePayload>;

export interface CoinSearchResult {
  id: number | null;
  coingecko_id: string;
  symbol: string;
  name: string;
}
