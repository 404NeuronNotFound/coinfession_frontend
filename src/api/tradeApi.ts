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
} from "@/types/tradeTypes";

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
 * Get access token from localStorage (Zustand persisted store)
 */
function getAccessToken(): string {
  if (typeof window === "undefined") return "";
  
  try {
    const stored = localStorage.getItem("coinfession-auth");
    if (!stored) return "";
    
    const parsed = JSON.parse(stored);
    return parsed?.state?.accessToken || "";
  } catch {
    return "";
  }
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
 * Download trades as CSV file
 * 
 * Note: We can't use apiFetch here because it expects JSON responses,
 * but CSV export returns text/csv. We need to use raw fetch with proper auth.
 */
export async function exportTradesCsv(): Promise<void> {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/trades/export/csv/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      // Try to parse error message
      let errorMessage = `Export failed: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // Response is not JSON, use status text
        errorMessage = `Export failed: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Get the CSV blob
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export trades:", error);
    throw error;
  }
}

/**
 * GET /api/trades/open-positions/
 * Fetch all open long/short positions with unrealized P&L
 */
export async function fetchOpenPositions(): Promise<any> {
  const token = getAccessToken();
  
  return apiFetch<any>("/api/trades/open-positions/", {
    method: "GET",
    token,
  });
}
