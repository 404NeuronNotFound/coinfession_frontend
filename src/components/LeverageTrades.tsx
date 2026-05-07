"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useTradeStore } from "@/stores/tradeStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCoinColor } from "@/lib/coinColors";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";
import { LogLeverageDrawer } from "@/components/ui/LogLeverageDrawer";

export default function LeverageTrades() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const {
    openPositions,
    openPositionsMeta,
    loadingOpenPositions,
    emotionTags,
    loadOpenPositions,
    loadEmotionTags,
    openDrawer,
  } = useTradeStore();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [positionTypeFilter, setPositionTypeFilter] = React.useState("");
  const [emotionFilter, setEmotionFilter] = React.useState("");
  const [pnlFilter, setPnlFilter] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  // Filter positions based on filters - show both open and closed positions
  const filteredPositions = React.useMemo(() => {
    return openPositions.filter((position) => {
      // Search filter
      if (searchTerm && !position.coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !position.coin.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Position type filter
      if (positionTypeFilter && position.position_type !== positionTypeFilter) {
        return false;
      }

      // Emotion filter
      if (emotionFilter && !position.emotions.some((e) => e.emotion_tag.id === parseInt(emotionFilter))) {
        return false;
      }

      // P&L filter
      if (pnlFilter && position.unrealized_pnl !== null) {
        if (pnlFilter === "profit" && position.unrealized_pnl < 0) return false;
        if (pnlFilter === "loss" && position.unrealized_pnl >= 0) return false;
      }

      // Date filters
      if (dateFrom && new Date(position.trade_date) < new Date(dateFrom)) {
        return false;
      }
      if (dateTo && new Date(position.trade_date) > new Date(dateTo)) {
        return false;
      }

      return true;
    });
  }, [openPositions, searchTerm, positionTypeFilter, emotionFilter, pnlFilter, dateFrom, dateTo]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPositions.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filteredPositions.length);
  const paginatedPositions = filteredPositions.slice(startIdx, endIdx);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, positionTypeFilter, emotionFilter, pnlFilter, dateFrom, dateTo]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      loadOpenPositions();
      loadEmotionTags();
    }
  }, [isAuthenticated, router, loadOpenPositions, loadEmotionTags]);

  if (!isAuthenticated) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const fmtDec = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const formatLeverage = (lev: number) => {
    return Math.floor(lev) === lev ? `${lev}x` : `${lev.toFixed(1)}x`;
  };

  const formatDaysOpen = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const handleClosePosition = (position: any) => {
    // Pre-fill drawer with position data for closing
    const tradeData = {
      id: position.id,
      coin: position.coin,
      trade_type: position.position_type === "long" ? "buy" : "sell",
      quantity: position.quantity,
      buy_price: position.entry_price,
      sell_price: null,
      fee: 0,
      trade_date: position.trade_date,
      notes: position.notes,
      emotions: position.emotions,
      realized_pnl: null,
      roi: null,
      is_open: false,
      created_at: position.trade_date,
      position_type: position.position_type,
      leverage: position.leverage,
      entry_price: position.entry_price,
      exit_price: null,
      collateral: position.collateral,
      liquidation_price: position.liquidation_price,
      funding_fees: position.funding_fees,
      close_date: null,
    };
    openDrawer(tradeData as any);
  };

  const handleLogTrade = () => {
    openDrawer();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPositionTypeFilter("");
    setEmotionFilter("");
    setPnlFilter("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <>
      <LogLeverageDrawer />
      <main
        className={`min-h-screen transition-colors duration-200 ${
          isDark ? "bg-background" : "bg-white"
        }`}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
          {/* Header */}
          <DashboardHeader
            title="Leverage Trades"
            subtitle={`${filteredPositions.filter(p => p.is_open).length} open, ${filteredPositions.filter(p => !p.is_open).length} closed · ${filteredPositions.length} total leverage position${filteredPositions.length !== 1 ? "s" : ""}`}
            onLogTrade={handleLogTrade}
            logTradeButtonText="+ Log Position"
          />

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search coin"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full h-10 px-3 rounded-md border text-sm cursor-pointer ${
                    isDark
                      ? "bg-background border-border text-foreground"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={positionTypeFilter}
                onChange={(e) => setPositionTypeFilter(e.target.value)}
                className={`h-10 px-3 rounded-md border text-sm font-medium cursor-pointer ${
                  isDark
                    ? "bg-background border-border text-foreground"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <option value="">All types</option>
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>

              <select
                value={emotionFilter}
                onChange={(e) => setEmotionFilter(e.target.value)}
                className={`h-10 px-3 rounded-md border text-sm font-medium cursor-pointer ${
                  isDark
                    ? "bg-background border-border text-foreground"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <option value="">All emotions</option>
                {emotionTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>

              <select
                value={pnlFilter}
                onChange={(e) => setPnlFilter(e.target.value)}
                className={`h-10 px-3 rounded-md border text-sm font-medium cursor-pointer ${
                  isDark
                    ? "bg-background border-border text-foreground"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <option value="">All P&L</option>
                <option value="profit">Profit</option>
                <option value="loss">Loss</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`h-10 w-40 px-3 rounded-md border text-sm [color-scheme:light] cursor-pointer ${
                  isDark
                    ? "bg-background border-border text-foreground"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
              />
              <span className="text-sm font-medium text-muted-foreground">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`h-10 w-40 px-3 rounded-md border text-sm [color-scheme:light] cursor-pointer ${
                  isDark
                    ? "bg-background border-border text-foreground"
                    : "bg-white border-slate-200 text-slate-900"
                }`}
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

          {/* Loading State */}
          {loadingOpenPositions ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">
                Loading leverage trades...
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              {openPositionsMeta && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 sm:mt-8 mb-6 sm:mb-8">
                  {/* Total Trades */}
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                      Total Trades
                    </div>
                    <div className="text-2xl font-black text-foreground">
                      {openPositions.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const openCount = openPositions.filter(p => p.is_open).length;
                        const closedCount = openPositions.filter(p => !p.is_open).length;
                        return `${openCount} open, ${closedCount} closed`;
                      })()}
                    </div>
                  </div>

                  {/* Active Collateral (only open positions) */}
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                      Active Collateral
                    </div>
                    <div className="text-2xl font-black text-foreground">
                      {(() => {
                        const activeCollateral = openPositions
                          .filter(p => p.is_open)
                          .reduce((sum, p) => sum + p.collateral, 0);
                        return fmt(activeCollateral);
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      at risk
                    </div>
                  </div>

                  {/* Total P&L */}
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                      Total P&L
                    </div>
                    <div
                      className={`text-2xl font-black ${
                        (() => {
                          // Calculate total P&L: unrealized (open) + realized (closed)
                          const unrealizedTotal = openPositions
                            .filter(p => p.is_open)
                            .reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);
                          const realizedTotal = openPositions
                            .filter(p => !p.is_open)
                            .reduce((sum, p) => sum + (p.realized_pnl || 0), 0);
                          const totalPnl = unrealizedTotal + realizedTotal;
                          return totalPnl >= 0 ? "text-green-600" : "text-red-600";
                        })()
                      }`}
                    >
                      {(() => {
                        const unrealizedTotal = openPositions
                          .filter(p => p.is_open)
                          .reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);
                        const realizedTotal = openPositions
                          .filter(p => !p.is_open)
                          .reduce((sum, p) => sum + (p.realized_pnl || 0), 0);
                        const totalPnl = unrealizedTotal + realizedTotal;
                        return `${totalPnl >= 0 ? "+" : ""}${fmt(totalPnl)}`;
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const openCount = openPositions.filter(p => p.is_open).length;
                        const closedCount = openPositions.filter(p => !p.is_open).length;
                        return `${openCount} open, ${closedCount} closed`;
                      })()}
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">
                      Win Rate
                    </div>
                    <div className="text-2xl font-black text-foreground">
                      {(() => {
                        const closedPositions = openPositions.filter(p => !p.is_open);
                        const winningPositions = closedPositions.filter(p => (p.realized_pnl || 0) > 0);
                        const winRate = closedPositions.length > 0 
                          ? (winningPositions.length / closedPositions.length * 100) 
                          : 0;
                        return `${winRate.toFixed(1)}%`;
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(() => {
                        const closedPositions = openPositions.filter(p => !p.is_open);
                        const winningPositions = closedPositions.filter(p => (p.realized_pnl || 0) > 0);
                        return `${winningPositions.length} of ${closedPositions.length} profitable`;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Positions Table */}
              {filteredPositions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {openPositions.length === 0
                      ? "No leverage trades yet. Log a long or short position to track it here."
                      : "No positions match your filters. Try adjusting them."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="text-left text-xs sm:text-sm font-semibold text-muted-foreground">COIN</TableHead>
                            <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground">TYPE</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">COLLATERAL</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">ENTRY</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground hidden md:table-cell">LIQUIDATION</TableHead>
                            <TableHead className="text-right text-xs sm:text-sm font-semibold text-muted-foreground">P&L</TableHead>
                            <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground hidden lg:table-cell">EMOTION</TableHead>
                            <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground hidden xl:table-cell">DAYS OPEN</TableHead>
                            <TableHead className="text-xs sm:text-sm font-semibold text-muted-foreground"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPositions.map((position) => {
                            const showLiquidationWarning =
                              position.is_open &&
                              position.distance_to_liquidation != null &&
                              position.distance_to_liquidation < 10;
                            
                            const isClosed = !position.is_open;

                            return (
                              <TableRow
                                key={position.id}
                                className={`border-b border-border hover:bg-muted/50 cursor-pointer ${
                                  showLiquidationWarning ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                                } ${isClosed ? 'opacity-60' : ''}`}
                                onClick={() => !isClosed && handleClosePosition(position)}
                              >
                                {/* Coin */}
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                      style={{ backgroundColor: getCoinColor(position.coin.symbol) }}
                                    >
                                      {position.coin.symbol[0]}
                                    </div>
                                    <div>
                                      <div className="text-xs sm:text-sm font-medium text-foreground">
                                        {position.coin.symbol}
                                        {isClosed && (
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            Closed
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground hidden sm:block">{position.coin.name}</div>
                                    </div>
                                  </div>
                                </TableCell>

                                {/* Type & Leverage */}
                                <TableCell>
                                  <Badge
                                    variant={position.position_type === "long" ? "secondary" : "default"}
                                    className="text-xs uppercase"
                                  >
                                    {position.position_type} {formatLeverage(position.leverage)}
                                  </Badge>
                                </TableCell>

                                {/* Collateral */}
                                <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">
                                  {fmt(position.collateral)}
                                </TableCell>

                                {/* Entry Price */}
                                <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">
                                  {fmtDec(position.entry_price)}
                                </TableCell>

                                {/* Liquidation */}
                                <TableCell className="text-right text-xs sm:text-sm font-mono hidden md:table-cell">
                                  {position.liquidation_price && position.is_open ? (
                                    <div>
                                      <div className="text-foreground">{fmtDec(position.liquidation_price)}</div>
                                      {position.distance_to_liquidation != null && (
                                        <div
                                          className={`text-xs ${
                                            position.distance_to_liquidation < 10
                                              ? "text-amber-600"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {position.distance_to_liquidation.toFixed(1)}% away
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>

                                {/* Unrealized/Realized P&L */}
                                <TableCell className="text-right text-xs sm:text-sm font-mono">
                                  {isClosed ? (
                                    // Show realized P&L for closed positions
                                    position.realized_pnl != null ? (
                                      <div>
                                        <div
                                          className={`font-semibold ${
                                            position.realized_pnl >= 0
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {position.realized_pnl >= 0 ? "+" : ""}
                                          {fmtDec(position.realized_pnl)}
                                        </div>
                                        {position.roi != null && (
                                          <div
                                            className={`text-xs ${
                                              position.roi >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                          >
                                            ({position.roi >= 0 ? "+" : ""}
                                            {position.roi.toFixed(1)}%)
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )
                                  ) : (
                                    // Show unrealized P&L for open positions
                                    position.unrealized_pnl != null ? (
                                      <div>
                                        <div
                                          className={`font-semibold ${
                                            position.unrealized_pnl >= 0
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {position.unrealized_pnl >= 0 ? "+" : ""}
                                          {fmtDec(position.unrealized_pnl)}
                                        </div>
                                        {position.unrealized_roi != null && (
                                          <div
                                            className={`text-xs ${
                                              position.unrealized_roi >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                          >
                                            ({position.unrealized_roi >= 0 ? "+" : ""}
                                            {position.unrealized_roi.toFixed(1)}%)
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">—</span>
                                    )
                                  )}
                                </TableCell>

                                {/* Emotion Tags */}
                                <TableCell className="hidden lg:table-cell">
                                  {position.emotions && position.emotions.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {position.emotions.slice(0, 2).map((emotion) => (
                                        <Badge
                                          key={emotion.id}
                                          variant="outline"
                                          className="text-xs"
                                          style={{
                                            borderColor: emotion.emotion_tag.color,
                                            color: emotion.emotion_tag.color,
                                          }}
                                        >
                                          {emotion.emotion_tag.name}
                                        </Badge>
                                      ))}
                                      {position.emotions.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{position.emotions.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>

                                {/* Days Open */}
                                <TableCell className="text-xs hidden xl:table-cell text-muted-foreground">
                                  {formatDaysOpen(position.days_open)}
                                </TableCell>

                                {/* Action */}
                                <TableCell>
                                  {position.is_open ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClosePosition(position);
                                      }}
                                      className="text-xs cursor-pointer"
                                    >
                                      Close
                                    </Button>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Showing {filteredPositions.length > 0 ? startIdx + 1 : 0}–{endIdx} of {filteredPositions.length} positions
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
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
                              onClick={() => setCurrentPage(pageNum)}
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
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
