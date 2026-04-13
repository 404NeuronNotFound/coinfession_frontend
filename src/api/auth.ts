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