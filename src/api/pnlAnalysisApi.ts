// ═══════════════════════════════════════════════════════════════
// P&L ANALYSIS API
// ═══════════════════════════════════════════════════════════════

import type { PnlAnalysisResponse, PnlFilters } from "@/types/pnlAnalysisTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch P&L analysis data with optional filters
 */
export async function fetchPnlAnalysis(filters?: PnlFilters): Promise<PnlAnalysisResponse> {
  // Build query string from filters, skipping null/undefined/empty values
  const params = new URLSearchParams();
  
  if (filters?.date_from) {
    params.append("date_from", filters.date_from);
  }
  
  if (filters?.date_to) {
    params.append("date_to", filters.date_to);
  }
  
  if (filters?.coin_id !== undefined && filters.coin_id !== null) {
    params.append("coin_id", filters.coin_id.toString());
  }
  
  const queryString = params.toString();
  const url = `${BASE_URL}/api/pnl-analysis/${queryString ? `?${queryString}` : ""}`;
  
  // Get access token from persisted Zustand store in localStorage
  let accessToken: string | null = null;
  try {
    const raw = localStorage.getItem("coinfession-auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
      accessToken = parsed?.state?.accessToken ?? null;
    }
  } catch {
    // localStorage unavailable (SSR) or malformed
  }
  
  if (!accessToken) {
    // Redirect to login if no token
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("No access token found");
  }
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized - redirecting to login");
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        errorData.detail || 
        `Failed to fetch P&L analysis: ${response.status} ${response.statusText}`
      );
    }
    
    const data: PnlAnalysisResponse = await response.json();
    return data;
    
  } catch (error) {
    // Network errors or other failures
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch P&L analysis data");
  }
}
