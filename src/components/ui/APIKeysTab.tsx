"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAPIKeyStore } from "@/stores/apiKeyStore";
import { Button } from "./button";
import { Copy, Eye, EyeOff, Trash2, RotateCw, Loader2 } from "lucide-react";

export default function APIKeysTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  
  const {
    keys,
    loading,
    saving,
    deletingProvider,
    pingingProvider,
    pingResults,
    saveResponse,
    errors,
    loadKeys,
    saveKey,
    deleteKey,
    pingKey,
    clearSaveResponse,
    clearErrors,
  } = useAPIKeyStore();

  const [anthropicInput, setAnthropicInput] = useState("");
  const [coingeckoInput, setCoingeckoInput] = useState("");
  const [showAnthropicRotate, setShowAnthropicRotate] = useState(false);
  const [showCoingeckoRotate, setShowCoingeckoRotate] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const anthropicKey = keys.find((k) => k.provider === "anthropic");
  const coingeckoKey = keys.find((k) => k.provider === "coingecko");

  const handleCopy = async (text: string, keyType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyType);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSaveAnthropic = async () => {
    if (!anthropicInput.trim()) return;
    await saveKey({ provider: "anthropic", key: anthropicInput });
    setAnthropicInput("");
    setShowAnthropicRotate(false);
  };

  const handleSaveCoingecko = async () => {
    if (!coingeckoInput.trim()) return;
    await saveKey({ provider: "coingecko", key: coingeckoInput });
    setCoingeckoInput("");
    setShowCoingeckoRotate(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getMaskedKey = (provider: string, suffix: string) => {
    if (provider === "anthropic") {
      return `sk-ant-api03-${"•".repeat(40)}${suffix}`;
    }
    return `CG-${"•".repeat(30)}${suffix}`;
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Anthropic Key Card */}
          <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-inherit">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: "#a78bfa" }}
                >
                  A
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Anthropic — Claude API</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Powers AI feedback generation on your trade journal. Used when you click 'Generate feedback' on the AI Feedback page.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    anthropicKey
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {anthropicKey ? "● Connected" : "NOT CONNECTED"}
                </span>
              </div>
            </div>

            {anthropicKey ? (
              <div className="space-y-6">
                {/* One-time full key display */}
                {saveResponse?.provider === "anthropic" && saveResponse.full_key && (
                  <div className={`rounded-lg p-4 border ${isDark ? "bg-yellow-950/20 border-yellow-700/30" : "bg-yellow-50 border-yellow-200"}`}>
                    <p className={`text-sm font-semibold mb-2 ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                      {saveResponse.warning}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={saveResponse.full_key}
                        readOnly
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono ${
                          isDark
                            ? "bg-background border-border text-foreground"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(saveResponse.full_key, "anthropic-full")}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedKey === "anthropic-full" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSaveResponse}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Preview */}
                {!showAnthropicRotate && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="text"
                        value={getMaskedKey("anthropic", anthropicKey.key_suffix)}
                        readOnly
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono ${
                          isDark
                            ? "bg-muted border-border text-foreground"
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Last used</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {formatDate(anthropicKey.last_used)}
                        </p>
                      </div>
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Added</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {formatDate(anthropicKey.created_at)}
                        </p>
                      </div>
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Plan</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {anthropicKey.plan}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-inherit">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAnthropicRotate(true)}
                        className="gap-2"
                      >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteKey("anthropic")}
                        disabled={deletingProvider === "anthropic"}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        {deletingProvider === "anthropic" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Remove
                      </Button>
                    </div>
                  </>
                )}

                {/* Rotate Form */}
                {showAnthropicRotate && (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="password"
                        placeholder="Paste new Anthropic API key..."
                        value={anthropicInput}
                        onChange={(e) => setAnthropicInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                          isDark
                            ? "bg-background border-border text-foreground"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      {errors.key && (
                        <p className="text-sm text-red-600 mt-1">{errors.key[0]}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveAnthropic}
                        disabled={saving || !anthropicInput.trim()}
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAnthropicRotate(false);
                          setAnthropicInput("");
                          clearErrors();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-lg p-6 border ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
                    ?
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-red-200" : "text-red-900"}`}>
                      Anthropic — Not set
                    </h4>
                    <p className={`text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
                      Powers AI feedback generation. Add your key to enable AI analysis.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <input
                      type="password"
                      placeholder="Paste your Anthropic API key here..."
                      value={anthropicInput}
                      onChange={(e) => setAnthropicInput(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        isDark
                          ? "bg-background border-border text-foreground"
                          : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                    {errors.key && (
                      <p className="text-sm text-red-600 mt-1">{errors.key[0]}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleSaveAnthropic}
                    disabled={saving || !anthropicInput.trim()}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save key
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* CoinGecko Key Card */}
          <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-inherit">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: "#10b981" }}
                >
                  C
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">CoinGecko — Market data</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Fetches live coin prices, portfolio values, and the full coin list. Upgrade to Pro for 500 req/min and faster refresh.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    coingeckoKey
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {coingeckoKey ? "● Connected" : "NOT CONNECTED"}
                </span>
                {coingeckoKey && (
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                    coingeckoKey.plan === "demo"
                      ? isDark ? "bg-yellow-900/50 text-yellow-200" : "bg-yellow-100 text-yellow-700"
                      : isDark ? "bg-green-900/50 text-green-200" : "bg-green-100 text-green-700"
                  }`}>
                    {coingeckoKey.plan === "demo" ? "Demo" : coingeckoKey.plan === "pro" ? "Pro" : coingeckoKey.plan}
                  </span>
                )}
              </div>
            </div>

            {coingeckoKey ? (
              <div className="space-y-6">
                {/* One-time full key display */}
                {saveResponse?.provider === "coingecko" && saveResponse.full_key && (
                  <div className={`rounded-lg p-4 border ${isDark ? "bg-yellow-950/20 border-yellow-700/30" : "bg-yellow-50 border-yellow-200"}`}>
                    <p className={`text-sm font-semibold mb-2 ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                      {saveResponse.warning}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={saveResponse.full_key}
                        readOnly
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono ${
                          isDark
                            ? "bg-background border-border text-foreground"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(saveResponse.full_key, "coingecko-full")}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedKey === "coingecko-full" ? "Copied!" : "Copy"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearSaveResponse}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Preview */}
                {!showCoingeckoRotate && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="text"
                        value={getMaskedKey("coingecko", coingeckoKey.key_suffix)}
                        readOnly
                        className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-mono ${
                          isDark
                            ? "bg-muted border-border text-foreground"
                            : "bg-slate-50 border-slate-200 text-slate-900"
                        }`}
                      />
                    </div>

                    {/* Ping Result */}
                    {pingResults["coingecko"] && (
                      <div className={`rounded-lg p-4 border ${
                        pingResults["coingecko"].ok
                          ? isDark ? "bg-green-950/20 border-green-700/30" : "bg-green-50 border-green-200"
                          : isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"
                      }`}>
                        <p className={`text-sm ${
                          pingResults["coingecko"].ok
                            ? isDark ? "text-green-200" : "text-green-800"
                            : isDark ? "text-red-200" : "text-red-800"
                        }`}>
                          {pingResults["coingecko"].ok
                            ? `✓ Connected · ${pingResults["coingecko"].latency_ms}ms`
                            : `✕ ${pingResults["coingecko"].error}`}
                        </p>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Last used</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {formatDate(coingeckoKey.last_used)}
                        </p>
                      </div>
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Added</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {formatDate(coingeckoKey.created_at)}
                        </p>
                      </div>
                      <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
                        <p className="text-xs text-muted-foreground mb-1">Plan</p>
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                          {coingeckoKey.plan}
                        </p>
                      </div>
                    </div>

                    {/* Demo Plan Warning */}
                    {coingeckoKey.plan === "demo" && (
                      <div className={`rounded-lg p-4 border ${isDark ? "bg-yellow-950/20 border-yellow-700/30" : "bg-yellow-50 border-yellow-200"}`}>
                        <p className={`text-sm ${isDark ? "text-yellow-200" : "text-yellow-800"}`}>
                          On Demo plan — consider upgrading. Demo keys are rate-limited to 30 calls/min. With multiple users or frequent refreshes you may hit this limit. Pro keys start at $129/month and give 500 calls/min.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-inherit">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pingKey("coingecko")}
                        disabled={pingingProvider === "coingecko"}
                        className="gap-2"
                      >
                        {pingingProvider === "coingecko" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Test Connection"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCoingeckoRotate(true)}
                        className="gap-2"
                      >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteKey("coingecko")}
                        disabled={deletingProvider === "coingecko"}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        {deletingProvider === "coingecko" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Remove
                      </Button>
                    </div>
                  </>
                )}

                {/* Rotate Form */}
                {showCoingeckoRotate && (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="password"
                        placeholder="Paste new CoinGecko API key..."
                        value={coingeckoInput}
                        onChange={(e) => setCoingeckoInput(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                          isDark
                            ? "bg-background border-border text-foreground"
                            : "bg-white border-slate-200 text-slate-900"
                        }`}
                      />
                      {errors.key && (
                        <p className="text-sm text-red-600 mt-1">{errors.key[0]}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveCoingecko}
                        disabled={saving || !coingeckoInput.trim()}
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCoingeckoRotate(false);
                          setCoingeckoInput("");
                          clearErrors();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`rounded-lg p-6 border ${isDark ? "bg-red-950/20 border-red-700/30" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-100 text-red-700"}`}>
                    ?
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isDark ? "text-red-200" : "text-red-900"}`}>
                      CoinGecko — Not set
                    </h4>
                    <p className={`text-sm ${isDark ? "text-red-300" : "text-red-800"}`}>
                      Fetches live coin prices and portfolio values. Add your key to enable price data.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <input
                      type="password"
                      placeholder="Paste your CoinGecko API key here..."
                      value={coingeckoInput}
                      onChange={(e) => setCoingeckoInput(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        isDark
                          ? "bg-background border-border text-foreground"
                          : "bg-white border-slate-200 text-slate-900"
                      }`}
                    />
                    {errors.key && (
                      <p className="text-sm text-red-600 mt-1">{errors.key[0]}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleSaveCoingecko}
                    disabled={saving || !coingeckoInput.trim()}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save key
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

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
