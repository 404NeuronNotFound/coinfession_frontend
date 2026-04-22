/**
 * types/profile.ts
 * 
 * Type definitions for user profile data.
 * Matches the backend UserProfile serializer response.
 */

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  currency: string;
  timezone: string;
  member_since: string; // ISO datetime
}

export interface UserProfileUpdatePayload {
  display_name?: string;
  bio?: string;
  profile_photo_url?: string;
  currency?: string;
  timezone?: string;
}

export interface ProfileApiResponse {
  success: boolean;
  data?: UserProfile;
  error?: string;
}
