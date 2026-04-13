import { ApiError, DRFFieldErrors } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Response parser ──────────────────────────────────────
/**
 * Parses a non-ok DRF response into a structured ApiError.
 * DRF can return:
 *   { "field": ["msg"] }          → field-level errors
 *   { "non_field_errors": ["msg"] } → form-level error
 *   { "detail": "msg" }           → single string error
 */
async function parseDRFError(res: Response): Promise<ApiError> {
  let body: Record<string, unknown> = {};

  try {
    body = await res.json();
  } catch {
    return { message: `Server error (${res.status})`, status: res.status };
  }

  // { "detail": "..." }
  if (typeof body.detail === "string") {
    return { message: body.detail, status: res.status };
  }

  // { "non_field_errors": ["..."] }
  if (Array.isArray(body.non_field_errors)) {
    return {
      message: (body.non_field_errors as string[])[0],
      status:  res.status,
    };
  }

  // { "username": ["A user with that username already exists."], ... }
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

// ─── Core fetcher ─────────────────────────────────────────
/**
 * Typed fetch wrapper.
 * - Attaches base URL + JSON headers automatically.
 * - On 2xx: returns parsed JSON as T.
 * - On error: throws ApiError.
 * - Pass `token` for authenticated endpoints.
 */
export async function apiFetch<T>(
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

  if (!res.ok) {
    throw await parseDRFError(res);
  }

  // 204 No Content — nothing to parse
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}