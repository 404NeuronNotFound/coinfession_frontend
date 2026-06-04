// ─────────────────────────────────────────────────────────
// stores/authStore.ts
//
// Zustand store for authentication state with enhanced security.
// Persisted to localStorage under key "coinfession-auth".
//
// Features:
// - JWT token management with automatic refresh
// - Username persistence for better UX
// - Secure token handling
// - Trading chat data cleanup on logout
// ─────────────────────────────────────────────────────────

import { create }                        from "zustand";
import { persist, createJSONStorage }    from "zustand/middleware";
import { User, TokenPair }               from "@/types/auth";

// ── State shape ───────────────────────────────────────────
interface AuthState {
  // ── Stored data
  user:          User | null;
  username:      string | null; // Persisted for quick access
  accessToken:   string | null;
  refreshToken:  string | null;

  // ── Derived status
  isAuthenticated: boolean;

  // ── Runtime flags (not persisted)
  isLoading:    boolean;
  isRefreshing: boolean;

  // ── Actions
  setSession: (tokens: TokenPair, user: User) => void;
  updateAccessToken: (newAccessToken: string) => void;
  tryRefresh: () => Promise<boolean>;
  clearSession: () => void;
}

// ── Store ─────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({

      // ── Initial state
      user:            null,
      username:        null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,
      isRefreshing:    false,

      // ── setSession (after login)
      setSession: (tokens, user) =>
        set({
          accessToken:     tokens.access,
          refreshToken:    tokens.refresh,
          user,
          username:        user.username, // Persist username
          isAuthenticated: true,
          isLoading:       false,
        }),

      // ── updateAccessToken (called by api/client.ts after silent refresh)
      updateAccessToken: (newAccessToken) =>
        set({
          accessToken:     newAccessToken,
          isAuthenticated: true,
          isRefreshing:    false,
        }),

      // ── tryRefresh (manual — middleware / page guards)
      tryRefresh: async () => {
        const { refreshToken: stored, isRefreshing } = get();

        if (!stored) return false;

        if (isRefreshing) {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              const { isRefreshing: still, isAuthenticated } = get();
              if (!still) {
                clearInterval(interval);
                resolve(isAuthenticated);
              }
            }, 100);
          });
        }

        set({ isRefreshing: true, isLoading: true });

        try {
          const { refreshToken: apiRefresh } = await import("@/api/auth");
          const { access } = await apiRefresh(stored);

          set({
            accessToken:     access,
            isAuthenticated: true,
            isRefreshing:    false,
            isLoading:       false,
          });
          return true;

        } catch {
          get().clearSession();
          return false;
        }
      },

      // ── clearSession (logout / expired refresh token)
      clearSession: () => {
        // Clear trading chat messages on logout
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("coinfession-trading-chat");
          } catch (e) {
            // Ignore errors
          }
        }
        
        set({
          user:            null,
          username:        null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
          isLoading:       false,
          isRefreshing:    false,
        });
      },
    }),

    {
      name:    "coinfession-auth",
      storage: createJSONStorage(() => localStorage),

      // Persist tokens, user, and username
      partialize: (state) => ({
        user:            state.user,
        username:        state.username,
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);