// ─────────────────────────────────────────────────────────
// types/portfolio.types.ts
//
// TypeScript interfaces for Portfolio feature
// ─────────────────────────────────────────────────────────

export interface PortfolioSummary {
  total_value: number;
  total_cost: number;
  total_unrealized_pnl: number;
  total_unrealized_pct: number;
  active_positions: number;
  last_updated: string;
}

export interface CoinHolding {
  coin_id: number;
  symbol: string;
  name: string;
  coingecko_id: string;
  total_quantity: number;
  avg_buy_price: number;
  cost_basis: number;
  live_price: number;
  change_24h: number;
  current_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  allocation_pct: number;
}

export interface PortfolioResponse {
  summary: PortfolioSummary;
  holdings: CoinHolding[];
  prices_live: boolean;
  warning: string | null;
}
