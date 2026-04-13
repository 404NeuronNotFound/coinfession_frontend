/**
 * Install Zustand:  npm install zustand
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, TokenPair } from "@/types/auth";
import { refreshToken as apiRefreshToken } from "@/api/auth";

// ─── State shape ──────────────────────────────────────────
interface AuthState {
  // ── Data
  user:         User | null;
  accessToken:  string | null;
  refreshToken: string | null;

  // ── Status
  isAuthenticated: boolean;
  isLoading:       boolean;

  // ── Actions
  /** Call after a successful login — stores tokens + user */
  setSession:   (tokens: TokenPair, user: User) => void;
  /** Call after a successful register before auto-login */
  setUser:      (user: User) => void;
  /** Silently refresh the access token using the stored refresh token */
  tryRefresh:   () => Promise<boolean>;
  /** Clear everything — call on logout */
  clearSession: () => void;
}

// ─── Store ────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Initial state
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,

      // ── Set full session (login)
      setSession: (tokens, user) =>
        set({
          accessToken:     tokens.access,
          refreshToken:    tokens.refresh,
          user,
          isAuthenticated: true,
        }),

      // ── Set user only (after register, before auto-login)
      setUser: (user) => set({ user }),

      // ── Silently refresh access token
      tryRefresh: async () => {
        const { refreshToken: stored } = get();
        if (!stored) return false;

        set({ isLoading: true });
        try {
          const { access } = await apiRefreshToken(stored);
          set({ accessToken: access, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          // Refresh token expired — force logout
          get().clearSession();
          return false;
        }
      },

      // ── Clear session (logout)
      clearSession: () =>
        set({
          user:            null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
          isLoading:       false,
        }),
    }),

    {
      name:    "coinfession-auth",           // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist tokens + user — never persist loading state
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);