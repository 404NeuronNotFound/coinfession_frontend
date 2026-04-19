"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Download, Plus } from "lucide-react";
import DashboardHeader from "@/components/ui/DashboardHeader";

interface Trade {
  id: number;
  date: string;
  type: "BUY" | "SELL";
  coin: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  sellPrice?: number;
  fee: number;
  pnl?: number;
  pnlPct?: number;
  emotion?: string;
  notes?: string;
  color: string;
}

interface TradeLogProps {
  trades?: Trade[];
  onLogTrade?: () => void;
  onExport?: () => void;
}

const MOCK_TRADES: Trade[] = [
  { id: 1, date: "04-15", type: "BUY", coin: "Bitcoin", ticker: "BTC", quantity: 0.05, buyPrice: 61800, fee: 12.36, emotion: "Disciplined", notes: "Strong support level", color: "#F7931A" },
  { id: 2, date: "04-12", type: "SELL", coin: "Ethereum", ticker: "ETH", quantity: 1, buyPrice: 2800, sellPrice: 2420, fee: 9.68, pnl: 388, pnlPct: 13.8, emotion: "Panic Sold", notes: "Sold too early", color: "#627EEA" },
  { id: 3, date: "04-10", type: "BUY", coin: "Avalanche", ticker: "AVAX", quantity: 10, buyPrice: 35.4, fee: 3.54, emotion: "FOMO", notes: "Chased pump", color: "#E84142" },
  { id: 4, date: "04-05", type: "SELL", coin: "Bitcoin", ticker: "BTC", quantity: 0.1, buyPrice: 55000, sellPrice: 63200, fee: 18.96, pnl: 880, pnlPct: 14.9, emotion: "Disciplined", notes: "Hit target", color: "#F7931A" },
  { id: 5, date: "03-28", type: "BUY", coin: "Solana", ticker: "SOL", quantity: 5, buyPrice: 142, fee: 7.10, emotion: "Patient", notes: "Waiting for dip", color: "#9945FF" },
  { id: 6, date: "03-20", type: "SELL", coin: "Solana", ticker: "SOL", quantity: 3, buyPrice: 142, sellPrice: 168, fee: 6.30, pnl: 71, pnlPct: 18.3, emotion: "Disciplined", notes: "Partial profit", color: "#9945FF" },
  { id: 7, date: "03-15", type: "BUY", coin: "Ethereum", ticker: "ETH", quantity: 2, buyPrice: 2750, fee: 11.00, emotion: "Patient", notes: "DCA strategy", color: "#627EEA" },
  { id: 8, date: "03-10", type: "SELL", coin: "Avalanche", ticker: "AVAX", quantity: 15, buyPrice: 28, sellPrice: 22, fee: 4.95, pnl: -94.5, pnlPct: -21.4, emotion: "Panic Sold", notes: "Cut losses", color: "#E84142" },
  { id: 9, date: "03-05", type: "BUY", coin: "Bitcoin", ticker: "BTC", quantity: 0.08, buyPrice: 58200, fee: 14.00, emotion: "Disciplined", notes: "Accumulating", color: "#F7931A" },
  { id: 10, date: "02-28", type: "SELL", coin: "Ethereum", ticker: "ETH", quantity: 1.5, buyPrice: 2600, sellPrice: 2940, fee: 13.23, pnl: 498, pnlPct: 13.1, emotion: "Disciplined", notes: "Rebalancing", color: "#627EEA" },
];

export default function TradeLog({ trades = MOCK_TRADES, onLogTrade, onExport }: TradeLogProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "BUY" | "SELL">("ALL");
  const [filterEmotion, setFilterEmotion] = useState("ALL");
  const [filterPnL, setFilterPnL] = useState("ALL");

  const itemsPerPage = 10;

  // Filter trades
  const filtered = trades.filter(t => {
    const matchesSearch = t.coin.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || t.type === filterType;
    const matchesEmotion = filterEmotion === "ALL" || t.emotion === filterEmotion;
    const matchesPnL = filterPnL === "ALL" || 
                      (filterPnL === "PROFIT" && (t.pnl ?? 0) > 0) ||
                      (filterPnL === "LOSS" && (t.pnl ?? 0) < 0);
    
    return matchesSearch && matchesType && matchesEmotion && matchesPnL;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedTrades = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Calculate stats
  const totalTrades = trades.length;
  const closedTrades = trades.filter(t => t.type === "SELL");
  const winRate = closedTrades.length ? Math.round((closedTrades.filter(t => (t.pnl ?? 0) > 0).length / closedTrades.length) * 100) : 0;
  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const totalFees = trades.reduce((sum, t) => sum + t.fee, 0);
  const avgHoldTime = "12d";

  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const fmtDec = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Header */}
      <DashboardHeader
        title="Trade Log"
        subtitle="Complete trade history · April 2026"
        onLogTrade={onLogTrade}
        onExport={onExport}
      />

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search coin"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as "ALL" | "BUY" | "SELL");
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
          >
            <option value="ALL">All types</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>

          <select
            value={filterEmotion}
            onChange={(e) => {
              setFilterEmotion(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
          >
            <option value="ALL">All emotions</option>
            <option value="Disciplined">Disciplined</option>
            <option value="FOMO">FOMO</option>
            <option value="Greedy">Greedy</option>
            <option value="Panic Sold">Panic Sold</option>
          </select>

          <select
            value={filterPnL}
            onChange={(e) => {
              setFilterPnL(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm font-medium"
          >
            <option value="ALL">All P&L</option>
            <option value="PROFIT">Profit</option>
            <option value="LOSS">Loss</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input type="date" className="h-10 w-32 text-sm" />
          <Input type="date" className="h-10 w-32 text-sm" />
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">Clear</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Total Trades</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{totalTrades}</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Win Rate</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{winRate}%</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Realized P&L</div>
          <div className={`text-xl sm:text-2xl font-black ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPnL >= 0 ? "+" : ""}{fmt(totalPnL)}
          </div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Total Fees</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{fmt(totalFees)}</div>
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border bg-card">
          <div className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1">Avg Hold Time</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{avgHoldTime}</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
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
              {paginatedTrades.map((trade) => (
                <TableRow key={trade.id} className="border-b border-border hover:bg-muted/50">
                  <TableCell className="text-xs sm:text-sm font-medium text-foreground">{trade.date}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === "BUY" ? "secondary" : "default"} className="text-xs">
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: trade.color }}
                      >
                        {trade.ticker[0]}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-foreground">{trade.ticker}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">{trade.coin}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">{trade.quantity}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground">{fmtDec(trade.buyPrice)}</TableCell>
                  <TableCell className="text-right text-xs sm:text-sm font-mono text-foreground hidden sm:table-cell">
                    {trade.sellPrice ? fmtDec(trade.sellPrice) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm font-mono text-muted-foreground hidden md:table-cell">
                    {fmtDec(trade.fee)}
                  </TableCell>
                  <TableCell className="text-right text-xs sm:text-sm font-mono">
                    {trade.pnl !== undefined ? (
                      <span style={{ color: trade.pnl >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}>
                        {trade.pnl >= 0 ? "+" : ""}{fmt(trade.pnl)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Open</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs hidden lg:table-cell">
                    {trade.emotion && (
                      <Badge variant="outline" className="text-xs">
                        {trade.emotion}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden xl:table-cell max-w-xs truncate">
                    {trade.notes || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filtered.length)} of {filtered.length} trades
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 sm:h-10 sm:w-10"
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
                  className="w-8 h-8 p-0 text-xs"
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
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
