"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
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
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleExportData = () => {
    console.log("Exporting all data");
  };

  const handleResetPortfolioSnapshots = () => {
    console.log("Resetting portfolio snapshots");
    setShowConfirmDelete(null);
  };

  const handleClearMonthlyReportCache = () => {
    console.log("Clearing monthly report cache");
    setShowConfirmDelete(null);
  };

  const handleDeleteAIFeedback = () => {
    console.log("Deleting all AI feedback");
    setShowConfirmDelete(null);
  };

  const handleDeleteAllTrades = () => {
    console.log("Deleting all trades");
    setShowConfirmDelete(null);
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account");
    setShowConfirmDelete(null);
  };

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
      count: "3 reports",
      warning: "3 AI feedback reports will be permanently deleted.",
      isRecoverable: false,
      action: handleDeleteAIFeedback,
    },
    {
      id: "delete-trades",
      title: "Delete all trades",
      description: "Permanently deletes all 39 trade records and their emotion tags. Monthly reports and AI feedback history are kept but will reference deleted data.",
      icon: <Trash2 className="w-6 h-6" />,
      count: "39 trades",
      warning: "39 trades and all linked emotion data will be permanently deleted. This cannot be undone.",
      isRecoverable: false,
      action: handleDeleteAllTrades,
    },
  ];

  return (
    <div className="space-y-6">
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
                onClick={() => setShowConfirmDelete(action.id)}
                className="text-xs sm:text-sm"
              >
                {action.title.split(" ").slice(0, 2).join(" ")}
              </Button>

              {showConfirmDelete === action.id && (
                <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-900 mb-3">Are you sure?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={action.action}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Yes, {action.title.toLowerCase()}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDelete(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
                onClick={() => setShowConfirmDelete(action.id)}
                className="text-destructive hover:text-destructive text-xs sm:text-sm"
              >
                {action.title.split(" ").slice(0, 2).join(" ")}
              </Button>

              {showConfirmDelete === action.id && (
                <div className={`mt-4 p-4 rounded-lg border ${isDark ? "bg-red-900/50 border-red-700" : "bg-red-100 border-red-300"}`}>
                  <p className={`text-sm font-semibold mb-3 ${isDark ? "text-red-200" : "text-red-900"}`}>
                    This cannot be undone. Are you absolutely sure?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={action.action}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, {action.title.toLowerCase()}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDelete(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
            onClick={() => setShowConfirmDelete("delete-account")}
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
          >
            Delete account
          </Button>

          {showConfirmDelete === "delete-account" && (
            <div className={`mt-4 p-4 rounded-lg border ${isDark ? "bg-red-900/50 border-red-700" : "bg-red-100 border-red-300"}`}>
              <p className={`text-sm font-semibold mb-3 ${isDark ? "text-red-200" : "text-red-900"}`}>
                This is permanent. Your account cannot be recovered. Are you sure?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Yes, delete my account
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmDelete(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
