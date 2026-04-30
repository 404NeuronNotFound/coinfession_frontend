// ─────────────────────────────────────────────────────────
// api/dashboardApi.ts
//
// Dashboard API service.
// Single endpoint that returns all dashboard data.
// ─────────────────────────────────────────────────────────

import { apiFetch } from "./client";
import { DashboardResponse } from "@/types/dashboard.types";

/**
 * fetchDashboard
 * 
 * GET /api/dashboard/
 * Returns all dashboard data in a single request.
 * 
 * Requires authentication — pass the access token.
 * On 401, apiFetch will attempt silent refresh and retry.
 * If refresh fails, the auth store clears the session
 * and the app redirects to /login.
 */
export async function fetchDashboard(token: string): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>("/api/dashboard/", {
    method: "GET",
    token,
  });
}
