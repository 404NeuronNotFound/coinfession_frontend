import { create } from "zustand";
import { fetchEmotionJournal } from "@/api/emotionJournalApi";
import {
  EmotionJournalResponse,
  EmotionStat,
  EmotionTrade,
  PatternInsight,
  HeatmapDay,
} from "@/types/emotionJournal.types";

interface EmotionJournalState {
  // Data
  emotionStats: EmotionStat[];
  trades: EmotionTrade[];
  insights: PatternInsight[];
  heatmap: HeatmapDay[];

  // UI State
  activeEmotionId: number | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadJournal: (token: string, emotionId?: number | null) => Promise<void>;
  setActiveEmotion: (emotionId: number | null) => void;
  clearError: () => void;
}

export const useEmotionJournalStore = create<EmotionJournalState>((set, get) => ({
  // Initial state
  emotionStats: [],
  trades: [],
  insights: [],
  heatmap: [],
  activeEmotionId: null,
  loading: false,
  error: null,

  // Load journal data from API
  loadJournal: async (token: string, emotionId?: number | null) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchEmotionJournal(token, {
        emotion_id: emotionId ?? undefined,
        weeks: 52,
      });

      set({
        emotionStats: data.emotion_stats,
        trades: data.trades,
        insights: data.insights,
        heatmap: data.heatmap,
        activeEmotionId: emotionId ?? null,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load emotion journal";
      set({ error: message, loading: false });
    }
  },

  // Set active emotion and reload data
  setActiveEmotion: async (emotionId: number | null) => {
    const { loadJournal } = get();
    const token = localStorage.getItem("access_token") || "";
    await loadJournal(token, emotionId);
  },

  // Clear error message
  clearError: () => set({ error: null }),
}));
