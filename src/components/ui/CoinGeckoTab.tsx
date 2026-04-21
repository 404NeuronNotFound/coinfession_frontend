"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";
import { Activity, RefreshCw } from "lucide-react";

interface SyncHistory {
  date: string;
  time: string;
  coins: number;
  change: string;
  status: "success" | "retried" | "failed";
}

interface WatchedCoin {
  id: string;
  name: string;
  symbol: string;
  color: string;
  status: "in-portfolio" | "trade-history-only";
}

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

const MOCK_SYNC_HISTORY: SyncHistory[] = [
  {
    date: "Apr 18, 2026",
    time: "00:01 AM",
    coins: 15240,
    change: "+12 added",
    status: "success",
  },
  {
    date: "Apr 17, 2026",
    time: "00:01 AM",
    coins: 15228,
    change: "-5 added",
    status: "success",
  },
  {
    date: "Apr 16, 2026",
    time: "00:01 AM",
    coins: 15223,
    change: "Rate limit hit",
    status: "retried",
  },
  {
    date: "Apr 15, 2026",
    time: "00:01 AM",
    coins: 15223,
    change: "+8 added",
    status: "success",
  },
];

const MOCK_WATCHED_COINS: WatchedCoin[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "bitcoin", color: "#F7931A", status: "in-portfolio" },
  { id: "ethereum", name: "Ethereum", symbol: "ethereum", color: "#627EEA", status: "in-portfolio" },
  { id: "solana", name: "Solana", symbol: "solana", color: "#9945FF", status: "in-portfolio" },
  { id: "avalanche", name: "Avalanche", symbol: "avalanche-2", color: "#E84142", status: "in-portfolio" },
  { id: "dogecoin", name: "Dogecoin", symbol: "dogecoin", color: "#C2A633", status: "trade-history-only" },
];

const MOCK_ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/coins/list", description: "Full coin list - used by sync command" },
  { method: "GET", path: "/simple/price", description: "Live price fetch - portfolio refresh" },
  { method: "GET", path: "/search", description: "Coin search - trade log entry" },
  { method: "GET", path: "/coins/{id}", description: "Coin detail - add coin to DB" },
  { method: "GET", path: "/ping", description: "Connection health check" },
];

export default function CoinGeckoTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const [autoRefreshInterval, setAutoRefreshInterval] = useState("5");
  const [refreshOnFocus, setRefreshOnFocus] = useState(true);
  const [cacheDuration, setCacheDuration] = useState("60");
  const [autoSyncSchedule, setAutoSyncSchedule] = useState("midnight");

  const handlePingNow = () => {
    console.log("Pinging CoinGecko API");
  };

  const handleSyncNow = () => {
    console.log("Syncing coin list now");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">CoinGecko</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Live price data, coin search, and portfolio valuation. All CoinGecko calls are proxied through your backend — your API key is never exposed to the browser.
        </p>
      </div>

      {/* Connection Status */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-inherit">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Connection Status</h3>
          <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
            ● Connected · Demo plan
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
            <p className="text-xs text-muted-foreground mb-1">Coins in database</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">15,240</p>
          </div>
          <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
            <p className="text-xs text-muted-foreground mb-1">Req/min used</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">18</p>
          </div>
          <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
            <p className="text-xs text-muted-foreground mb-1">Rate limit</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">30</p>
          </div>
          <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
            <p className="text-xs text-muted-foreground mb-1">Calls today</p>
            <p className="text-lg sm:text-xl font-semibold text-foreground">2,140</p>
          </div>
        </div>

        {/* Rate Limit Usage */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Rate limit usage</span>
            <span className="text-sm font-semibold text-foreground">18 / 30 req/min</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-muted" : "bg-slate-200"}`}>
            <div className="h-full bg-green-600" style={{ width: "60%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Resets every 60 seconds · Demo plan</p>
        </div>

        {/* Test Connection */}
        <div className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
          <h4 className="text-sm font-semibold text-foreground mb-2">Test connection</h4>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4">
            Pings the CoinGecko API to verify your key is valid and measure response time
          </p>
          <Button onClick={handlePingNow} className="gap-2">
            <Activity className="w-4 h-4" />
            Ping now
          </Button>
        </div>
      </div>

      {/* Price Refresh Settings */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">Price Refresh Settings</h3>

        <div className="space-y-6">
          {/* Auto-refresh Interval */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Auto-refresh interval</label>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              How often live prices are fetched on the Portfolio page. Lower intervals use more of your rate limit.
            </p>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option>Every 5 minutes</option>
              <option>Every 10 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every 30 minutes</option>
              <option>Every 1 hour</option>
            </select>
          </div>

          {/* Refresh on Page Focus */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Refresh on page focus</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Re-fetch prices when you switch back to the portfolio tab after being away
              </p>
            </div>
            <button
              onClick={() => setRefreshOnFocus(!refreshOnFocus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                refreshOnFocus ? "bg-green-600" : isDark ? "bg-muted" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  refreshOnFocus ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Cache Duration */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Cache duration</label>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              How long price data is cached server-side before a fresh fetch is triggered. Higher = fewer API calls.
            </p>
            <select
              value={cacheDuration}
              onChange={(e) => setCacheDuration(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option>30 seconds</option>
              <option>60 seconds</option>
              <option>2 minutes</option>
              <option>5 minutes</option>
              <option>10 minutes</option>
            </select>
          </div>

          {/* Estimated Usage */}
          <div className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
            <h4 className="text-sm font-semibold text-foreground mb-4">Estimated daily API usage at current settings</h4>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Est. calls/day</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">288</p>
              </div>
              <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Est. calls/month</p>
                <p className="text-lg sm:text-xl font-semibold text-foreground">8,640</p>
              </div>
              <div className={`rounded p-3 sm:p-4 ${isDark ? "bg-background" : "bg-white"}`}>
                <p className="text-xs text-muted-foreground mb-1">Rate pressure</p>
                <p className="text-lg sm:text-xl font-semibold text-green-600">Low</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coin List Sync */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">Coin List Sync</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">Last synced: Apr 18, 2026 · 15:40 · 15,240 coins</p>

        <div className="space-y-6">
          {/* Auto-sync Schedule */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Auto-sync schedule</label>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              Automatically run fetch_coins management command to keep the coin database current
            </p>
            <select
              value={autoSyncSchedule}
              onChange={(e) => setAutoSyncSchedule(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                isDark
                  ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                  : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
              }`}
            >
              <option value="midnight">Daily at midnight</option>
              <option value="6am">Daily at 6 AM</option>
              <option value="noon">Daily at noon</option>
              <option value="6pm">Daily at 6 PM</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Manual Sync */}
          <div className={`rounded-lg p-4 sm:p-6 border ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
            <h4 className="text-sm font-semibold text-foreground mb-2">Manual sync</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              Fetch the full coin list from CoinGecko now and update the local database. Takes 10-30 seconds.
            </p>
            <Button onClick={handleSyncNow} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync now
            </Button>
          </div>

          {/* Sync History */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Sync History</h4>
            <div className="space-y-2">
              {MOCK_SYNC_HISTORY.map((sync, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                    isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        sync.status === "success"
                          ? "bg-green-600"
                          : sync.status === "retried"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-foreground">
                        {sync.date} · {sync.time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sync.coins} coins · {sync.change}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      sync.status === "success"
                        ? "text-green-600"
                        : sync.status === "retried"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {sync.status === "success" ? "Success" : sync.status === "retried" ? "Retried" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Watched Coins */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Watched Coins</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Coins currently in your portfolio or trade history. These are pre-fetched on every price refresh cycle to keep your data fast.
        </p>

        <div className="space-y-2">
          {MOCK_WATCHED_COINS.map((coin) => (
            <div
              key={coin.id}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: coin.color }}
                >
                  {coin.name[0]}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">{coin.name}</p>
                  <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  coin.status === "in-portfolio"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {coin.status === "in-portfolio" ? "In portfolio" : "Trade history only"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Endpoints in Use</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          These are the CoinGecko endpoints your backend calls. All requests go through <span className="font-mono">api/v3</span> — proxied server-side.
        </p>

        <div className="space-y-2">
          {MOCK_ENDPOINTS.map((endpoint, idx) => (
            <div
              key={idx}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                  {endpoint.method}
                </span>
                <span className="text-xs sm:text-sm font-mono text-foreground">{endpoint.path}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-right">{endpoint.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
