// ─────────────────────────────────────────────────────────
// api/dangerZoneApi.ts
//
// Danger Zone API service functions.
// Each function handles one endpoint with proper error handling.
// ─────────────────────────────────────────────────────────

import { apiFetch } from "./client";
import {
  DangerZoneStatus,
  ResetSnapshotsResponse,
  ClearReportsResponse,
  DeleteAIFeedbackResponse,
  DeleteTradesResponse,
  DeleteAccountResponse,
  DangerZoneError,
} from "@/types/dangerZone.types";

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
 * fetchDangerZoneStatus
 * GET /api/danger-zone/status/
 * Returns counts of all user data.
 */
export async function fetchDangerZoneStatus(token: string): Promise<DangerZoneStatus> {
  // Use provided token or fall back to localStorage
  const authToken = token || getAccessToken();
  return apiFetch<DangerZoneStatus>("/api/danger-zone/status/", {
    method: "GET",
    token: authToken,
  });
}

/**
 * resetPortfolioSnapshots
 * DELETE /api/danger-zone/reset-snapshots/
 * Clears all portfolio snapshots (Tier 1 - recoverable).
 */
export async function resetPortfolioSnapshots(token: string): Promise<ResetSnapshotsResponse> {
  const authToken = token || getAccessToken();
  return apiFetch<ResetSnapshotsResponse>("/api/danger-zone/reset-snapshots/", {
    method: "DELETE",
    token: authToken,
  });
}

/**
 * clearReportCache
 * DELETE /api/danger-zone/clear-reports/
 * Clears all monthly report cache (Tier 1 - recoverable).
 */
export async function clearReportCache(token: string): Promise<ClearReportsResponse> {
  const authToken = token || getAccessToken();
  return apiFetch<ClearReportsResponse>("/api/danger-zone/clear-reports/", {
    method: "DELETE",
    token: authToken,
  });
}

/**
 * deleteAIFeedbackAll
 * DELETE /api/danger-zone/delete-ai-feedback/
 * Deletes all AI feedback (Tier 2 - permanent, requires confirmation).
 * Throws error if confirmation is incorrect.
 */
export async function deleteAIFeedbackAll(
  token: string,
  confirmation: string
): Promise<DeleteAIFeedbackResponse> {
  const authToken = token || getAccessToken();
  try {
    return await apiFetch<DeleteAIFeedbackResponse>("/api/danger-zone/delete-ai-feedback/", {
      method: "DELETE",
      token: authToken,
      body: JSON.stringify({ confirmation }),
    });
  } catch (err: unknown) {
    // Re-throw with error details for store to handle
    throw err;
  }
}

/**
 * fetchAIFeedbackList
 * GET /api/ai-feedback/
 * Fetches all AI feedback for the current user.
 */
export async function fetchAIFeedbackList(token: string): Promise<any[]> {
  const authToken = token || getAccessToken();
  return apiFetch<any[]>("/api/ai-feedback/", {
    method: "GET",
    token: authToken,
  });
}

/**
 * deleteAIFeedbackItem
 * DELETE /api/ai-feedback/{id}/
 * Deletes a specific AI feedback item.
 */
export async function deleteAIFeedbackItem(token: string, id: number): Promise<void> {
  const authToken = token || getAccessToken();
  return apiFetch<void>(`/api/ai-feedback/${id}/`, {
    method: "DELETE",
    token: authToken,
  });
}

/**
 * deleteAllTrades
 * DELETE /api/danger-zone/delete-trades/
 * Deletes all trades and snapshots (Tier 2 - permanent, requires confirmation).
 * Throws error if confirmation is incorrect.
 */
export async function deleteAllTrades(
  token: string,
  confirmation: string
): Promise<DeleteTradesResponse> {
  const authToken = token || getAccessToken();
  try {
    return await apiFetch<DeleteTradesResponse>("/api/danger-zone/delete-trades/", {
      method: "DELETE",
      token: authToken,
      body: JSON.stringify({ confirmation }),
    });
  } catch (err: unknown) {
    // Re-throw with error details for store to handle
    throw err;
  }
}

/**
 * deleteAccount
 * DELETE /api/danger-zone/delete-account/
 * Permanently deletes the user account (Tier 3 - irreversible).
 * Requires username to match current user.
 * Throws error if username doesn't match.
 */
export async function deleteAccount(
  token: string,
  username: string
): Promise<DeleteAccountResponse> {
  const authToken = token || getAccessToken();
  try {
    return await apiFetch<DeleteAccountResponse>("/api/danger-zone/delete-account/", {
      method: "DELETE",
      token: authToken,
      body: JSON.stringify({ username }),
    });
  } catch (err: unknown) {
    // Re-throw with error details for store to handle
    throw err;
  }
}
