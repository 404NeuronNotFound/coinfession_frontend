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
 * fetchDangerZoneStatus
 * GET /api/danger-zone/status/
 * Returns counts of all user data.
 */
export async function fetchDangerZoneStatus(token: string): Promise<DangerZoneStatus> {
  return apiFetch<DangerZoneStatus>("/api/danger-zone/status/", {
    method: "GET",
    token,
  });
}

/**
 * resetPortfolioSnapshots
 * DELETE /api/danger-zone/reset-snapshots/
 * Clears all portfolio snapshots (Tier 1 - recoverable).
 */
export async function resetPortfolioSnapshots(token: string): Promise<ResetSnapshotsResponse> {
  return apiFetch<ResetSnapshotsResponse>("/api/danger-zone/reset-snapshots/", {
    method: "DELETE",
    token,
  });
}

/**
 * clearReportCache
 * DELETE /api/danger-zone/clear-reports/
 * Clears all monthly report cache (Tier 1 - recoverable).
 */
export async function clearReportCache(token: string): Promise<ClearReportsResponse> {
  return apiFetch<ClearReportsResponse>("/api/danger-zone/clear-reports/", {
    method: "DELETE",
    token,
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
  try {
    return await apiFetch<DeleteAIFeedbackResponse>("/api/danger-zone/delete-ai-feedback/", {
      method: "DELETE",
      token,
      body: JSON.stringify({ confirmation }),
    });
  } catch (err: unknown) {
    // Re-throw with error details for store to handle
    throw err;
  }
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
  try {
    return await apiFetch<DeleteTradesResponse>("/api/danger-zone/delete-trades/", {
      method: "DELETE",
      token,
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
  try {
    return await apiFetch<DeleteAccountResponse>("/api/danger-zone/delete-account/", {
      method: "DELETE",
      token,
      body: JSON.stringify({ username }),
    });
  } catch (err: unknown) {
    // Re-throw with error details for store to handle
    throw err;
  }
}
