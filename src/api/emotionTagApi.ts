// ─────────────────────────────────────────────────────────
// api/emotionTagApi.ts
//
// HTTP service functions for Emotion Tags CRUD
// ─────────────────────────────────────────────────────────

import { apiFetch } from "./client";
import {
  EmotionTag,
  SuggestedTag,
  CreateTagPayload,
  UpdateTagPayload,
} from "@/types/emotionTag.types";

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

/**
 * GET /api/emotion-tags/
 * Fetch all emotion tags with statistics
 */
export async function fetchEmotionTags(): Promise<EmotionTag[]> {
  const token = getAccessToken();
  return apiFetch<EmotionTag[]>("/api/emotion-tags/", {
    method: "GET",
    token: token || undefined,
  });
}

/**
 * POST /api/emotion-tags/
 * Create a new emotion tag
 */
export async function createEmotionTag(
  payload: CreateTagPayload
): Promise<EmotionTag> {
  const token = getAccessToken();
  return apiFetch<EmotionTag>("/api/emotion-tags/", {
    method: "POST",
    body: JSON.stringify(payload),
    token: token || undefined,
  });
}

/**
 * PATCH /api/emotion-tags/<id>/
 * Update an existing emotion tag
 */
export async function updateEmotionTag(
  id: number,
  payload: UpdateTagPayload
): Promise<EmotionTag> {
  const token = getAccessToken();
  return apiFetch<EmotionTag>(`/api/emotion-tags/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    token: token || undefined,
  });
}

/**
 * DELETE /api/emotion-tags/<id>/
 * Delete an emotion tag
 */
export async function deleteEmotionTag(id: number): Promise<void> {
  const token = getAccessToken();
  return apiFetch<void>(`/api/emotion-tags/${id}/`, {
    method: "DELETE",
    token: token || undefined,
  });
}

/**
 * GET /api/emotion-tags/suggested/
 * Fetch suggested emotion tags (filtered by backend to exclude existing)
 */
export async function fetchSuggestedTags(): Promise<SuggestedTag[]> {
  const token = getAccessToken();
  return apiFetch<SuggestedTag[]>("/api/emotion-tags/suggested/", {
    method: "GET",
    token: token || undefined,
  });
}
