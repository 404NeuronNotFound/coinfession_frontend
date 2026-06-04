// ─────────────────────────────────────────────────────────
// api/dashboardApi.ts
//
// Dashboard API service using HttpOnly Cookie authentication.
// Single endpoint that returns all dashboard data.
// ─────────────────────────────────────────────────────────

import { apiFetch } from "./client";
import { DashboardResponse } from "@/types/dashboard.types";

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
 * fetchDashboard
 * 
 * GET /api/dashboard/
 * Returns all dashboard data in a single request.
 * 
 * Requires authentication with access token.
 */
export async function fetchDashboard(token: string): Promise<DashboardResponse> {
  // Use provided token or fall back to localStorage
  const authToken = token || getAccessToken();
  return apiFetch<DashboardResponse>("/api/dashboard/", { token: authToken });
}
