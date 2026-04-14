// ─────────────────────────────────────────────────────────
// stores/authStore.ts
//
// Zustand store for authentication state.
// Persisted to localStorage under key "coinfession-auth".
//
// Token lifecycle (matches your two Django endpoints):
//
//   POST /api/token/
//     → returns { access, refresh }
//     → access  : short-lived  (5 min default) — sent on every request
//     → refresh : long-lived   (1 day default) — used ONLY to get
//                               a new access token when it expires
//
//   POST /api/token/refresh/
//     → body:    { refresh: <refresh_token> }
//     → returns: { access: <new_access_token> }
//     → the refresh token itself does NOT change
//
// Silent refresh is handled automatically by api/client.ts.
// It calls updateAccessToken() here after a successful refresh.
// If the refresh token itself expires, clearSession() is called
// and the app redirects to /login.
//
// Install:  npm install zustand
// ─────────────────────────────────────────────────────────

import { create }                        from "zustand";
import { persist, createJSONStorage }    from "zustand/middleware";
import { User, TokenPair }               from "@/types/auth";

// ── State shape ───────────────────────────────────────────
interface AuthState {
  // ── Stored data
  user:          User | null;
  accessToken:   string | null;
  refreshToken:  string | null;

  // ── Derived status
  isAuthenticated: boolean;

  // ── Runtime flags (not persisted)
  isLoading:    boolean;
  isRefreshing: boolean; // prevents concurrent refresh calls

  // ── Actions ───────────────────────────────────────────
  /**
   * setSession — call after POST /api/token/ + GET /api/user/me/
   * Stores both tokens and the user profile.
   * This is the only action that marks the user as authenticated.
   */
  setSession: (tokens: TokenPair, user: User) => void;

  /**
   * updateAccessToken — called by api/client.ts after a silent refresh.
   * Replaces only the access token — refresh token stays the same.
   *
   * Why not call tryRefresh here?
   * The refresh HTTP call lives in api/client.ts to keep the store
   * free of fetch logic. updateAccessToken is the bridge back.
   */
  updateAccessToken: (newAccessToken: string) => void;

  /**
   * tryRefresh — manually trigger a silent refresh.
   * Useful in middleware or page guards to pre-warm the token
   * before the first authenticated request.
   *
   * Returns true  → refresh succeeded, new access token stored.
   * Returns false → refresh failed (expired), session cleared.
   */
  tryRefresh: () => Promise<boolean>;

  /**
   * clearSession — wipe all auth state.
   * Called on logout, or when both tokens expire.
   * After this, isAuthenticated is false and the app
   * should redirect to /login.
   */
  clearSession: () => void;
}

// ── Store ─────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({

      // ── Initial state
      user:            null,
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

        // No refresh token — nothing to do
        if (!stored) return false;

        // Guard: if a refresh is already in flight, wait instead of
        // sending a second one. This can happen if two requests fire
        // simultaneously with an expired access token.
        if (isRefreshing) {
          // Poll every 100ms until the in-flight refresh resolves
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
          // Dynamic import avoids circular dep: store → api → store
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
          // Both tokens expired — force logout
          get().clearSession();
          return false;
        }
      },

      // ── clearSession (logout / expired refresh token)
      clearSession: () =>
        set({
          user:            null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
          isLoading:       false,
          isRefreshing:    false,
        }),
    }),

    {
      name:    "coinfession-auth",
      storage: createJSONStorage(() => localStorage),

      // Only persist tokens and user.
      // isLoading and isRefreshing are runtime-only — never persist them.
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);