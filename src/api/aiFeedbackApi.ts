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
  try {
    return await apiFetch<AIFeedbackRecord>("/api/ai-feedback/generate/", {
      method: "POST",
      token: getAccessToken(),
      body: JSON.stringify(payload ?? {}),
    });
  } catch (error: any) {
    // Handle 503/502 errors for missing API key
    if (error?.status === 503 || error?.status === 502) {
      throw new Error(error?.message || "Service unavailable");
    }
    throw error;
  }
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
