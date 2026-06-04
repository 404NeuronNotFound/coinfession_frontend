// ─────────────────────────────────────────────────────────
// api/client.ts
//
// Core fetch wrapper with secure JWT token management.
// Handles:
//   · Base URL injection
//   · JSON headers
//   · Bearer token attachment
//   · DRF error parsing into ApiError
//   · Automatic silent token refresh on 401
//   · No sensitive data logging
// ─────────────────────────────────────────────────────────

import { ApiError, DRFFieldErrors, RefreshResponse } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── DRF error parser ──────────────────────────────────────
async function parseDRFError(res: Response): Promise<ApiError> {
  let body: Record<string, unknown> = {};

  try {
    body = await res.json();
  } catch {
    return { message: `Server error (${res.status})`, status: res.status };
  }

  if (typeof body.detail === "string") {
    return { message: body.detail, status: res.status };
  }

  if (Array.isArray(body.non_field_errors)) {
    return {
      message: (body.non_field_errors as string[])[0],
      status:  res.status,
    };
  }

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
async function rawFetch<T>(
  path:    string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
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
export async function apiFetch<T>(
  path:    string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  try {
    return await rawFetch<T>(path, options);
  } catch (err: unknown) {
    const apiErr = err as ApiError;

    if (apiErr.status !== 401) throw err;

    let storedRefresh: string | null = null;
    try {
      const raw = localStorage.getItem("coinfession-auth");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { refreshToken?: string } };
        storedRefresh = parsed?.state?.refreshToken ?? null;
      }
    } catch {
      // localStorage unavailable or malformed
    }

    if (!storedRefresh) throw err;

    const newAccess = await silentRefresh(storedRefresh);

    if (!newAccess) {
      const { useAuthStore } = await import("@/stores/authStore");
      useAuthStore.getState().clearSession();
      throw err;
    }

    const { useAuthStore } = await import("@/stores/authStore");
    useAuthStore.getState().updateAccessToken(newAccess);

    return rawFetch<T>(path, { ...options, token: newAccess });
  }
}