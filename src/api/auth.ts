import { apiFetch } from "@/api/client";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  TokenPair,
  User,
} from "@/types/auth";

// ─── Register ─────────────────────────────────────────────
/**
 * POST /api/user/register/
 * Creates a new user account.
 * Throws ApiError on failure (field errors surface as fieldErrors).
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/user/register/", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

// ─── Login ────────────────────────────────────────────────
/**
 * POST /api/token/
 * Returns a JWT access + refresh token pair.
 */
export async function login(payload: LoginPayload): Promise<TokenPair> {
  return apiFetch<TokenPair>("/api/token/", {
    method: "POST",
    body:   JSON.stringify(payload),
  });
}

// ─── Refresh ──────────────────────────────────────────────
/**
 * POST /api/token/refresh/
 * Exchanges a refresh token for a new access token.
 */
export async function refreshToken(refresh: string): Promise<Pick<TokenPair, "access">> {
  return apiFetch<Pick<TokenPair, "access">>("/api/token/refresh/", {
    method: "POST",
    body:   JSON.stringify({ refresh }),
  });
}

// ─── Get current user ─────────────────────────────────────
/**
 * GET /api/user/me/
 * Returns the authenticated user's profile.
 * Requires a valid access token.
 */
export async function getMe(token: string): Promise<User> {
  return apiFetch<User>("/api/user/me/", { token });
}

// ─── Change password ──────────────────────────────────────
/**
 * POST /api/user/change-password/
 * Changes the authenticated user's password.
 * Requires a valid access token.
 */
export async function changePassword(payload: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ message: string; status: string }> {
  return apiFetch<{ message: string; status: string }>("/api/user/change-password/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Sessions ─────────────────────────────────────────────
/**
 * GET /api/user/sessions/
 * Get all active sessions for the authenticated user.
 */
export async function getActiveSessions(): Promise<any[]> {
  return apiFetch<any[]>("/api/user/sessions/", {
    method: "GET",
  });
}

/**
 * POST /api/user/sessions/{session_id}/revoke/
 * Revoke a specific session.
 */
export async function revokeSession(sessionId: number): Promise<{ message: string; status: string }> {
  return apiFetch<{ message: string; status: string }>(`/api/user/sessions/${sessionId}/revoke/`, {
    method: "POST",
  });
}

/**
 * POST /api/user/sessions/revoke-all/
 * Revoke all sessions except the current one.
 */
export async function revokeAllSessions(currentDeviceId?: string): Promise<{ message: string; status: string; revoked_count: number }> {
  return apiFetch<{ message: string; status: string; revoked_count: number }>("/api/user/sessions/revoke-all/", {
    method: "POST",
    body: JSON.stringify({ current_device_id: currentDeviceId }),
  });
}

// ─── Tokens ───────────────────────────────────────────────
/**
 * GET /api/user/tokens/
 * Get all active refresh tokens for the authenticated user.
 */
export async function getRefreshTokens(): Promise<any[]> {
  return apiFetch<any[]>("/api/user/tokens/", {
    method: "GET",
  });
}

/**
 * POST /api/user/tokens/{token_id}/revoke/
 * Revoke a specific refresh token.
 */
export async function revokeRefreshToken(tokenId: number): Promise<{ message: string; status: string }> {
  return apiFetch<{ message: string; status: string }>(`/api/user/tokens/${tokenId}/revoke/`, {
    method: "POST",
  });
}