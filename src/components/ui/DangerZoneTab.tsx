"use client";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useDangerZoneStore } from "@/stores/dangerZoneStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/useToast";
import { Toast } from "./Toast";
import { ConfirmationModal } from "./ConfirmationModal";
import { Button } from "./button";
import { AlertTriangle, RotateCcw, Trash2, Download, User } from "lucide-react";

interface DangerAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count?: string;
  warning?: string;
  isRecoverable: boolean;
  action: () => void;
}

export default function DangerZoneTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const { toast, showToast, hideToast } = useToast();
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: string | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    action: null,
    title: "",
    description: "",
  });

  // Get auth and danger zone state
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const {
    status,
    processing,
    accountDeleted,
    loadStatus,
    resetSnapshots,
    clearReports,
    deleteAIFeedback,
    deleteTrades,
    deleteUserAccount,
  } = useDangerZoneStore();

  // Load status on mount
  useEffect(() => {
    if (accessToken) {
      loadStatus(accessToken);
    }
  }, [accessToken, loadStatus]);

  const handleExportData = () => {
    // TODO: Implement export functionality
  };

  const openConfirmModal = (action: string, title: string, description: string) => {
    setConfirmModal({ isOpen: true, action, title, description });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
  };

  const handleConfirmAction = async () => {
    switch (confirmModal.action) {
      case "reset-snapshots":
        await handleResetPortfolioSnapshots();
        break;
      case "clear-reports":
        await handleClearMonthlyReportCache();
        break;
      case "delete-ai-feedback":
        await handleDeleteAIFeedback();
        break;
      case "delete-trades":
        await handleDeleteAllTrades();
        break;
      case "delete-account":
        await handleDeleteAccount();
        break;
    }
  };

  const handleResetPortfolioSnapshots = async () => {
    if (accessToken) {
      await resetSnapshots(accessToken);
      setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
      showToast("Portfolio snapshots reset successfully", "success", 3000);
    }
  };

  const handleClearMonthlyReportCache = async () => {
    if (accessToken) {
      await clearReports(accessToken);
      setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
      showToast("Monthly report cache cleared successfully", "success", 3000);
    }
  };

  const handleDeleteAIFeedback = async () => {
    if (accessToken) {
      await deleteAIFeedback(accessToken, "DELETE");
      setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
      showToast("AI feedback deleted successfully", "success", 3000);
    }
  };

  const handleDeleteAllTrades = async () => {
    if (accessToken) {
      await deleteTrades(accessToken, "DELETE ALL");
      setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
      showToast("All trades deleted successfully", "success", 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (accessToken && user?.username) {
      await deleteUserAccount(accessToken, user.username);
      setConfirmModal({ isOpen: false, action: null, title: "", description: "" });
      showToast("Account deleted successfully", "success", 3000);
    }
  };

  // Show farewell screen if account is deleted
  if (accountDeleted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`text-center p-8 rounded-lg border ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-red-200" : "text-red-900"}`}>
            Account Deleted
          </h2>
          <p className={`mb-4 ${isDark ? "text-red-300" : "text-red-800"}`}>
            Your account and all associated data have been permanently deleted.
          </p>
          <p className={`text-sm ${isDark ? "text-red-400" : "text-red-700"}`}>
            Redirecting to login in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  const recoverableActions: DangerAction[] = [
    {
      id: "reset-snapshots",
      title: "Reset portfolio snapshots",
      description: "Clears all cached portfolio snapshots. They will automatically recalculate on your next visit to the Portfolio page. Your trades are not affected.",
      icon: <RotateCcw className="w-6 h-6" />,
      warning: "Non-destructive — snapshots regenerate automatically in seconds.",
      isRecoverable: true,
      action: handleResetPortfolioSnapshots,
    },
    {
      id: "clear-cache",
      title: "Clear monthly report cache",
      description: "Forces all monthly reports to recalculate from raw trade data on next load. Use this if reports show stale numbers after editing past trades.",
      icon: <AlertTriangle className="w-6 h-6" />,
      warning: "Non-destructive — reports regenerate from your trade history automatically.",
      isRecoverable: true,
      action: handleClearMonthlyReportCache,
    },
  ];

  const permanentActions: DangerAction[] = [
    {
      id: "delete-feedback",
      title: "Delete all AI feedback",
      description: "Permanently deletes all 3 generated AI feedback reports. Your trades, emotions, and monthly report stats are not affected. You can regenerate feedback at any time.",
      icon: <Trash2 className="w-6 h-6" />,
      count: status ? `${status.ai_feedback_count} reports` : "— reports",
      warning: `${status?.ai_feedback_count || "—"} AI feedback reports will be permanently deleted.`,
      isRecoverable: false,
      action: handleDeleteAIFeedback,
    },
    {
      id: "delete-trades",
      title: "Delete all trades",
      description: `Permanently deletes all ${status?.trade_count || "—"} trade records and their emotion tags. Monthly reports and AI feedback history are kept but will reference deleted data.`,
      icon: <Trash2 className="w-6 h-6" />,
      count: status ? `${status.trade_count} trades` : "— trades",
      warning: `${status?.trade_count || "—"} trades and all linked emotion data will be permanently deleted. This cannot be undone.`,
      isRecoverable: false,
      action: handleDeleteAllTrades,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={hideToast}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        isDangerous={confirmModal.action?.includes("delete") || confirmModal.action?.includes("account")}
        isLoading={processing !== null}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirmModal}
        confirmText={confirmModal.action?.includes("delete") ? "Delete" : "Confirm"}
      />

      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? "text-red-200" : "text-red-900"}`}>
              Danger zone
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
              These actions are permanent and cannot be undone. Export your data first.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export all data first
          </Button>
        </div>
      </div>

      {/* Data Resets - Recoverable */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-inherit">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Data Resets</h3>
          <span className={`text-xs font-medium px-3 py-1 rounded ${isDark ? "bg-yellow-900/50 text-yellow-200" : "bg-yellow-100 text-yellow-700"}`}>
            RECOVERABLE
          </span>
        </div>

        <div className="space-y-4">
          {recoverableActions.map((action) => (
            <div
              key={action.id}
              className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-yellow-900/50 text-yellow-200" : "bg-yellow-100 text-yellow-700"}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{action.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>

              {action.warning && (
                <div className={`rounded p-3 mb-4 text-xs ${isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-yellow-50 text-yellow-800"}`}>
                  {action.warning}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => openConfirmModal(
                  action.id,
                  action.title,
                  action.warning || action.description
                )}
                disabled={processing !== null}
                className="text-xs sm:text-sm"
              >
                {action.title.split(" ").slice(0, 2).join(" ")}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Permanent Deletions */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-inherit">
          <h3 className={`text-base sm:text-lg font-semibold ${isDark ? "text-red-200" : "text-red-900"}`}>
            Permanent Deletions
          </h3>
          <span className={`text-xs font-medium px-3 py-1 rounded ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
            CANNOT BE UNDONE
          </span>
        </div>

        <div className="space-y-4">
          {permanentActions.map((action) => (
            <div
              key={action.id}
              className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-red-950/30 border-red-700/30" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${isDark ? "text-red-200" : "text-red-900"}`}>
                      {action.title}
                    </h4>
                    {action.count && (
                      <span className={`text-xs font-medium ${isDark ? "text-red-300" : "text-red-700"}`}>
                        {action.count}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
                    {action.description}
                  </p>
                </div>
              </div>

              {action.warning && (
                <div className={`rounded p-3 mb-4 text-xs ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
                  {action.warning}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => openConfirmModal(
                  action.id,
                  action.title,
                  action.warning || action.description
                )}
                disabled={processing !== null}
                className="text-destructive hover:text-destructive text-xs sm:text-sm"
              >
                {action.title.split(" ").slice(0, 2).join(" ")}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Account */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-inherit">
          <h3 className={`text-base sm:text-lg font-semibold ${isDark ? "text-red-200" : "text-red-900"}`}>
            Delete Account
          </h3>
          <span className={`text-xs font-medium px-3 py-1 rounded ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
            IRREVERSIBLE
          </span>
        </div>

        <div className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-red-950/30 border-red-700/30" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-semibold mb-1 ${isDark ? "text-red-200" : "text-red-900"}`}>
                Delete my account
              </h4>
              <p className={`text-xs sm:text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
                Permanently deletes your account and all associated data: trades, reports, AI feedback, preferences, emotion tags, and API keys. Your login will stop working immediately.
              </p>
            </div>
          </div>

          <div className={`rounded p-3 mb-4 text-xs ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
            Everything is deleted. There is no recovery. Your exported data is the only copy you will have.
          </div>

          <Button
            size="sm"
            onClick={() => openConfirmModal(
              "delete-account",
              "Delete my account",
              "This is permanent. Your account cannot be recovered. Are you absolutely sure?"
            )}
            disabled={processing !== null}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
