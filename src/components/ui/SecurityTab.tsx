"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { changePassword } from "@/api/auth";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { Button } from "./button";
import { Monitor, Smartphone, Eye, EyeOff } from "lucide-react";

interface Session {
  id: string;
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  isThisDevice: boolean;
}

interface Token {
  id: string;
  issued: string;
  expires: string;
  browser: string;
  os: string;
  status: "active" | "expired";
}

const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    browser: "Chrome",
    os: "Windows",
    location: "Davao, PH",
    lastActive: "just now",
    isCurrent: true,
    isThisDevice: true,
  },
  {
    id: "2",
    browser: "Safari",
    os: "iOS",
    location: "Davao, PH",
    lastActive: "2 days ago",
    isCurrent: false,
    isThisDevice: false,
  },
  {
    id: "3",
    browser: "Chrome",
    os: "macOS",
    location: "Manila, PH",
    lastActive: "5 days ago",
    isCurrent: false,
    isThisDevice: false,
  },
];

const MOCK_TOKENS: Token[] = [
  {
    id: "eyJ...xk4T",
    issued: "Apr 20",
    expires: "Apr 27",
    browser: "Chrome / Windows",
    os: "Windows",
    status: "active",
  },
];

export default function SecurityTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const accessToken = useAuthStore((state) => state.accessToken);
  const { toast, showToast, hideToast } = useToast();

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdatePassword = async () => {
    // Validation
    if (!passwordForm.current.trim()) {
      showToast("Current password is required", "error", 3000);
      return;
    }

    if (!passwordForm.new.trim()) {
      showToast("New password is required", "error", 3000);
      return;
    }

    if (!passwordForm.confirm.trim()) {
      showToast("Password confirmation is required", "error", 3000);
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      showToast("New passwords do not match", "error", 3000);
      return;
    }

    if (passwordForm.new.length < 8) {
      showToast("Password must be at least 8 characters long", "error", 3000);
      return;
    }

    setIsLoading(true);

    try {
      const response = await changePassword({
        current_password: passwordForm.current,
        new_password: passwordForm.new,
        confirm_password: passwordForm.confirm,
      });

      showToast(response.message || "Password changed successfully", "success", 3000);
      setPasswordForm({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to change password";
      showToast(errorMessage, "error", 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    console.log("Revoking session:", sessionId);
  };

  const handleRevokeAllSessions = () => {
    console.log("Revoking all sessions");
  };

  const getDeviceIcon = (os: string) => {
    return os.toLowerCase().includes("windows") || os.toLowerCase().includes("macos") ? (
      <Monitor className="w-6 h-6 text-muted-foreground" />
    ) : (
      <Smartphone className="w-6 h-6 text-muted-foreground" />
    );
  };

  return (
    <div className="space-y-6">
      {toast.isVisible && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {/* Change Password Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
          Change password
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Manage your password, active sessions, and token access
        </p>

        <div className={`rounded-lg p-4 sm:p-6 mb-6 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Current password
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Required to verify your identity
              </p>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current"
                  value={passwordForm.current}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors pr-10 ${
                    isDark
                      ? "bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                New password
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Mix letters, numbers, symbols. Minimum 8 characters.
              </p>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="new"
                  value={passwordForm.new}
                  onChange={handlePasswordChange}
                  placeholder="Enter a password"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors pr-10 ${
                    isDark
                      ? "bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Confirm new password
              </label>
              <p className="text-xs text-muted-foreground mb-3">
                Must match the new password above
              </p>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors pr-10 ${
                    isDark
                      ? "bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleUpdatePassword} 
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </div>

      {/* Active Sessions Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">
          Active sessions
        </h3>

        <div className="space-y-4 mb-6">
          {MOCK_SESSIONS.map((session) => (
            <div
              key={session.id}
              className={`rounded-lg p-4 sm:p-5 border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  {getDeviceIcon(session.os)}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {session.browser} · {session.os}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {session.location} · Last active {session.lastActive}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {session.isCurrent && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          Current
                        </span>
                      )}
                      {session.isThisDevice && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          This device
                        </span>
                      )}
                      {session.isCurrent && (
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          Active now
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    className="whitespace-nowrap"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleRevokeAllSessions}
          className="w-full sm:w-auto"
        >
          Revoke all other sessions
        </Button>
      </div>

      {/* JWT Tokens Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
          JWT Tokens
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Your active refresh tokens. These are created when you log in and used to issue new access tokens. Revoking a token logs out that session immediately. Access tokens expire every <span className="font-semibold">60 minutes</span> — refresh tokens expire after <span className="font-semibold">7 days</span>.
        </p>

        <div className="space-y-4">
          {MOCK_TOKENS.map((token) => (
            <div
              key={token.id}
              className={`rounded-lg p-4 sm:p-5 border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      Current session
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued {token.issued} · expires {token.expires} · {token.browser}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {token.id}
                    </p>
                  </div>
                </div>
                <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                  {token.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
