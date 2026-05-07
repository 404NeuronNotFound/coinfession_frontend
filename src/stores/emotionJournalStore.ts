import { create } from "zustand";
import { fetchEmotionJournal } from "@/api/emotionJournalApi";
import {
  EmotionStat,
  EmotionTrade,
  PatternInsight,
  HeatmapDay,
} from "@/types/emotionJournalTypes";

interface EmotionJournalState {
  // Data
  emotionStats: EmotionStat[];
  allTrades: EmotionTrade[]; // Store all trades
  filteredTrades: EmotionTrade[]; // Store filtered trades for display
  insights: PatternInsight[];
  heatmap: HeatmapDay[];
  availableYears: number[];
  selectedYear: number;

  // UI State
  activeEmotionId: number | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadJournal: (token: string, year?: number) => Promise<void>;
  setActiveEmotion: (emotionId: number | null) => void;
  setSelectedYear: (year: number, token?: string) => void;
  clearError: () => void;
}

export const useEmotionJournalStore = create<EmotionJournalState>((set, get) => ({
  // Initial state
  emotionStats: [],
  allTrades: [],
  filteredTrades: [],
  insights: [],
  heatmap: [],
  availableYears: [],
  selectedYear: new Date().getFullYear(),
  activeEmotionId: null,
  loading: false,
  error: null,

  // Load journal data from API (always loads all data, no emotion filter)
  loadJournal: async (token: string, year?: number) => {
    set({ loading: true, error: null });
    try {
      const currentYear = year ?? get().selectedYear;
      const data = await fetchEmotionJournal(token, {
        weeks: 52,
        year: currentYear,
      });

      set({
        emotionStats: data.emotion_stats,
        allTrades: data.trades,
        filteredTrades: data.trades, // Initially show all trades
        insights: data.insights,
        heatmap: data.heatmap,
        availableYears: data.available_years || [],
        selectedYear: data.selected_year || currentYear,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load emotion journal";
      set({ error: message, loading: false });
    }
  },

  // Set active emotion and filter trades locally
  setActiveEmotion: (emotionId: number | null) => {
    const { allTrades } = get();
    const filteredTrades = emotionId 
      ? allTrades.filter(trade => trade.emotion_id === emotionId)
      : allTrades;
    
    set({ 
      activeEmotionId: emotionId,
      filteredTrades 
    });
  },

  // Set selected year and reload data
  setSelectedYear: async (year: number, token?: string) => {
    const { loadJournal } = get();
    if (!token) {
      console.error("No token provided to setSelectedYear");
      return;
    }
    set({ selectedYear: year });
    await loadJournal(token, year);
  },

  // Clear error message
  clearError: () => set({ error: null }),
}));
