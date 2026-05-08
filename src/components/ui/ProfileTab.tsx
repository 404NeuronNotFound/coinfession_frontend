"use client";

import { useState, useEffect } from "react";
import { useProtectedProfile } from "@/hooks/useProtectedProfile";
import { useProfileStore } from "@/stores/profileStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/useToast";
import { UserProfileUpdatePayload } from "@/types/profile";
import { Toast } from "@/components/ui/Toast";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ProfileTab() {
  const { profile, isLoading, error, refetch } = useProtectedProfile();
  const { updateProfile, isUpdating, setError } = useProfileStore();
  const { accessToken } = useAuthStore();
  const { toast, showToast, hideToast } = useToast();
  const [formData, setFormData] = useState<UserProfileUpdatePayload>({
    display_name: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSave = async () => {
    if (!accessToken) return;
    try {
      await updateProfile(accessToken, formData);
      showToast("Profile updated successfully!", "success", 3000);
    } catch (err) {
      showToast("Failed to update profile", "error", 3000);
      console.error("Failed to update profile:", err);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
      });
    }
    setError(null);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-destructive">Failed to load profile</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-3 px-3 py-1.5 text-xs font-medium bg-destructive text-white rounded hover:bg-destructive/90 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {profile && (
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold text-lg">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground">Username</p>
              <p className="text-base font-semibold text-foreground">{profile.username}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since {new Date(profile.member_since).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Display Name
          </label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name || ""}
            onChange={handleInputChange}
            placeholder="Your display name"
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-text"
          />
          <p className="text-xs text-muted-foreground mt-1">How your name appears to others</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
          <input
            type="email"
            value={profile?.email || ""}
            disabled
            className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none cursor-text"
          />
          <p className="text-xs text-muted-foreground mt-1">Max 500 characters</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          disabled={isUpdating}
          className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
