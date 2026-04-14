// ─────────────────────────────────────────────────────────
// api/client.ts
//
// Core fetch wrapper used by every API module.
// Handles:
//   · Base URL injection
//   · JSON headers
//   · Bearer token attachment
//   · DRF error parsing into ApiError
//   · Automatic silent token refresh on 401
//     (access token expired → use refresh token → retry once)
// ─────────────────────────────────────────────────────────

import { ApiError, DRFFieldErrors, RefreshResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── DRF error parser ──────────────────────────────────────
/**
 * Converts a non-ok DRF response body into a typed ApiError.
 *
 * DRF error shapes we handle:
 *   { "detail": "No active account..." }           → message
 *   { "non_field_errors": ["..."] }                → message
 *   { "username": ["already exists"], "email": … } → fieldErrors
 */
async function parseDRFError(res: Response): Promise<ApiError> {
  let body: Record<string, unknown> = {};

  try {
    body = await res.json();
  } catch {
    return { message: `Server error (${res.status})`, status: res.status };
  }

  // Single detail string
  if (typeof body.detail === "string") {
    return { message: body.detail, status: res.status };
  }

  // Non-field errors array
  if (Array.isArray(body.non_field_errors)) {
    return {
      message: (body.non_field_errors as string[])[0],
      status:  res.status,
    };
  }

  // Field-level errors
  const fieldErrors: DRFFieldErrors = {};
  let hasFieldErrors = false;
  for (const [key, val] of Object.entries(body)) {
    if (Array.isArray(val)) {
      fieldErrors[key] = val as string[];
      hasFieldErrors = true;
    }
  }
  if (hasFieldErrors) {
    return { fieldErrors, status: res.status };
  }

  return { message: `Request failed (${res.status})`, status: res.status };
}

// ── Raw fetch (no retry) ──────────────────────────────────
/**
 * Single fetch call — no automatic retry.
 * Used internally by apiFetch and by the refresh call itself
 * (we never want to retry a refresh with another refresh).
 */
async function rawFetch<T>(
  path:    string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) throw await parseDRFError(res);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Silent refresh helper ─────────────────────────────────
/**
 * Calls POST /api/token/refresh/ directly — no store import here
 * (avoids a circular dependency: client ← auth ← store ← client).
 * Returns the new access token string, or null if refresh fails.
 */
async function silentRefresh(refreshToken: string): Promise<string | null> {
  try {
    const data = await rawFetch<RefreshResponse>("/api/token/refresh/", {
      method: "POST",
      body:   JSON.stringify({ refresh: refreshToken }),
    });
    return data.access;
  } catch {
    return null;
  }
}

// ── Main fetcher ──────────────────────────────────────────
/**
 * apiFetch<T>(path, options)
 *
 * The single function every API module uses. Usage:
 *
 *   // Public endpoint (register, login)
 *   apiFetch<RegisterResponse>("/api/user/register/", {
 *     method: "POST",
 *     body: JSON.stringify(payload),
 *   });
 *
 *   // Authenticated endpoint
 *   apiFetch<Trade[]>("/api/trades/", { token: accessToken });
 *
 * Token refresh flow:
 *   1. Make request with current access token.
 *   2. If response is 401 AND we have a refresh token in localStorage:
 *      a. Call POST /api/token/refresh/ to get a new access token.
 *      b. Update the access token in the Zustand store.
 *      c. Retry the original request once with the new token.
 *   3. If refresh also fails → clear session → throw 401 error.
 *      The app's router/middleware handles redirecting to /login.
 *
 * We read the store state directly from localStorage here to avoid
 * circular imports (store imports api, api cannot import store).
 */
export async function apiFetch<T>(
  path:    string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  try {
    return await rawFetch<T>(path, options);
  } catch (err: unknown) {
    const apiErr = err as ApiError;

    // Only attempt refresh on 401 (Unauthorized) — not 403, 404, etc.
    if (apiErr.status !== 401) throw err;

    // Read refresh token from persisted Zustand store in localStorage.
    // We use localStorage directly here to avoid a circular dependency.
    let storedRefresh: string | null = null;
    try {
      const raw = localStorage.getItem("coinfession-auth");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { refreshToken?: string } };
        storedRefresh = parsed?.state?.refreshToken ?? null;
      }
    } catch {
      // localStorage unavailable (SSR) or malformed — skip refresh
    }

    if (!storedRefresh) throw err; // no refresh token → can't recover

    // Try to get a new access token
    const newAccess = await silentRefresh(storedRefresh);

    if (!newAccess) {
      // Refresh token also expired — clear session so the app
      // can redirect to /login. We dynamically import to avoid
      // the circular dep at module evaluation time.
      const { useAuthStore } = await import("@/stores/authStore");
      useAuthStore.getState().clearSession();
      throw err;
    }

    // Persist the new access token back into the store
    const { useAuthStore } = await import("@/stores/authStore");
    useAuthStore.getState().updateAccessToken(newAccess);

    // Retry the original request once with the fresh token
    return rawFetch<T>(path, { ...options, token: newAccess });
  }
}