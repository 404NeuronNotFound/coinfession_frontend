// ─────────────────────────────────────────────────────────
// stores/dashboardStore.ts
//
// Zustand store for Dashboard data using HttpOnly Cookie auth.
// Manages loading, refreshing, and error states.
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import { DashboardResponse } from "@/types/dashboard.types";
import { fetchDashboard } from "@/api/dashboardApi";

interface DashboardState {
  // ── Stored data
  data: DashboardResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;

  // ── Actions
  loadDashboard: (token: string) => Promise<void>;
  refreshDashboard: (token: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  // ── Initial state
  data: null,
  loading: false,
  refreshing: false,
  error: null,

  // ── loadDashboard (initial load on mount)
  loadDashboard: async (token: string) => {
    set({ loading: true, error: null });

    try {
      const data = await fetchDashboard(token);
      set({ data, loading: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load dashboard";
      set({ error: message, loading: false });
    }
  },

  // ── refreshDashboard (manual refresh button)
  refreshDashboard: async (token: string) => {
    set({ refreshing: true, error: null });

    try {
      const data = await fetchDashboard(token);
      set({ data, refreshing: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to refresh dashboard";
      set({ error: message, refreshing: false });
    }
  },
}));
