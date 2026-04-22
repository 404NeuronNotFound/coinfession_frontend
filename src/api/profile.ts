/**
 * api/profile.ts
 * 
 * API calls for user profile management.
 * All endpoints require authentication (Bearer token).
 * 
 * Endpoints:
 *   GET  /api/user/profile/  → fetch user profile
 *   PATCH /api/user/profile/ → update user profile
 */

import { apiFetch } from "./client";
import { UserProfile, UserProfileUpdatePayload } from "@/types/profile";

/**
 * Fetch the authenticated user's profile.
 * 
 * @param accessToken - JWT access token
 * @returns UserProfile with all user data
 * @throws ApiError if request fails or user is not authenticated
 */
export async function fetchUserProfile(accessToken: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/user/profile/", {
    method: "GET",
    token: accessToken,
  });
}

/**
 * Update the authenticated user's profile.
 * 
 * @param accessToken - JWT access token
 * @param updates - Partial profile data to update
 * @returns Updated UserProfile
 * @throws ApiError if request fails or validation errors occur
 */
export async function updateUserProfile(
  accessToken: string,
  updates: UserProfileUpdatePayload
): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/user/profile/", {
    method: "PATCH",
    token: accessToken,
    body: JSON.stringify(updates),
  });
}
