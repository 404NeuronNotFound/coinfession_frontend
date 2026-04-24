// ─────────────────────────────────────────────────────────
// api/tradeApi.ts
//
// Trade Log API functions.
// All endpoints require JWT authentication.
// ─────────────────────────────────────────────────────────

import { apiFetch } from "./client";
import type {
  Trade,
  TradeFilters,
  TradeSummary,
  PaginatedResponse,
  CreateTradePayload,
  UpdateTradePayload,
  CoinSearchResult,
  EmotionTag,
} from "@/types/trade.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * Build query string from filters object, skipping null/empty values
 */
function buildQueryString(params: Record<string, unknown>): string {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== null && value !== undefined && value !== ""
  );
  if (filtered.length === 0) return "";
  const query = new URLSearchParams(
    filtered.map(([key, value]) => [key, String(value)])
  ).toString();
  return `?${query}`;
}

/**
 * Get access token from localStorage
 */
function getAccessToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access_token") || "";
}

/**
 * GET /api/trades/
 * Fetch paginated trades with optional filters
 */
export async function fetchTrades(
  filters: TradeFilters
): Promise<PaginatedResponse<Trade>> {
  const query = buildQueryString(filters as Record<string, unknown>);
  const token = getAccessToken();
  
  return apiFetch<PaginatedResponse<Trade>>(`/api/trades/${query}`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/trades/summary/
 * Fetch trade statistics with optional filters
 */
export async function fetchTradeSummary(
  filters: Partial<TradeFilters>
): Promise<TradeSummary> {
  const summaryFilters = {
    coin: filters.coin,
    type: filters.type,
    emotion: filters.emotion,
    date_from: filters.date_from,
    date_to: filters.date_to,
  };
  const query = buildQueryString(summaryFilters as Record<string, unknown>);
  const token = getAccessToken();
  
  return apiFetch<TradeSummary>(`/api/trades/summary/${query}`, {
    method: "GET",
    token,
  });
}

/**
 * POST /api/trades/
 * Create a new trade
 */
export async function createTrade(
  payload: CreateTradePayload
): Promise<Trade> {
  const token = getAccessToken();
  
  return apiFetch<Trade>("/api/trades/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

/**
 * PATCH /api/trades/<id>/
 * Update an existing trade
 */
export async function updateTrade(
  id: number,
  payload: UpdateTradePayload
): Promise<Trade> {
  const token = getAccessToken();
  
  return apiFetch<Trade>(`/api/trades/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

/**
 * DELETE /api/trades/<id>/
 * Delete a trade
 */
export async function deleteTrade(id: number): Promise<void> {
  const token = getAccessToken();
  
  return apiFetch<void>(`/api/trades/${id}/`, {
    method: "DELETE",
    token,
  });
}

/**
 * GET /api/coins/search/?q=<query>
 * Search for coins by symbol or name
 */
export async function searchCoins(
  query: string
): Promise<CoinSearchResult[]> {
  const token = getAccessToken();
  
  return apiFetch<CoinSearchResult[]>(`/api/coins/search/?q=${encodeURIComponent(query)}`, {
    method: "GET",
    token,
  });
}

/**
 * GET /api/emotion-tags/
 * Fetch all emotion tags
 */
export async function fetchEmotionTags(): Promise<EmotionTag[]> {
  const token = getAccessToken();
  
  return apiFetch<EmotionTag[]>("/api/emotion-tags/", {
    method: "GET",
    token,
  });
}

/**
 * POST /api/coins/ (if endpoint exists)
 * Create a new coin in the database
 * Note: This endpoint may need to be added to the backend
 */
export async function createCoin(
  coingecko_id: string,
  symbol: string,
  name: string
): Promise<{ id: number; symbol: string; name: string; coingecko_id: string }> {
  const token = getAccessToken();
  
  return apiFetch<{ id: number; symbol: string; name: string; coingecko_id: string }>(
    "/api/coins/",
    {
      method: "POST",
      token,
      body: JSON.stringify({ coingecko_id, symbol, name }),
    }
  );
}

/**
 * GET /api/trades/export/csv/
 * Trigger CSV download
 * 
 * Note: Browser file downloads cannot set Authorization headers,
 * so we append the token as a query parameter.
 * Backend must support ?token=<access_token> for this endpoint.
 */
export function exportTradesCsv(): void {
  const token = getAccessToken();
  const url = `${BASE_URL}/api/trades/export/csv/?token=${encodeURIComponent(token)}`;
  
  // Trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "trades.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
