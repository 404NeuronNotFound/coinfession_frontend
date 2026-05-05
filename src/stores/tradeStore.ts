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
  OpenPosition,
} from "@/types/tradeTypes";
import {
  fetchTrades,
  fetchTradeSummary,
  fetchEmotionTags,
  createTrade as apiCreateTrade,
  updateTrade as apiUpdateTrade,
  deleteTrade as apiDeleteTrade,
  fetchOpenPositions,
} from "@/api/tradeApi";

interface TradeState {
  // Data
  trades: Trade[];
  allTrades: Trade[]; // Store all trades for client-side pagination
  summary: TradeSummary | null;
  emotionTags: EmotionTag[];
  
  // Open Positions
  openPositions: OpenPosition[];
  openPositionsMeta: {
    total_collateral: number;
    total_unrealized_pnl: number | null;
    prices_live: boolean;
  } | null;
  loadingOpenPositions: boolean;
  
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
  loadOpenPositions: () => Promise<void>;
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
  allTrades: [],
  summary: null,
  emotionTags: [],
  openPositions: [],
  openPositionsMeta: null,
  loadingOpenPositions: false,
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
      
      // Fetch all SPOT trades only (exclude long/short positions)
      // Always request page 1 with large page_size to get all trades
      const filtersWithSpotOnly = { 
        ...filters, 
        page: 1,  // Always fetch page 1 from backend
        page_size: 1000,  // Fetch large batch
        position_type: 'spot'  // Only fetch spot trades
      };
      
      const [tradesResponse, summaryResponse] = await Promise.all([
        fetchTrades(filtersWithSpotOnly),
        fetchTradeSummary(filtersWithSpotOnly),
      ]);
      
      // Sort trades: open/unsold trades first (at the top), then closed trades by date
      const sortedTrades = [...tradesResponse.results].sort((a, b) => {
        // Determine if trade is open (not yet sold)
        const aIsOpen = a.is_open || a.sell_price === null || a.realized_pnl === null;
        const bIsOpen = b.is_open || b.sell_price === null || b.realized_pnl === null;
        
        // If one is open and the other is closed, open comes first
        if (aIsOpen && !bIsOpen) return -1;
        if (!aIsOpen && bIsOpen) return 1;
        
        // If both are open, sort by date (oldest first - so earliest buys appear at top)
        if (aIsOpen && bIsOpen) {
          return new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime();
        }
        
        // If both are closed, sort by date (newest first)
        return new Date(b.trade_date).getTime() - new Date(a.trade_date).getTime();
      });
      
      // Apply client-side pagination
      const page = filters.page || 1;
      const pageSize = filters.page_size || 10;
      const startIdx = (page - 1) * pageSize;
      const endIdx = startIdx + pageSize;
      const paginatedTrades = sortedTrades.slice(startIdx, endIdx);
      
      set({
        allTrades: sortedTrades,
        trades: paginatedTrades,
        summary: summaryResponse,
        pagination: {
          count: sortedTrades.length,
          next: endIdx < sortedTrades.length ? "next" : null,
          previous: startIdx > 0 ? "previous" : null,
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

  // Load open positions
  loadOpenPositions: async () => {
    set({ loadingOpenPositions: true });
    try {
      const response = await fetchOpenPositions();
      
      // Extract results array from paginated response
      const results = response.results || response;
      
      // Filter to only include long/short positions (exclude spot)
      const leveragePositions = results.filter((pos: any) => 
        pos.position_type === 'long' || pos.position_type === 'short'
      );
      
      // Transform response to match expected format
      const openPositions = leveragePositions.map((pos: any) => ({
        ...pos,
        days_open: Math.floor((Date.now() - new Date(pos.trade_date).getTime()) / (1000 * 60 * 60 * 24)),
      }));
      
      // Calculate totals
      const total_collateral = openPositions.reduce((sum: number, pos: any) => sum + pos.collateral, 0);
      const total_unrealized_pnl = openPositions.reduce((sum: number, pos: any) => {
        return sum + (pos.unrealized_pnl || 0);
      }, 0);
      const prices_live = openPositions.every((pos: any) => pos.current_price !== null);
      
      set({
        openPositions,
        openPositionsMeta: {
          total_collateral,
          total_unrealized_pnl,
          prices_live,
        },
        loadingOpenPositions: false,
      });
    } catch (error) {
      console.error("Failed to load open positions:", error);
      set({ loadingOpenPositions: false });
      
      // Redirect to login on 401
      if ((error as { status?: number }).status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  },
}));
