// ─── User ─────────────────────────────────────────────────
/** Minimal user shape returned from the API after register/login */
export interface User {
  id:         number;
  username:   string;
  first_name: string;
  last_name:  string;
  email:      string;
}

// ─── Register ─────────────────────────────────────────────
/** Body sent to POST /api/user/register/ */
export interface RegisterPayload {
  username:         string;
  first_name:       string;
  last_name:        string;
  email:            string;
  password:         string;
  confirm_password: string;
}

/** Shape the register endpoint returns on success */
export interface RegisterResponse {
  id:         number;
  username:   string;
  first_name: string;
  last_name:  string;
  email:      string;
}

// ─── Login ────────────────────────────────────────────────
/** Body sent to POST /api/token/ (JWT obtain pair) */
export interface LoginPayload {
  username: string;
  password: string;
}

/** JWT token pair returned by /api/token/ */
export interface TokenPair {
  access:  string;
  refresh: string;
}

/** Response from POST /api/token/refresh/ */
export interface RefreshResponse {
  access: string;
}

// ─── API error ────────────────────────────────────────────
/**
 * Django REST Framework returns field errors as:
 *   { "username": ["A user with that username already exists."] }
 * and non-field errors as:
 *   { "non_field_errors": ["..."] }
 * or a plain detail string:
 *   { "detail": "No active account found with the given credentials." }
 */
export interface DRFFieldErrors {
  [field: string]: string[];
}

export interface ApiError {
  /** Field-level validation errors from DRF */
  fieldErrors?:  DRFFieldErrors;
  /** Single human-readable message (detail or non_field_errors[0]) */
  message?:      string;
  /** Raw HTTP status code */
  status?:       number;
}

// ─── Change password ──────────────────────────────────────
/** Body sent to POST /api/user/change-password/ */
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/** Response from POST /api/user/change-password/ */
export interface ChangePasswordResponse {
  message: string;
  status: string;
}

// ─── Sessions ─────────────────────────────────────────────
/** Session object returned from GET /api/user/sessions/ */
export interface UserSession {
  id: number;
  device_id: string;
  browser: string;
  os: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_active: string;
  is_current: boolean;
}

// ─── Tokens ───────────────────────────────────────────────
/** Refresh token object returned from GET /api/user/tokens/ */
export interface RefreshTokenInfo {
  id: number;
  token_suffix: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
  last_used: string | null;
}