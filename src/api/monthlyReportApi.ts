// ═══════════════════════════════════════════════════════════════
// MONTHLY REPORT API
// ═══════════════════════════════════════════════════════════════

import type { MonthlyReportListResponse, MonthlyReportDetail } from "@/types/monthlyReportTypes";
import { apiFetch } from "@/api/client";

/**
 * Get access token from persisted Zustand store in localStorage
 */
function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("coinfession-auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
      return parsed?.state?.accessToken ?? null;
    }
  } catch {
    // localStorage unavailable (SSR) or malformed
  }
  return null;
}

/**
 * Fetch list of all months with trade data
 * GET /api/monthly-reports/
 */
export async function fetchMonthlyReportList(): Promise<MonthlyReportListResponse> {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("No access token found");
  }
  
  try {
    const data = await apiFetch<MonthlyReportListResponse>("/api/monthly-reports/", {
      method: "GET",
      token: accessToken,
    });
    
    return data;
    
  } catch (error) {
    // apiFetch handles 401 and token refresh automatically
    // If we get here, it's a real error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch monthly report list");
  }
}

/**
 * Fetch detailed report for a specific month
 * GET /api/monthly-reports/<year>/<month>/
 */
export async function fetchMonthlyReportDetail(
  year: number,
  month: number
): Promise<MonthlyReportDetail> {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("No access token found");
  }
  
  try {
    const data = await apiFetch<MonthlyReportDetail>(`/api/monthly-reports/${year}/${month}/`, {
      method: "GET",
      token: accessToken,
    });
    
    return data;
    
  } catch (error) {
    // apiFetch handles 401 and token refresh automatically
    // Check for specific error messages from the backend
    if (error instanceof Error) {
      // The error message from apiFetch will contain the backend error
      throw error;
    }
    throw new Error("Failed to fetch monthly report detail");
  }
}
