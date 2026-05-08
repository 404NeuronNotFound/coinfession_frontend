"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useTradeStore } from "@/stores/tradeStore";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { X, Search } from "lucide-react";
import { searchCoins, createCoin } from "@/api/tradeApi";
import type { CoinSearchResult } from "@/types/tradeTypes";

export function LogLeverageDrawer() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  
  const { drawerOpen, editingTrade, emotionTags: rawEmotionTags, saveTrade, closeDrawer } = useTradeStore();

  // Deduplicate emotion tags by ID (in case of database duplicates)
  const emotionTags = React.useMemo(() => {
    const seen = new Set<number>();
    return rawEmotionTags.filter((tag) => {
      if (seen.has(tag.id)) return false;
      seen.add(tag.id);
      return true;
    });
  }, [rawEmotionTags]);

  // Form state
  const [coinQuery, setCoinQuery] = useState("");
  const [coinResults, setCoinResults] = useState<CoinSearchResult[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinSearchResult | null>(null);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchingCoins, setSearchingCoins] = useState(false);
  
  const [positionType, setPositionType] = useState<"long" | "short">("long");
  const [leverage, setLeverage] = useState<number>(5);
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [collateral, setCollateral] = useState("");
  const [fundingFees, setFundingFees] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [fee, setFee] = useState("");
  const [tradeDate, setTradeDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTrade && (editingTrade.position_type === 'long' || editingTrade.position_type === 'short')) {
      setSelectedCoin({
        id: editingTrade.coin.id,
        coingecko_id: editingTrade.coin.coingecko_id,
        symbol: editingTrade.coin.symbol,
        name: editingTrade.coin.name,
      });
      setCoinQuery(`${editingTrade.coin.symbol} - ${editingTrade.coin.name}`);
      setPositionType(editingTrade.position_type);
      setLeverage(editingTrade.leverage || 5);
      setEntryPrice(editingTrade.entry_price ? String(editingTrade.entry_price) : "");
      setExitPrice(editingTrade.exit_price ? String(editingTrade.exit_price) : "");
      setCollateral(editingTrade.collateral ? String(editingTrade.collateral) : "");
      setFundingFees(editingTrade.funding_fees ? String(editingTrade.funding_fees) : "0");
      setIsOpen(editingTrade.is_open);
      setFee(String(editingTrade.fee));
      setTradeDate(editingTrade.trade_date.split("T")[0]);
      setCloseDate(editingTrade.close_date ? editingTrade.close_date.split("T")[0] : "");
      setNotes(editingTrade.notes || "");
      setSelectedEmotions(editingTrade.emotions.map(e => e.emotion_tag.id));
    } else if (drawerOpen) {
      resetForm();
      const today = new Date().toISOString().split("T")[0];
      setTradeDate(today);
    }
  }, [editingTrade, drawerOpen]);

  const resetForm = () => {
    setCoinQuery("");
    setCoinResults([]);
    setSelectedCoin(null);
    setShowCoinDropdown(false);
    setPositionType("long");
    setLeverage(5);
    setEntryPrice("");
    setExitPrice("");
    setCollateral("");
    setFundingFees("");
    setIsOpen(true);
    setFee("");
    setTradeDate("");
    setCloseDate("");
    setNotes("");
    setSelectedEmotions([]);
    setErrors({});
  };

  // Debounced coin search
  const handleCoinSearch = useCallback(async (query: string) => {
    setCoinQuery(query);
    
    if (query.length < 2) {
      setCoinResults([]);
      setShowCoinDropdown(false);
      return;
    }

    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(async () => {
      setSearchingCoins(true);
      try {
        const results = await searchCoins(query);
        setCoinResults(results);
        setShowCoinDropdown(true);
      } catch (error) {
        console.error("Failed to search coins:", error);
        setCoinResults([]);
      } finally {
        setSearchingCoins(false);
      }
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const handleCoinSelect = (coin: CoinSearchResult) => {
    setSelectedCoin(coin);
    setCoinQuery(`${coin.symbol} - ${coin.name}`);
    setShowCoinDropdown(false);
    setCoinResults([]);
  };

  const toggleEmotion = (emotionId: number) => {
    setSelectedEmotions(prev =>
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  // Calculate derived values
  const positionSize = parseFloat(collateral || "0") * leverage;
  const quantity = parseFloat(entryPrice || "0") > 0 
    ? positionSize / parseFloat(entryPrice) 
    : 0;
  const liquidationPrice = parseFloat(entryPrice || "0") > 0 && leverage > 0
    ? parseFloat(entryPrice) * (positionType === 'long' ? (1 - 1 / leverage) : (1 + 1 / leverage))
    : 0;

  // Calculate P&L preview
  const calculatePnL = () => {
    if (isOpen || !entryPrice || !exitPrice || !collateral) return null;
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = quantity;
    const feeVal = parseFloat(fee || "0");
    const fundingVal = parseFloat(fundingFees || "0");
    
    const gross = positionType === 'long' 
      ? (exit - entry) * qty 
      : (entry - exit) * qty;
    const pnl = gross - feeVal - fundingVal;
    const roi = (pnl / parseFloat(collateral)) * 100;
    
    return { pnl, roi };
  };

  const pnlData = calculatePnL();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!selectedCoin) {
      newErrors.coin = "Please select a coin";
    }
    if (!entryPrice || parseFloat(entryPrice) <= 0) {
      newErrors.entry_price = "Entry price is required and must be greater than 0";
    }
    if (!collateral || parseFloat(collateral) <= 0) {
      newErrors.collateral = "Collateral is required and must be greater than 0";
    }
    if (!leverage || leverage < 1 || leverage > 125) {
      newErrors.leverage = "Leverage must be between 1 and 125";
    }
    if (!isOpen && (!exitPrice || parseFloat(exitPrice) <= 0)) {
      newErrors.exit_price = "Exit price is required when closing a position";
    }
    if (!tradeDate) {
      newErrors.trade_date = "Trade date is required";
    }
    if (selectedEmotions.length === 0) {
      newErrors.emotions = "Please select at least one emotion tag";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      let coinId = selectedCoin!.id;
      
      // If coin doesn't exist in database, create it first
      if (!coinId && !editingTrade) {
        try {
          const newCoin = await createCoin(
            selectedCoin!.coingecko_id,
            selectedCoin!.symbol,
            selectedCoin!.name
          );
          coinId = newCoin.id;
        } catch (coinError: any) {
          console.error("Failed to create coin:", coinError);
          setErrors({ 
            coin: "Failed to add this coin to the database." 
          });
          setIsSaving(false);
          return;
        }
      }

      const payload: any = {
        coin_id: coinId!,
        trade_type: positionType === 'long' ? 'buy' : 'sell', // Map position_type to trade_type
        position_type: positionType,
        quantity: 0, // Placeholder - backend will auto-calculate for long/short
        leverage: leverage,
        entry_price: parseFloat(entryPrice),
        exit_price: !isOpen && exitPrice ? parseFloat(exitPrice) : null,
        collateral: parseFloat(collateral),
        funding_fees: fundingFees ? parseFloat(fundingFees) : 0,
        fee: fee ? parseFloat(fee) : 0,
        is_open: isOpen,
        trade_date: new Date(tradeDate).toISOString(),
        close_date: !isOpen && closeDate ? new Date(closeDate).toISOString() : null,
        notes: notes,
        emotion_tag_ids: selectedEmotions,
      };

      await saveTrade(payload);
      
      // Reload both open positions and trades to ensure UI updates properly
      const { loadOpenPositions, loadTrades } = useTradeStore.getState();
      await Promise.all([
        loadOpenPositions(),
        loadTrades()
      ]);
      
      closeDrawer();
    } catch (error: any) {
      if (error?.response?.data) {
        // Backend validation errors
        const backendErrors = error.response.data;
        const formattedErrors: Record<string, string> = {};
        
        // Convert backend error format to form error format
        Object.keys(backendErrors).forEach((key) => {
          const errorValue = backendErrors[key];
          if (Array.isArray(errorValue)) {
            formattedErrors[key] = errorValue[0];
          } else if (typeof errorValue === 'string') {
            formattedErrors[key] = errorValue;
          } else {
            formattedErrors[key] = JSON.stringify(errorValue);
          }
        });
        
        setErrors(formattedErrors);
      } else if (error?.fieldErrors) {
        setErrors(error.fieldErrors);
      } else if (error?.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Failed to save position. Please check all fields and try again." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!drawerOpen) return null;
  
  // Only show this drawer for long/short positions
  if (editingTrade && editingTrade.position_type === 'spot') return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] overflow-y-auto">
        <div className={`min-h-full ${
          isDark ? "bg-background border-l border-border" : "bg-white border-l border-slate-200"
        }`}>
          {/* Header */}
          <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            isDark ? "bg-background border-border" : "bg-white border-slate-200"
          }`}>
            <h2 className="text-xl font-black text-foreground">
              {editingTrade ? "Edit Position" : "Log Leverage Position"}
            </h2>
            <button
              onClick={closeDrawer}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            {/* Coin Search */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Coin <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <Input
                    placeholder="Search coin (e.g., Bitcoin, BTC)"
                    value={coinQuery}
                    onChange={(e) => handleCoinSearch(e.target.value)}
                    onFocus={() => coinResults.length > 0 && setShowCoinDropdown(true)}
                    className={`${errors.coin ? "border-destructive" : ""}`}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                
                {showCoinDropdown && (
                  <div className={`absolute z-20 w-full mt-1 rounded-md border shadow-lg max-h-60 overflow-y-auto ${
                    isDark ? "bg-background border-border" : "bg-white border-slate-200"
                  }`}>
                    {searchingCoins ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        Searching...
                      </div>
                    ) : coinResults.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        No coins found
                      </div>
                    ) : (
                      coinResults.map((coin, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleCoinSelect(coin)}
                          className={`w-full text-left p-3 hover:bg-muted/50 transition-colors border-b last:border-b-0 cursor-pointer ${
                            isDark ? "border-border" : "border-slate-200"
                          }`}
                        >
                          <div className="font-medium text-sm text-foreground">
                            {coin.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">{coin.name}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedCoin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Fetched from CoinGecko
                </p>
              )}
              {errors.coin && (
                <p className="text-xs text-destructive mt-1">{errors.coin}</p>
              )}
            </div>

            {/* Position Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Position Type <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={positionType === "long" ? "default" : "outline"}
                  onClick={() => setPositionType("long")}
                  className="flex-1 cursor-pointer"
                >
                  Long
                </Button>
                <Button
                  type="button"
                  variant={positionType === "short" ? "default" : "outline"}
                  onClick={() => setPositionType("short")}
                  className="flex-1 cursor-pointer"
                >
                  Short
                </Button>
              </div>
            </div>

            {/* Entry Price */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Entry Price (USD) <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className={`${errors.entry_price ? "border-destructive" : ""}`}
              />
              {errors.entry_price && (
                <p className="text-xs text-destructive mt-1">{errors.entry_price}</p>
              )}
            </div>

            {/* Position Still Open Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-open"
                checked={isOpen}
                onChange={(e) => {
                  setIsOpen(e.target.checked);
                  if (e.target.checked) {
                    setExitPrice("");
                    setCloseDate("");
                  }
                }}
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
              <label htmlFor="is-open" className="text-sm font-medium text-foreground cursor-pointer">
                Position still open
              </label>
            </div>

            {/* Exit Price */}
            {!isOpen && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Exit Price (USD) <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className={`${errors.exit_price ? "border-destructive" : ""}`}
                />
                {errors.exit_price && (
                  <p className="text-xs text-destructive mt-1">{errors.exit_price}</p>
                )}
              </div>
            )}

            {/* Collateral */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Collateral (Your Investment) USD <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                className={`${errors.collateral ? "border-destructive" : ""}`}
              />
              {errors.collateral && (
                <p className="text-xs text-destructive mt-1">{errors.collateral}</p>
              )}
            </div>

            {/* Leverage Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Leverage <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[2, 5, 10, 20, 50, 100].map((lev) => (
                  <Button
                    key={lev}
                    type="button"
                    variant={leverage === lev ? "default" : "outline"}
                    onClick={() => setLeverage(lev)}
                    size="sm"
                    className="cursor-pointer"
                  >
                    {lev}x
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="125"
                placeholder="Custom leverage (1-125)"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value) || 1)}
                className={`${errors.leverage ? "border-destructive" : ""}`}
              />
              {errors.leverage && (
                <p className="text-xs text-destructive mt-1">{errors.leverage}</p>
              )}
            </div>

            {/* Position Size (Display Only) */}
            <div className="p-3 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground mb-1">Position Size</div>
              <div className="text-lg font-black text-foreground">
                ${positionSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Collateral × Leverage
              </div>
            </div>

            {/* Quantity (Display Only) */}
            <div className="p-3 rounded-md bg-muted">
              <div className="text-xs text-muted-foreground mb-1">
                Quantity (auto-calculated)
              </div>
              <div className="text-lg font-black text-foreground">
                {quantity > 0 ? quantity.toFixed(6) : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Position Size ÷ Entry Price
              </div>
            </div>

            {/* Liquidation Price (Display Only) */}
            {liquidationPrice > 0 && (
              <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="text-xs text-muted-foreground mb-1">
                  ⚠️ Liquidation Price
                </div>
                <div className="text-lg font-black text-amber-800 dark:text-amber-200">
                  ${liquidationPrice.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Distance: {((1 / leverage) * 100).toFixed(1)}%{" "}
                  {positionType === 'long' ? 'below' : 'above'} entry
                </div>
              </div>
            )}

            {/* Funding Fees */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Funding Fees (USD)
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={fundingFees}
                onChange={(e) => setFundingFees(e.target.value)}
                className=""
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Trading Fee (USD)
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className=""
              />
            </div>

            {/* Trade Date */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Trade Date <span className="text-destructive">*</span>
              </label>
              <Input
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                className={`[color-scheme:light] cursor-pointer ${errors.trade_date ? "border-destructive" : ""}`}
              />
              {errors.trade_date && (
                <p className="text-xs text-destructive mt-1">{errors.trade_date}</p>
              )}
            </div>

            {/* Close Date (if not open) */}
            {!isOpen && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Close Date
                </label>
                <Input
                  type="date"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="[color-scheme:light] cursor-pointer"
                />
              </div>
            )}

            {/* P&L Preview */}
            {pnlData && (
              <div className={`p-3 rounded-md border ${
                pnlData.pnl >= 0 
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" 
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
              }`}>
                <div className="text-xs font-semibold text-muted-foreground mb-1">
                  Realized P&L Preview
                </div>
                <div className={`text-lg font-black ${
                  pnlData.pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {pnlData.pnl >= 0 ? "+" : ""}${Math.abs(pnlData.pnl).toFixed(2)} ({pnlData.roi >= 0 ? "+" : ""}{pnlData.roi.toFixed(1)}%)
                </div>
              </div>
            )}

            {isOpen && (
              <div className="p-3 rounded-md bg-muted">
                <div className="text-sm text-muted-foreground text-center">
                  Open position — P&L calculated on close
                </div>
              </div>
            )}

            {/* Emotion Tags */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Emotion Tags <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedEmotions.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEmotion(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              {errors.emotions && (
                <p className="text-xs text-destructive mt-1">{errors.emotions}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Notes
              </label>
              <textarea
                placeholder="Add notes about this position..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 rounded-md border text-sm resize-none cursor-text ${
                  isDark 
                    ? "bg-background border-border text-foreground placeholder:text-muted-foreground" 
                    : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                }`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeDrawer}
                disabled={isSaving}
                className="flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 cursor-pointer"
              >
                {isSaving ? "Saving..." : editingTrade ? "Update Position" : "Log Position"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
