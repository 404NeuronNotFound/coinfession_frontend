import { apiFetch } from "@/api/client";
import { EmotionJournalResponse, EmotionJournalFilters } from "@/types/emotionJournal.types";

/**
 * Fetch emotion journal data from the backend.
 * GET /api/emotion-journal/?emotion_id=<id>&weeks=52
 */
export async function fetchEmotionJournal(
  token: string,
  filters?: EmotionJournalFilters
): Promise<EmotionJournalResponse> {
  const params = new URLSearchParams();
  
  if (filters?.emotion_id) {
    params.append("emotion_id", String(filters.emotion_id));
  }
  
  // Always request 52 weeks for full-year heatmap
  params.append("weeks", "52");

  const query = params.toString();
  const path = `/api/emotion-journal/${query ? "?" + query : ""}`;

  return apiFetch<EmotionJournalResponse>(path, { token });
}
