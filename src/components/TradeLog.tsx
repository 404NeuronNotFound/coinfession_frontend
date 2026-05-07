"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { LogTradeDrawer } from "@/components/ui/LogTradeDrawer";
import { useTradeStore } from "@/stores/tradeStore";
import { exportTradesCsv } from "@/api/tradeApi";
import { getCoinColor } from "@/lib/coinColors";

interface TradeLogProps {
  onLogTrade?: () => void;
  onExport?: () => void;
}

export default function TradeLog({ onLogTrade, onExport }: TradeLogProps) {
  const {
    trades,
    summary,
    emotionTags,
    filters,
    pagination,
    loading,
    loadTrades,
    loadEmotionTags,
    updateFilter,
    clearFilters,
    setPage,
    openDrawer,
  } = useTradeStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load data on mount
  useEffect(() => {
    loadTrades();
    loadEmotionTags();
  }, []);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      updateFilter("search", value);
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout, updateFilter]);

  // Handle export
  const handleExport = async () => {
    try {
      await exportTradesCsv();
      if (onExport) onExport();
    } catch (error) {
      console.error("Export failed:", error);
      // You could show a toast notification here
    }
  };

  // Handle log trade
  const handleLogTrade = () => {
    openDrawer();
    if (onLogTrade) onLogTrade();
  };

  // Format currency
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    maximumFractionDigits: 0 
  }).format(n);
  
  const fmtDec = (n: number) => new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD", 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n);

  // Calculate pagination display
  const startIdx = ((filters.page || 1) - 1) * (filters.page_size || 10);
  const endIdx = Math.min(startIdx + (filters.page_size || 10), pagination.count);
  const totalPages = Math.ceil(pagination.count / (filters.page_size || 10));
  const currentPage = filters.page || 1;

  return (
    <>
      <LogTradeDrawer />
      
      <div className="w-full space-y-6 font-sans">
        {/* Header */}
        <DashboardHeader
        title="Spot Trades"
        subtitle="Spot trade history · April 2026"
        onLogTrade={handleLogTrade}
        onExport={handleExport}
      />

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search coin"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 text-sm cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={filters.type || ""}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium cursor-pointer"
          >
            <option value="">All types</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>

          <select
            value={filters.emotion || ""}
            onChange={(e) => updateFilter("emotion", e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium cursor-pointer"
          >
            <option value="">All emotions</option>
            {emotionTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          <select
            value={filters.pnl || ""}
            onChange={(e) => updateFilter("pnl", e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium cursor-pointer"
          >
            <option value="">All P&L</option>
            <option value="profit">Profit</option>
            <option value="loss">Loss</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Input 
            type="date" 
            value={filters.date_from || ""}
            onChange={(e) => updateFilter("date_from", e.target.value)}
            className="h-10 w-40 text-sm [color-scheme:light] cursor-pointer" 
          />
          <span className="text-sm font-medium text-muted-foreground">to</span>
          <Input 
            type="date" 
            value={filters.date_to || ""}
            onChange={(e) => updateFilter("date_to", e.target.value)}
            className="h-10 w-40 text-sm [color-scheme:light] cursor-pointer" 
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm cursor-pointer"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Total Trades</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {summary?.total_trades ?? "—"}
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Win Rate</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {summary ? `${summary.win_rate.toFixed(1)}%` : "—"}
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Realized P&L</div>
          <div className={`text-xl sm:text-2xl font-black ${summary && summary.total_realized_pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
            {summary ? `${summary.total_realized_pnl >= 0 ? "+" : ""}${fmt(summary.total_realized_pnl)}` : "—"}
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Total Fees</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {summary ? fmt(summary.total_fees) : "—"}
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Avg Hold Time</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {summary && summary.avg_hold_time_days > 0 
              ? `${summary.avg_hold_time_days.toFixed(1)}d` 
              : "—"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden" style={{ opacity: loading ? 0.6 : 1 }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="text-left text-xs sm:text-sm font-semibold text-muted-foreground">DATE</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground">TYPE</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground">COIN</TableHead>
                <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">QUANTITY</TableHead>
                <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">BUY PRICE</TableHead>
                <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground hidden sm:table-cell">SELL PRICE</TableHead>
                <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground hidden md:table-cell">FEE</TableHead>
                <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">P&L</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground hidden lg:table-cell">EMOTION</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground hidden xl:table-cell">NOTES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                    No trades found. Try adjusting your filters or log your first trade.
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade) => {
                  const isOpen = trade.is_open || trade.realized_pnl === null;
                  return (
                  <TableRow 
                    key={trade.id} 
                    className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
                      isOpen ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                    }`}
                    onClick={() => openDrawer(trade)}
                  >
                    <TableCell className="text-xs sm:text-sm font-medium text-foreground">
                      {new Date(trade.trade_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={trade.trade_type === "buy" ? "secondary" : "default"} className="text-xs uppercase">
                        {trade.trade_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: getCoinColor(trade.coin.symbol) }}
                        >
                          {trade.coin.symbol[0]}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-foreground">{trade.coin.symbol}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">{trade.coin.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">
                      {trade.quantity}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">
                      {trade.buy_price ? fmtDec(trade.buy_price) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground hidden sm:table-cell">
                      {trade.sell_price ? fmtDec(trade.sell_price) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-mono text-muted-foreground hidden md:table-cell">
                      {fmtDec(trade.fee)}
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm font-mono">
                      {trade.realized_pnl !== null ? (
                        <span style={{ color: trade.realized_pnl >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                          {trade.realized_pnl >= 0 ? "+" : ""}{fmt(trade.realized_pnl)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Open</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs hidden lg:table-cell">
                      {trade.emotions.map((emotion) => (
                        <Badge key={emotion.id} variant="outline" className="text-xs mr-1">
                          {emotion.emotion_tag.name}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden xl:table-cell max-w-xs truncate">
                      {trade.notes || "—"}
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {pagination.count > 0 ? startIdx + 1 : 0}–{endIdx} of {pagination.count} trades
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                  disabled={loading}
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
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || loading}
            className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
