/**
 * stores/profileStore.ts
 * 
 * Zustand store for user profile state using HttpOnly Cookie auth.
 * Manages fetching, caching, and updating user profile data.
 */

import { create } from "zustand";
import { UserProfile, UserProfileUpdatePayload } from "@/types/profile";
import { fetchUserProfile, updateUserProfile } from "@/api/profile";

interface ProfileState {
  // ── Data
  profile: UserProfile | null;
  
  // ── Status
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // ── Actions
  fetchProfile: (accessToken: string) => Promise<void>;
  updateProfile: (accessToken: string, updates: UserProfileUpdatePayload) => Promise<void>;
  clearProfile: () => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  // ── Initial state
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  
  // ── fetchProfile
  fetchProfile: async (accessToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchUserProfile(accessToken);
      set({ profile: data, isLoading: false });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to fetch profile";
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },
  
  // ── updateProfile
  updateProfile: async (accessToken: string, updates: UserProfileUpdatePayload) => {
    set({ isUpdating: true, error: null });
    try {
      const data = await updateUserProfile(accessToken, updates);
      set({ profile: data, isUpdating: false });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update profile";
      set({ error: errorMsg, isUpdating: false });
      throw err;
    }
  },
  
  // ── clearProfile
  clearProfile: () => {
    set({ profile: null, error: null, isLoading: false, isUpdating: false });
  },
  
  // ── setError
  setError: (error: string | null) => {
    set({ error });
  },
}));
