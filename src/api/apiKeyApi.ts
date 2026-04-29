import { apiFetch } from "./client";
import type {
  APIKeyRecord,
  APIKeySaveResponse,
  APIKeyWritePayload,
  APIKeyPingResult,
} from "@/types/apiKey.types";

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

export async function fetchAPIKeys(): Promise<APIKeyRecord[]> {
  return apiFetch<APIKeyRecord[]>("/api/api-keys/", {
    method: "GET",
    token: getAccessToken(),
  });
}

export async function saveAPIKey(
  payload: APIKeyWritePayload
): Promise<APIKeySaveResponse> {
  return apiFetch<APIKeySaveResponse>("/api/api-keys/", {
    method: "POST",
    token: getAccessToken(),
    body: JSON.stringify(payload),
  });
}

export async function deleteAPIKey(provider: string): Promise<void> {
  return apiFetch<void>(`/api/api-keys/${provider}/`, {
    method: "DELETE",
    token: getAccessToken(),
  });
}

export async function pingAPIKey(provider: string): Promise<APIKeyPingResult> {
  return apiFetch<APIKeyPingResult>("/api/api-keys/ping/", {
    method: "POST",
    token: getAccessToken(),
    body: JSON.stringify({ provider }),
  });
}
