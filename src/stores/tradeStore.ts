// ─────────────────────────────────────────────────────────
// stores/tradeStore.ts
//
// Zustand store for Trade Log state management.
// Handles trades, filters, pagination, and drawer state.
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import type {
  Trade,
  TradeFilters,
  TradeSummary,
  EmotionTag,
  CreateTradePayload,
  UpdateTradePayload,
} from "@/types/tradeTypes";
import {
  fetchTrades,
  fetchTradeSummary,
  fetchEmotionTags,
  createTrade as apiCreateTrade,
  updateTrade as apiUpdateTrade,
  deleteTrade as apiDeleteTrade,
} from "@/api/tradeApi";

interface TradeState {
  // Data
  trades: Trade[];
  summary: TradeSummary | null;
  emotionTags: EmotionTag[];
  
  // Filters
  filters: TradeFilters;
  
  // Pagination
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
  
  // UI State
  loading: boolean;
  drawerOpen: boolean;
  editingTrade: Trade | null;
  
  // Actions
  loadTrades: () => Promise<void>;
  loadEmotionTags: () => Promise<void>;
  updateFilter: (key: keyof TradeFilters, value: string | number) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  openDrawer: (trade?: Trade) => void;
  closeDrawer: () => void;
  saveTrade: (payload: CreateTradePayload | UpdateTradePayload) => Promise<void>;
  deleteTrade: (id: number) => Promise<void>;
}

const initialFilters: TradeFilters = {
  coin: "",
  type: "",
  emotion: "",
  pnl: "",
  date_from: "",
  date_to: "",
  search: "",
  sort: "-date",
  page: 1,
  page_size: 10,
};

export const useTradeStore = create<TradeState>((set, get) => ({
  // Initial state
  trades: [],
  summary: null,
  emotionTags: [],
  filters: initialFilters,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  drawerOpen: false,
  editingTrade: null,

  // Load trades and summary in parallel
  loadTrades: async () => {
    set({ loading: true });
    try {
      const { filters } = get();
      const [tradesResponse, summaryResponse] = await Promise.all([
        fetchTrades(filters),
        fetchTradeSummary(filters),
      ]);
      
      set({
        trades: tradesResponse.results,
        summary: summaryResponse,
        pagination: {
          count: tradesResponse.count,
          next: tradesResponse.next,
          previous: tradesResponse.previous,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load trades:", error);
      set({ loading: false });
      
      // Redirect to login on 401
      if ((error as { status?: number }).status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  },

  // Load emotion tags (call once on mount)
  loadEmotionTags: async () => {
    try {
      const tags = await fetchEmotionTags();
      set({ emotionTags: tags });
    } catch (error) {
      console.error("Failed to load emotion tags:", error);
    }
  },

  // Update a single filter and reload trades
  updateFilter: (key, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        // Reset to page 1 when filters change
        page: key === "page" ? Number(value) : 1,
      },
    }));
    // Reload trades after filter update
    setTimeout(() => get().loadTrades(), 0);
  },

  // Clear all filters and reload
  clearFilters: () => {
    set({ filters: initialFilters });
    setTimeout(() => get().loadTrades(), 0);
  },

  // Change page
  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    setTimeout(() => get().loadTrades(), 0);
  },

  // Open drawer for create or edit
  openDrawer: (trade) => {
    set({
      drawerOpen: true,
      editingTrade: trade || null,
    });
  },

  // Close drawer
  closeDrawer: () => {
    set({
      drawerOpen: false,
      editingTrade: null,
    });
  },

  // Save trade (create or update)
  saveTrade: async (payload) => {
    try {
      const { editingTrade } = get();
      
      if (editingTrade) {
        // Update existing trade
        await apiUpdateTrade(editingTrade.id, payload as UpdateTradePayload);
      } else {
        // Create new trade
        await apiCreateTrade(payload as CreateTradePayload);
      }
      
      // Close drawer and reload trades
      get().closeDrawer();
      await get().loadTrades();
    } catch (error) {
      console.error("Failed to save trade:", error);
      throw error; // Re-throw so the form can show validation errors
    }
  },

  // Delete trade
  deleteTrade: async (id) => {
    try {
      await apiDeleteTrade(id);
      await get().loadTrades();
    } catch (error) {
      console.error("Failed to delete trade:", error);
    }
  },
}));
