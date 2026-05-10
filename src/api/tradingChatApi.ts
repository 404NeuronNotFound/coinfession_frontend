import { apiFetch } from "./client";

/**
 * Get access token from localStorage
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

export interface OllamaStatus {
  running: boolean;
  available_models: string[];
  recommended_model: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  model: string;
  status: "ok" | "error";
  updated_history: ChatMessage[];
}

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  return apiFetch<OllamaStatus>("/api/trading-chat/status/", {
    method: "GET",
    token: getAccessToken(),
  });
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  return apiFetch<ChatResponse>("/api/trading-chat/", {
    method: "POST",
    token: getAccessToken(),
    body: JSON.stringify({ message, history }),
  });
}
