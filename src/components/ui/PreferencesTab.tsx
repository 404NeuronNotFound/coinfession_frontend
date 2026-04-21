"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";

export default function PreferencesTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  // Trade Journal Behaviour
  const [requireEmotionTag, setRequireEmotionTag] = useState(true);
  const [requireTradeNotes, setRequireTradeNotes] = useState(false);
  const [defaultTradeType, setDefaultTradeType] = useState("buy");
  const [defaultFeeRate, setDefaultFeeRate] = useState("0.10");
  const [confirmBeforeSaving, setConfirmBeforeSaving] = useState(false);
  const [defaultDate, setDefaultDate] = useState("today");

  // AI Feedback Settings
  const [feedbackTone, setFeedbackTone] = useState("direct-but-kind");
  const [autoGenerateFeedback, setAutoGenerateFeedback] = useState(false);
  const [includeTradeNotes, setIncludeTradeNotes] = useState(true);
  const [aiContextWindow, setAiContextWindow] = useState("3-months");

  // Display & Numbers
  const [pnlDisplayFormat, setPnlDisplayFormat] = useState("both");
  const [decimalPlaces, setDecimalPlaces] = useState("4");
  const [dashboardPeriod, setDashboardPeriod] = useState("1m");
  const [showUnrealizedPnL, setShowUnrealizedPnL] = useState(true);

  // Notifications & Reminders
  const [monthlyReminder, setMonthlyReminder] = useState(true);
  const [untaggedReminder, setUntaggedReminder] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");

  const handleSave = () => {
    console.log("Saving preferences...");
  };

  const handleReset = () => {
    setRequireEmotionTag(true);
    setRequireTradeNotes(false);
    setDefaultTradeType("buy");
    setDefaultFeeRate("0.10");
    setConfirmBeforeSaving(false);
    setDefaultDate("today");
    setFeedbackTone("direct-but-kind");
    setAutoGenerateFeedback(false);
    setIncludeTradeNotes(true);
    setAiContextWindow("3-months");
    setPnlDisplayFormat("both");
    setDecimalPlaces("4");
    setDashboardPeriod("1m");
    setShowUnrealizedPnL(true);
    setMonthlyReminder(true);
    setUntaggedReminder(true);
    setWeeklySummary(false);
    setNotificationEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Preferences</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Control how the journal behaves, how AI talks to you, and what you see on screen.
        </p>
      </div>

      {/* Trade Journal Behaviour */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          Trade Journal Behaviour
        </h3>

        <div className="space-y-6">
          {/* Require emotion tag */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Require emotion tag on every trade</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Show a warning when saving a trade without an emotion tag selected. Helps keep your journal complete.
              </p>
            </div>
            <button
              onClick={() => setRequireEmotionTag(!requireEmotionTag)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                requireEmotionTag ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  requireEmotionTag ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Require trade notes */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Require trade notes</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Prompt to add a note explaining the reason for the trade. The AI uses your notes to give better feedback.
              </p>
            </div>
            <button
              onClick={() => setRequireTradeNotes(!requireTradeNotes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                requireTradeNotes ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  requireTradeNotes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Default trade type */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Default trade type</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Pre-select this type when opening the log trade drawer
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDefaultTradeType("buy")}
                className={`px-6 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                  defaultTradeType === "buy"
                    ? "bg-primary text-primary-foreground border-primary"
                    : isDark
                    ? "bg-muted border-border text-foreground hover:bg-muted/80"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setDefaultTradeType("sell")}
                className={`px-6 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                  defaultTradeType === "sell"
                    ? "bg-primary text-primary-foreground border-primary"
                    : isDark
                    ? "bg-muted border-border text-foreground hover:bg-muted/80"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          {/* Default fee rate */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Default fee rate</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Pre-fill the fee field when logging trades. Set to your exchange's taker fee (e.g. 0.10% for Binance).
            </p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="number"
                  value={defaultFeeRate}
                  onChange={(e) => setDefaultFeeRate(e.target.value)}
                  step="0.01"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                      : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
                  }`}
                />
              </div>
              <span className="text-sm font-semibold text-foreground">%</span>
              <div className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? "bg-muted border-border" : "bg-slate-50 border-slate-200"}`}>
                <p className="text-xs text-muted-foreground">ON $1,000 TRADE</p>
                <p className="text-sm font-semibold text-foreground">${(parseFloat(defaultFeeRate) * 10).toFixed(2)} fee</p>
              </div>
            </div>
          </div>

          {/* Confirm before saving */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Confirm before saving trade</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Show a summary confirmation step before a trade is saved to the log
              </p>
            </div>
            <button
              onClick={() => setConfirmBeforeSaving(!confirmBeforeSaving)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                confirmBeforeSaving ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  confirmBeforeSaving ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Default date */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Default date on new trade</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              What date to pre-fill when opening the log trade form
            </p>
            <select
              value={defaultDate}
              onChange={(e) => setDefaultDate(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-week">Last week</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Feedback Settings */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          AI Feedback Settings
        </h3>

        <div className="space-y-6">
          {/* AI feedback tone */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">AI feedback tone</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              How direct Claude should be when analysing your journal. This is injected as a system prompt modifier.
            </p>
            <div className="space-y-3">
              {[
                { value: "brutally-honest", label: "Brutally honest", desc: "No softening. Hard truths only." },
                { value: "direct-but-kind", label: "Direct but kind", desc: "Honest with constructive framing." },
                { value: "encouraging", label: "Encouraging", desc: "Focuses on strengths and growth." },
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-tone"
                    value={option.value}
                    checked={feedbackTone === option.value}
                    onChange={(e) => setFeedbackTone(e.target.value)}
                    className="mt-1 w-4 h-4"
                  />
                  <div className={`flex-1 p-3 rounded-lg border transition-colors ${
                    feedbackTone === option.value
                      ? isDark
                        ? "bg-primary/10 border-primary"
                        : "bg-blue-50 border-blue-300"
                      : isDark
                      ? "bg-muted/50 border-border hover:border-primary/50"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}>
                    <p className="text-sm font-semibold text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Auto-generate monthly feedback */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Auto-generate monthly feedback</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Automatically call the Anthropic API at the end of each month and save feedback to your journal
              </p>
            </div>
            <button
              onClick={() => setAutoGenerateFeedback(!autoGenerateFeedback)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                autoGenerateFeedback ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoGenerateFeedback ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Include trade notes in AI context */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Include trade notes in AI context</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Send your per-trade notes to the AI when generating feedback. More context = better analysis, but notes are sent to Anthropic.
              </p>
            </div>
            <button
              onClick={() => setIncludeTradeNotes(!includeTradeNotes)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                includeTradeNotes ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  includeTradeNotes ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* AI context window */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">AI context window</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              How many months of trade history to include when generating feedback. More history gives broader patterns.
            </p>
            <select
              value={aiContextWindow}
              onChange={(e) => setAiContextWindow(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option value="1-month">Last 1 month</option>
              <option value="3-months">Last 3 months</option>
              <option value="6-months">Last 6 months</option>
              <option value="1-year">Last 1 year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display & Numbers */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          Display & Numbers
        </h3>

        <div className="space-y-6">
          {/* P&L display format */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">P&L display format</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              How profit and loss values are shown throughout the app
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "$420", label: "$420" },
                { value: "+14.2%", label: "+14.2%" },
                { value: "both", label: "Both" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPnlDisplayFormat(option.value)}
                  className={`px-6 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                    pnlDisplayFormat === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : isDark
                      ? "bg-muted border-border text-foreground hover:bg-muted/80"
                      : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Decimal places */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Number of decimal places</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              For coin quantities and prices in the trade log and portfolio
            </p>
            <select
              value={decimalPlaces}
              onChange={(e) => setDecimalPlaces(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option value="2">2 decimal places</option>
              <option value="4">4 decimal places</option>
              <option value="6">6 decimal places</option>
              <option value="8">8 decimal places</option>
            </select>
          </div>

          {/* Dashboard default period */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Dashboard default period</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              The time range shown by default on the dashboard charts
            </p>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: "7d", label: "7d" },
                { value: "1m", label: "1m" },
                { value: "3m", label: "3m" },
                { value: "all", label: "All" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDashboardPeriod(option.value)}
                  className={`px-6 py-2.5 rounded-lg border font-medium text-sm transition-colors ${
                    dashboardPeriod === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : isDark
                      ? "bg-muted border-border text-foreground hover:bg-muted/80"
                      : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Show unrealized P&L */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Show unrealized P&L on dashboard</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Display open position gains/losses on the main dashboard metric strip
              </p>
            </div>
            <button
              onClick={() => setShowUnrealizedPnL(!showUnrealizedPnL)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                showUnrealizedPnL ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showUnrealizedPnL ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications & Reminders */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          Notifications & Reminders
        </h3>

        <div className="space-y-6">
          {/* Monthly report reminder */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Monthly report reminder</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Email on the 1st of each month prompting you to review last month's trades
              </p>
            </div>
            <button
              onClick={() => setMonthlyReminder(!monthlyReminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                monthlyReminder ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  monthlyReminder ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Untagged trade reminder */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Untagged trade reminder</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Email reminder if you have trades logged in the past 7 days with no emotion tag
              </p>
            </div>
            <button
              onClick={() => setUntaggedReminder(!untaggedReminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                untaggedReminder ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  untaggedReminder ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Weekly summary email */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">Weekly summary email</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Every Sunday — a short digest of your week: trades, P&L, top emotion, and one AI tip
              </p>
            </div>
            <button
              onClick={() => setWeeklySummary(!weeklySummary)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                weeklySummary ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  weeklySummary ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Notification email */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Notification email</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              All reminders go to this address. Leave blank to use your account email.
            </p>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="Defaults to account email"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={handleReset}>
          Reset to defaults
        </Button>
        <Button onClick={handleSave}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}
