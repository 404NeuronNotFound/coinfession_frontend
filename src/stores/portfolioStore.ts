// ─────────────────────────────────────────────────────────
// stores/portfolioStore.ts
//
// Zustand store for Portfolio state management
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import type { PortfolioResponse } from "@/types/portfolioTypes";
import { fetchPortfolio, refreshPortfolioPrices } from "@/api/portfolioApi";

interface PortfolioState {
  portfolio: PortfolioResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  warning: string | null;
  pricesLive: boolean;

  // Actions
  loadPortfolio: () => Promise<void>;
  refreshPrices: () => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  loading: false,
  refreshing: false,
  error: null,
  warning: null,
  pricesLive: true,

  loadPortfolio: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchPortfolio();
      set({
        portfolio: response,
        warning: response.warning,
        pricesLive: response.prices_live,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to load portfolio" });
    } finally {
      set({ loading: false });
    }
  },

  refreshPrices: async () => {
    set({ refreshing: true, error: null });
    try {
      const response = await refreshPortfolioPrices();
      set({
        portfolio: response,
        warning: response.warning,
        pricesLive: response.prices_live,
        error: null,
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to refresh prices" });
    } finally {
      set({ refreshing: false });
    }
  },
}));
