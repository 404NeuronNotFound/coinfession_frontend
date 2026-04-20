"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";
import { Copy, Eye, EyeOff, Trash2, RotateCw } from "lucide-react";

interface APIKey {
  id: string;
  name: string;
  provider: string;
  description: string;
  keyPreview: string;
  status: "connected" | "not-connected";
  plan?: string;
  usage?: {
    current: number;
    limit: number;
    unit: string;
    resetDate?: string;
  };
  stats?: {
    callsThisMonth: number;
    lastUsed: string;
    dateAdded: string;
  };
  warning?: string;
  color: string;
}

interface APIKeysTabProps {
  keys?: APIKey[];
}

const MOCK_KEYS: APIKey[] = [
  {
    id: "1",
    name: "Anthropic",
    provider: "Anthropic — Claude API",
    description: "Powers AI feedback generation on your trade journal. Used when you click 'Generate feedback' on the AI Feedback page.",
    keyPreview: "sk-ant-api03-****",
    status: "connected",
    usage: {
      current: 12,
      limit: 100,
      unit: "calls",
      resetDate: "May 1",
    },
    stats: {
      callsThisMonth: 12,
      lastUsed: "Apr 15",
      dateAdded: "Jan 2026",
    },
    color: "#a78bfa",
  },
  {
    id: "2",
    name: "CoinGecko",
    provider: "CoinGecko — Market data",
    description: "Fetches live coin prices, portfolio values, and the full coin list. Upgrade to Pro for 500 req/min and faster refresh.",
    keyPreview: "CG-demo-•••••••••",
    status: "connected",
    plan: "Demo plan",
    usage: {
      current: 18,
      limit: 30,
      unit: "req/min",
      resetDate: "every 60 seconds",
    },
    stats: {
      callsThisMonth: 2140,
      lastUsed: "Now",
      dateAdded: "Jan 2026",
    },
    warning: "On Demo plan — consider upgrading. Demo keys are rate-limited to 30 calls/min. With multiple users or frequent refreshes you may hit this limit. Pro keys start at $129/month and give 500 calls/min.",
    color: "#10b981",
  },
  {
    id: "3",
    name: "Additional integration",
    provider: "Additional integration",
    description: "This shows how a missing key state looks. The feature that depends on it is disabled until a key is added.",
    keyPreview: "",
    status: "not-connected",
    stats: {
      callsThisMonth: 0,
      lastUsed: "Never",
      dateAdded: "Not set",
    },
    color: "#9ca3af",
  },
];

export default function APIKeysTab({ keys = MOCK_KEYS }: APIKeysTabProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [newKeyInput, setNewKeyInput] = useState("");

  const toggleReveal = (keyId: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId);
    } else {
      newRevealed.add(keyId);
    }
    setRevealedKeys(newRevealed);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRotate = (keyId: string) => {
    console.log("Rotating key:", keyId);
  };

  const handleRemove = (keyId: string) => {
    console.log("Removing key:", keyId);
  };

  const handleSaveKey = () => {
    console.log("Saving key:", newKeyInput);
    setNewKeyInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">API keys</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Your keys are encrypted at rest and never returned in full after saving. Only the last 4 characters are shown.
        </p>
      </div>

      {/* API Key Cards */}
      <div className="space-y-4">
        {keys.map((key) => (
          <div
            key={key.id}
            className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-inherit">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: key.color }}
                >
                  {key.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{key.provider}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{key.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    key.status === "connected"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {key.status === "connected" ? "● Connected" : "NOT CONNECTED"}
                </span>
                {key.plan && (
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${isDark ? "bg-muted text-foreground" : "bg-slate-100 text-slate-700"}`}>
                    {key.plan}
                  </span>
                )}
              </div>
            </div>

            {/* Key Display or Input */}
            {key.status === "connected" ? (
              <div className="space-y-6">
                {/* Key Preview */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text"
                    value={revealedKeys.has(key.id) ? key.keyPreview : key.keyPreview.replace(/[^-]/g, "•")}
                    readOnly
                    className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono transition-colors ${
                      isDark
                        ? "bg-muted border-border text-foreground"
                        : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleReveal(key.id)}
                      className="gap-2"
                    >
                      {revealedKeys.has(key.id) ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Reveal
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(key.keyPreview)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Usage Stats */}
                {key.usage && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">
                          {key.usage.unit === "calls" ? "Monthly usage" : "Rate usage today"}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {key.usage.current} / {key.usage.limit} {key.usage.unit}
                        </span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-muted" : "bg-slate-200"}`}>
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(key.usage.current / key.usage.limit) * 100}%` }}
                        />
                      </div>
                      {key.usage.resetDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Resets {key.usage.resetDate} · {key.usage.limit - key.usage.current} {key.usage.unit} remaining
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                {key.stats && (
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                      <p className="text-xs text-muted-foreground mb-1">Calls this month</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{key.stats.callsThisMonth}</p>
                    </div>
                    <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                      <p className="text-xs text-muted-foreground mb-1">Last used</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{key.stats.lastUsed}</p>
                    </div>
                    <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                      <p className="text-xs text-muted-foreground mb-1">Added</p>
                      <p className="text-lg sm:text-xl font-semibold text-foreground">{key.stats.dateAdded}</p>
                    </div>
                  </div>
                )}

                {/* Warning */}
                {key.warning && (
                  <div className={`rounded-lg p-4 border ${isDark ? "bg-yellow-950/20 border-yellow-700/30" : "bg-yellow-50 border-yellow-200"}`}>
                    <p className={`text-sm ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                      {key.warning}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-inherit">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRotate(key.id)}
                    className="gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Rotate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(key.id)}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`rounded-lg p-6 border ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
                    ?
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-red-200" : "text-red-900"}`}>
                      {key.name} — Not set
                    </h4>
                    <p className={`text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
                      {key.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="password"
                    placeholder="Paste your API key here..."
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    className={`flex-1 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      isDark
                        ? "bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                        : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
                    }`}
                  />
                  <Button onClick={handleSaveKey} className="whitespace-nowrap">
                    Save key
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Security Info */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">How API keys are stored</h3>
        <div className="space-y-4">
          {[
            {
              num: 1,
              title: "Encrypted at rest",
              desc: "Keys are encrypted using AES-256 before being written to the database. The encryption key lives in your server environment, not in the database.",
            },
            {
              num: 2,
              title: "Never returned in full",
              desc: "After saving, only the last 4 characters are ever sent back to the frontend. The full key is never exposed again — not in API responses, logs, or exports.",
            },
            {
              num: 3,
              title: "Used only server-side",
              desc: "Keys are injected into backend requests only. Your frontend never touches them directly — they never appear in browser network requests or localStorage.",
            },
            {
              num: 4,
              title: "Rotate if compromised",
              desc: "If you suspect a key has been leaked, use the Rotate button above to replace it immediately. The old key is deleted from the database on rotation.",
            },
          ].map((item) => (
            <div key={item.num} className="flex gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold shrink-0 ${isDark ? "bg-blue-900/50 text-blue-200" : "bg-blue-100 text-blue-700"}`}>
                {item.num}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
