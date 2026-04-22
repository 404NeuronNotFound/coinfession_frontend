/**
 * hooks/useProtectedProfile.ts
 * 
 * Custom hook for protected profile data access.
 * Ensures user is authenticated before fetching profile.
 * Automatically redirects to login if not authenticated.
 * 
 * Usage in components:
 *   const { profile, isLoading, error } = useProtectedProfile();
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useProfileStore } from "@/stores/profileStore";
import { UserProfile } from "@/types/profile";

interface UseProtectedProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProtectedProfile(): UseProtectedProfileReturn {
  const router = useRouter();
  const { isAuthenticated, accessToken } = useAuthStore();
  const { profile, isLoading, error, fetchProfile } = useProfileStore();
  
  useEffect(() => {
    // Guard: redirect if not authenticated
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    
    // Guard: no access token (shouldn't happen if isAuthenticated is true)
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    
    // Fetch profile if not already loaded
    if (!profile) {
      fetchProfile(accessToken).catch((err) => {
        console.error("Failed to fetch profile:", err);
        // Don't redirect on fetch error — let the component handle it
      });
    }
  }, [isAuthenticated, accessToken, profile, fetchProfile, router]);
  
  const refetch = async () => {
    if (accessToken) {
      await fetchProfile(accessToken);
    }
  };
  
  return {
    profile,
    isLoading,
    error,
    refetch,
  };
}
