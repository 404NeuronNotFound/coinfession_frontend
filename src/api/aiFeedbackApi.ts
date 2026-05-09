import { apiFetch } from "./client";
import type {
  AIFeedbackPreview,
  AIFeedbackRecord,
  GeneratePayload,
} from "@/types/aiFeedback.types";

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

export async function fetchAIFeedbackPreview(
  year?: number,
  month?: number
): Promise<AIFeedbackPreview> {
  const params = new URLSearchParams();
  if (year !== undefined) params.append("year", year.toString());
  if (month !== undefined) params.append("month", month.toString());

  const queryString = params.toString();
  const path = `/api/ai-feedback/preview/${queryString ? `?${queryString}` : ""}`;

  return apiFetch<AIFeedbackPreview>(path, {
    method: "GET",
    token: getAccessToken(),
  });
}

export async function generateAIFeedback(
  payload?: GeneratePayload
): Promise<AIFeedbackRecord> {
  return apiFetch<AIFeedbackRecord>("/api/ai-feedback/generate/", {
    method: "POST",
    token: getAccessToken(),
    body: JSON.stringify(payload ?? {}),
  });
}

export async function fetchAIFeedbackList(): Promise<AIFeedbackRecord[]> {
  return apiFetch<AIFeedbackRecord[]>("/api/ai-feedback/", {
    method: "GET",
    token: getAccessToken(),
  });
}

export async function deleteAIFeedback(id: number): Promise<void> {
  return apiFetch<void>(`/api/ai-feedback/${id}/`, {
    method: "DELETE",
    token: getAccessToken(),
  });
}

// ─── ML Test Endpoints ────────────────────────────────────────────────────────

export interface MLStatus {
  ml_available: boolean;
  total_trades: number;
  closed_trades: number;
  min_trades_required: number;
  can_train_ml: boolean;
  message: string;
}

export async function fetchMLStatus(): Promise<MLStatus> {
  return apiFetch<MLStatus>("/api/ai-feedback/ml-status/", {
    method: "GET",
    token: getAccessToken(),
  });
}

export async function generateAIFeedbackMLTest(
  payload?: GeneratePayload
): Promise<AIFeedbackRecord> {
  return apiFetch<AIFeedbackRecord>("/api/ai-feedback/generate-ml-test/", {
    method: "POST",
    token: getAccessToken(),
    body: JSON.stringify(payload ?? {}),
  });
}

