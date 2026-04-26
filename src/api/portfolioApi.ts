// ─────────────────────────────────────────────────────────
// api/portfolioApi.ts
//
// HTTP service functions for Portfolio feature
// ─────────────────────────────────────────────────────────

import type { PortfolioResponse } from "@/types/portfolio.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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
 * GET /api/portfolio/
 * Fetch complete portfolio with live prices (full recalculation from trades)
 */
export async function fetchPortfolio(): Promise<PortfolioResponse> {
  const token = getAccessToken();
  
  if (!token) {
    window.location.href = "/login";
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/portfolio/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    throw error;
  }
}

/**
 * POST /api/portfolio/refresh/
 * Refresh portfolio prices only (faster, uses existing snapshots)
 */
export async function refreshPortfolioPrices(): Promise<PortfolioResponse> {
  const token = getAccessToken();
  
  if (!token) {
    window.location.href = "/login";
    throw new Error("No authentication token found");
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/portfolio/refresh/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    
    if (!response.ok) {
      throw new Error(`Failed to refresh portfolio: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to refresh portfolio:", error);
    throw error;
  }
}
