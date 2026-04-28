// ═══════════════════════════════════════════════════════════════
// P&L ANALYSIS STORE
// ═══════════════════════════════════════════════════════════════

import { create } from "zustand";
import type { PnlAnalysisResponse, PnlFilters } from "@/types/pnlAnalysis.types";
import { fetchPnlAnalysis } from "@/api/pnlAnalysisApi";

interface PnlAnalysisState {
  // Data
  data: PnlAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  filters: PnlFilters;
  
  // Actions
  loadPnlAnalysis: () => Promise<void>;
  setFilters: (newFilters: Partial<PnlFilters>) => void;
  clearFilters: () => void;
}

const initialFilters: PnlFilters = {
  date_from: "",
  date_to: "",
  coin_id: undefined,
};

export const usePnlAnalysisStore = create<PnlAnalysisState>((set, get) => ({
  // Initial state
  data: null,
  loading: false,
  error: null,
  filters: initialFilters,
  
  // Load P&L analysis data
  loadPnlAnalysis: async () => {
    set({ loading: true, error: null });
    
    try {
      const { filters } = get();
      
      // Build clean filters object (remove empty strings)
      const cleanFilters: PnlFilters = {};
      
      if (filters.date_from) {
        cleanFilters.date_from = filters.date_from;
      }
      
      if (filters.date_to) {
        cleanFilters.date_to = filters.date_to;
      }
      
      if (filters.coin_id !== undefined && filters.coin_id !== null) {
        cleanFilters.coin_id = filters.coin_id;
      }
      
      const data = await fetchPnlAnalysis(cleanFilters);
      
      set({
        data,
        loading: false,
        error: null,
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load P&L analysis";
      
      set({
        data: null,
        loading: false,
        error: errorMessage,
      });
      
      console.error("Failed to load P&L analysis:", error);
    }
  },
  
  // Set filters and reload data
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
    
    // Reload data after filter update
    setTimeout(() => get().loadPnlAnalysis(), 0);
  },
  
  // Clear all filters and reload
  clearFilters: () => {
    set({ filters: initialFilters });
    setTimeout(() => get().loadPnlAnalysis(), 0);
  },
}));
