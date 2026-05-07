"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { changePassword, getActiveSessions, revokeSession, revokeAllSessions, getRefreshTokens } from "@/api/auth";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/ui/Toast";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Button } from "./button";
import { Monitor, Smartphone, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { UserSession, RefreshTokenInfo } from "@/types/auth";

export default function SecurityTab() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const { toast, showToast, hideToast } = useToast();
  const clearSession = useAuthStore((state) => state.clearSession);

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

  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [tokens, setTokens] = useState<RefreshTokenInfo[]>([]);
  const [isSessionsLoading, setIsSessionsLoading] = useState(true);
  const [isTokensLoading, setIsTokensLoading] = useState(true);
  const [revokeLoading, setRevokeLoading] = useState<number | null>(null);
  const [showRevokeAllConfirm, setShowRevokeAllConfirm] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [tokensPage, setTokensPage] = useState(1);
  const pageSize = 5;

  // Fetch sessions and tokens on mount
  useEffect(() => {
    fetchSessions();
    fetchTokens();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsSessionsLoading(true);
      const data = await getActiveSessions();
      setSessions(data);
    } catch (error: any) {
      console.error("Failed to fetch sessions:", error);
      showToast("Failed to load sessions", "error", 3000);
    } finally {
      setIsSessionsLoading(false);
    }
  };

  const fetchTokens = async () => {
    try {
      setIsTokensLoading(true);
      const data = await getRefreshTokens();
      setTokens(data);
    } catch (error: any) {
      console.error("Failed to fetch tokens:", error);
      showToast("Failed to load tokens", "error", 3000);
    } finally {
      setIsTokensLoading(false);
    }
  };

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

    setIsPasswordLoading(true);

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
      setIsPasswordLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: number) => {
    setRevokeLoading(sessionId);
    try {
      await revokeSession(sessionId);
      showToast("Session revoked successfully", "success", 3000);
      fetchSessions();
    } catch (error: any) {
      showToast(error?.message || "Failed to revoke session", "error", 3000);
    } finally {
      setRevokeLoading(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    setRevokeLoading(-1);
    try {
      const result = await revokeAllSessions();
      showToast(`${result.revoked_count} session(s) revoked. Logging out...`, "success", 3000);
      
      // Clear auth session immediately
      clearSession();
      
      // Clear localStorage
      localStorage.clear();
      
      // Redirect to login
      router.push('/login');
    } catch (error: any) {
      showToast(error?.message || "Failed to revoke sessions", "error", 3000);
    } finally {
      setRevokeLoading(null);
      setShowRevokeAllConfirm(false);
    }
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
          disabled={isPasswordLoading}
        >
          {isPasswordLoading ? "Updating..." : "Update password"}
        </Button>
      </div>

      {/* Active Sessions Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">
          Active sessions
        </h3>

        {isSessionsLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active sessions</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {sessions.slice((sessionsPage - 1) * pageSize, sessionsPage * pageSize).map((session) => (
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
                          {session.location} · Last active {new Date(session.last_active).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {session.is_current && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                              Current
                            </span>
                          )}
                          {session.is_current && (
                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              Active now
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="whitespace-nowrap"
                        disabled={revokeLoading === session.id}
                      >
                        {revokeLoading === session.id ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sessions Pagination */}
            {sessions.length > pageSize && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Showing {(sessionsPage - 1) * pageSize + 1}–{Math.min(sessionsPage * pageSize, sessions.length)} of {sessions.length} sessions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSessionsPage(Math.max(1, sessionsPage - 1))}
                    disabled={sessionsPage === 1}
                    className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(sessions.length / pageSize) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={sessionsPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSessionsPage(pageNum)}
                          className="w-8 h-8 p-0 text-xs cursor-pointer"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSessionsPage(Math.min(Math.ceil(sessions.length / pageSize), sessionsPage + 1))}
                    disabled={sessionsPage === Math.ceil(sessions.length / pageSize)}
                    className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {sessions.length > 1 && (
              <Button
                variant="outline"
                onClick={() => setShowRevokeAllConfirm(true)}
                className="w-full sm:w-auto"
                disabled={revokeLoading === -1}
              >
                {revokeLoading === -1 ? "Revoking..." : "Revoke all sessions & Logout"}
              </Button>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRevokeAllConfirm}
        title="Revoke all sessions?"
        description="This will log you out from all devices including this one. You'll need to log in again. This action cannot be undone."
        confirmText="Revoke all & Logout"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={revokeLoading === -1}
        onConfirm={handleRevokeAllSessions}
        onCancel={() => setShowRevokeAllConfirm(false)}
      />

      {/* JWT Tokens Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
          JWT Tokens
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Your active refresh tokens. These are created when you log in and used to issue new access tokens. Access tokens expire every <span className="font-semibold">60 minutes</span> — refresh tokens expire after <span className="font-semibold">7 days</span>.
        </p>

        {isTokensLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No active tokens</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {tokens.slice((tokensPage - 1) * pageSize, tokensPage * pageSize).map((token) => (
                <div
                  key={token.id}
                  className={`rounded-lg p-4 sm:p-5 border ${
                    isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${token.revoked_at ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground">
                        Token {token.token_suffix}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Issued {new Date(token.created_at).toLocaleDateString()} · expires {new Date(token.expires_at).toLocaleDateString()}
                      </p>
                      {token.last_used && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last used {new Date(token.last_used).toLocaleDateString()}
                        </p>
                      )}
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                        token.revoked_at 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {token.revoked_at ? 'Revoked' : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tokens Pagination */}
            {tokens.length > pageSize && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Showing {(tokensPage - 1) * pageSize + 1}–{Math.min(tokensPage * pageSize, tokens.length)} of {tokens.length} tokens
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTokensPage(Math.max(1, tokensPage - 1))}
                    disabled={tokensPage === 1}
                    className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.ceil(tokens.length / pageSize) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={tokensPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTokensPage(pageNum)}
                          className="w-8 h-8 p-0 text-xs cursor-pointer"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTokensPage(Math.min(Math.ceil(tokens.length / pageSize), tokensPage + 1))}
                    disabled={tokensPage === Math.ceil(tokens.length / pageSize)}
                    className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
