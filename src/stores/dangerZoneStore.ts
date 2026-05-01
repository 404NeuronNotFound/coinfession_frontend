// ─────────────────────────────────────────────────────────
// stores/dangerZoneStore.ts
//
// Zustand store for Danger Zone state management.
// Handles all destructive actions with proper error handling
// and message auto-clearing.
// ─────────────────────────────────────────────────────────

import { create } from "zustand";
import { DangerZoneStatus } from "@/types/dangerZone.types";
import {
  fetchDangerZoneStatus,
  resetPortfolioSnapshots,
  clearReportCache,
  deleteAIFeedbackAll,
  deleteAllTrades,
  deleteAccount,
} from "@/api/dangerZoneApi";

interface DangerZoneState {
  // ── Data
  status: DangerZoneStatus | null;
  loadingStatus: boolean;
  processing: string | null; // 'reset-snapshots' | 'clear-reports' | 'delete-ai-feedback' | 'delete-trades' | 'delete-account'
  successMessage: string | null;
  error: string | null;
  accountDeleted: boolean;

  // ── Actions
  loadStatus: (token: string) => Promise<void>;
  resetSnapshots: (token: string) => Promise<void>;
  clearReports: (token: string) => Promise<void>;
  deleteAIFeedback: (token: string, confirmation: string) => Promise<void>;
  deleteTrades: (token: string, confirmation: string) => Promise<void>;
  deleteUserAccount: (token: string, username: string) => Promise<void>;
  clearMessages: () => void;
}

export const useDangerZoneStore = create<DangerZoneState>()((set, get) => ({
  // ── Initial state
  status: null,
  loadingStatus: false,
  processing: null,
  successMessage: null,
  error: null,
  accountDeleted: false,

  // ── Load status (called on mount and after successful actions)
  loadStatus: async (token: string) => {
    set({ loadingStatus: true });

    try {
      const data = await fetchDangerZoneStatus(token);
      set({ status: data, loadingStatus: false });
    } catch (err: unknown) {
      // Non-fatal — log but don't set error
      console.error("Failed to load danger zone status:", err);
      set({ loadingStatus: false });
    }
  },

  // ── Reset portfolio snapshots (Tier 1 - recoverable)
  resetSnapshots: async (token: string) => {
    set({ processing: "reset-snapshots", error: null, successMessage: null });

    try {
      const response = await resetPortfolioSnapshots(token);
      set({ successMessage: response.message, processing: null });

      // Reload status to show updated counts
      await get().loadStatus(token);

      // Auto-clear success message after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset snapshots";
      set({ error: message, processing: null });

      // Auto-clear error after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    }
  },

  // ── Clear report cache (Tier 1 - recoverable)
  clearReports: async (token: string) => {
    set({ processing: "clear-reports", error: null, successMessage: null });

    try {
      const response = await clearReportCache(token);
      set({ successMessage: response.message, processing: null });

      // Reload status to show updated counts
      await get().loadStatus(token);

      // Auto-clear success message after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to clear reports";
      set({ error: message, processing: null });

      // Auto-clear error after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    }
  },

  // ── Delete AI feedback (Tier 2 - permanent, requires confirmation)
  deleteAIFeedback: async (token: string, confirmation: string) => {
    set({ processing: "delete-ai-feedback", error: null, successMessage: null });

    try {
      const response = await deleteAIFeedbackAll(token, confirmation);
      set({ successMessage: response.message, processing: null });

      // Reload status to show updated counts
      await get().loadStatus(token);

      // Auto-clear success message after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    } catch (err: unknown) {
      // Extract error message from API response or Error object
      let message = "Failed to delete AI feedback";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null && "error" in err) {
        message = (err as { error: string }).error;
      }
      set({ error: message, processing: null });

      // Auto-clear error after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    }
  },

  // ── Delete all trades (Tier 2 - permanent, requires confirmation)
  deleteTrades: async (token: string, confirmation: string) => {
    set({ processing: "delete-trades", error: null, successMessage: null });

    try {
      const response = await deleteAllTrades(token, confirmation);
      set({ successMessage: response.message, processing: null });

      // Reload status to show updated counts
      await get().loadStatus(token);

      // Auto-clear success message after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    } catch (err: unknown) {
      // Extract error message from API response or Error object
      let message = "Failed to delete trades";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null && "error" in err) {
        message = (err as { error: string }).error;
      }
      set({ error: message, processing: null });

      // Auto-clear error after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    }
  },

  // ── Delete user account (Tier 3 - irreversible)
  deleteUserAccount: async (token: string, username: string) => {
    set({ processing: "delete-account", error: null, successMessage: null });

    try {
      const response = await deleteAccount(token, username);

      // Clear JWT tokens immediately
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Set account deleted flag to show farewell screen
      set({
        accountDeleted: true,
        successMessage: response.message,
        processing: null,
      });

      // Redirect to login after 3 seconds (after farewell screen is shown)
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err: unknown) {
      // Extract error message from API response or Error object
      let message = "Failed to delete account";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null && "error" in err) {
        message = (err as { error: string }).error;
      }
      set({ error: message, processing: null });

      // Auto-clear error after 5 seconds
      setTimeout(() => get().clearMessages(), 5000);
    }
  },

  // ── Clear messages
  clearMessages: () => {
    set({ successMessage: null, error: null });
  },
}));
