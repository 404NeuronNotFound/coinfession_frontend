"use client";

import { useState, useEffect, useCallback } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useTradeStore } from "@/stores/tradeStore";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Toast } from "./Toast";
import { X, Search } from "lucide-react";
import { searchCoins, createCoin } from "@/api/tradeApi";
import type { CoinSearchResult } from "@/types/tradeTypes";

export function LogTradeDrawer() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  
  const { drawerOpen, editingTrade, emotionTags, saveTrade, closeDrawer } = useTradeStore();

  // Form state
  const [coinQuery, setCoinQuery] = useState("");
  const [coinResults, setCoinResults] = useState<CoinSearchResult[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinSearchResult | null>(null);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [searchingCoins, setSearchingCoins] = useState(false);
  
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [fee, setFee] = useState("");
  const [tradeDate, setTradeDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<number[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");
  const [showToast, setShowToast] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingTrade) {
      setSelectedCoin({
        id: editingTrade.coin.id,
        coingecko_id: editingTrade.coin.coingecko_id,
        symbol: editingTrade.coin.symbol,
        name: editingTrade.coin.name,
      });
      setCoinQuery(`${editingTrade.coin.symbol} - ${editingTrade.coin.name}`);
      setTradeType(editingTrade.trade_type);
      setQuantity(String(editingTrade.quantity));
      setBuyPrice(editingTrade.buy_price ? String(editingTrade.buy_price) : "");
      setSellPrice(editingTrade.sell_price ? String(editingTrade.sell_price) : "");
      setFee(String(editingTrade.fee));
      setTradeDate(editingTrade.trade_date.split("T")[0]); // Extract YYYY-MM-DD
      setNotes(editingTrade.notes || "");
      setSelectedEmotions(editingTrade.emotions.map(e => e.emotion_tag.id));
    } else {
      // Reset form for new trade
      resetForm();
      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      setTradeDate(today);
    }
  }, [editingTrade, drawerOpen]);

  const resetForm = () => {
    setCoinQuery("");
    setCoinResults([]);
    setSelectedCoin(null);
    setShowCoinDropdown(false);
    setTradeType("buy");
    setQuantity("");
    setBuyPrice("");
    setSellPrice("");
    setFee("");
    setTradeDate("");
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

  // Calculate P&L preview
  const calculatePnL = () => {
    const buy = parseFloat(buyPrice);
    const sell = parseFloat(sellPrice);
    const qty = parseFloat(quantity);
    const feeVal = parseFloat(fee);

    if (!sell || !buy || !qty) return null;
    
    return (sell - buy) * qty - (feeVal || 0);
  };

  const pnl = calculatePnL();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!selectedCoin) {
      newErrors.coin = "Please select a coin";
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }
    if (!tradeDate) {
      newErrors.trade_date = "Trade date is required";
    }
    
    // Trade type specific validation
    if (tradeType === "buy") {
      if (!buyPrice || parseFloat(buyPrice) <= 0) {
        newErrors.buy_price = "Buy price is required for buy trades";
      }
    } else if (tradeType === "sell") {
      if (!buyPrice || parseFloat(buyPrice) <= 0) {
        newErrors.buy_price = "Original buy price is required for sell trades";
      }
      if (!sellPrice || parseFloat(sellPrice) <= 0) {
        newErrors.sell_price = "Sell price is required for sell trades";
      }
    }

    // Emotion tags validation
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
      
      // If coin doesn't exist in database (id is null), create it first
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
            coin: "Failed to add this coin to the database. It may already exist or there was a server error." 
          });
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        coin_id: coinId!,
        trade_type: tradeType,
        quantity: parseFloat(quantity),
        buy_price: buyPrice ? parseFloat(buyPrice) : null,
        sell_price: tradeType === "sell" && sellPrice ? parseFloat(sellPrice) : null,
        fee: fee ? parseFloat(fee) : 0,
        trade_date: new Date(tradeDate).toISOString(),
        notes: notes,
        emotion_tag_ids: selectedEmotions,
      };

      await saveTrade(payload);
      
      // Show success toast
      setToastMessage(editingTrade ? "Trade updated successfully!" : "Trade logged successfully!");
      setToastType("success");
      setShowToast(true);
      
      // Close drawer after a short delay to allow toast to be visible
      setTimeout(() => {
        closeDrawer();
      }, 500);
    } catch (error: any) {
      console.error("Failed to save trade:", error);
      
      // Handle backend validation errors
      if (error?.fieldErrors) {
        setErrors(error.fieldErrors);
      } else if (error?.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Failed to save trade. Please check all fields and try again." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!drawerOpen) return null;

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}

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
              {editingTrade ? "Edit Trade" : "Log New Trade"}
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
                    className={`cursor-pointer ${errors.coin ? "border-destructive" : ""}`}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                
                {/* Dropdown */}
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

            {/* Trade Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Trade Type <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={tradeType === "buy" ? "default" : "outline"}
                  onClick={() => setTradeType("buy")}
                  className="flex-1 cursor-pointer"
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant={tradeType === "sell" ? "default" : "outline"}
                  onClick={() => setTradeType("sell")}
                  className="flex-1 cursor-pointer"
                >
                  Sell
                </Button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Quantity <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`cursor-pointer ${errors.quantity ? "border-destructive" : ""}`}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive mt-1">{errors.quantity}</p>
              )}
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

            {/* Buy Price */}
            {tradeType === "buy" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Buy Price <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className={`cursor-pointer ${errors.buy_price ? "border-destructive" : ""}`}
                />
                {errors.buy_price && (
                  <p className="text-xs text-destructive mt-1">{errors.buy_price}</p>
                )}
              </div>
            )}

            {/* Sell Trade: Show both Buy Price and Sell Price */}
            {tradeType === "sell" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Original Buy Price <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    className={`cursor-pointer ${errors.buy_price ? "border-destructive" : ""}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The price you originally bought at
                  </p>
                  {errors.buy_price && (
                    <p className="text-xs text-destructive mt-1">{errors.buy_price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Sell Price <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className={`cursor-pointer ${errors.sell_price ? "border-destructive" : ""}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The price you're selling at
                  </p>
                  {errors.sell_price && (
                    <p className="text-xs text-destructive mt-1">{errors.sell_price}</p>
                  )}
                </div>
              </>
            )}

            {/* Fee */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Fee
              </label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="cursor-pointer"
              />
            </div>

            {/* P&L Preview - Only for Sell Trades */}
            {tradeType === "sell" && pnl !== null && (
              <div className={`p-3 rounded-md border ${
                pnl >= 0 
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" 
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
              }`}>
                <div className="text-xs font-semibold text-muted-foreground mb-1">
                  Realized P&L Preview
                </div>
                <div className={`text-lg font-black ${
                  pnl >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Formula: (Sell Price - Buy Price) × Quantity - Fee
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
                placeholder="Add notes about this trade..."
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
                {isSaving ? "Saving..." : editingTrade ? "Update Trade" : "Log Trade"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
