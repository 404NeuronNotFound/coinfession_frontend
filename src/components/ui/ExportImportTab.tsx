"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";
import { Download, Upload, FileText, AlertCircle } from "lucide-react";

interface ExportItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  format: string;
  fileSize: string;
  count: string;
  timeRange?: string;
  exportButton: string;
}

interface ImportExportHistory {
  id: string;
  date: string;
  type: "export" | "import";
  title: string;
  details: string;
  status: "success" | "failed";
  errorMessage?: string;
}

const MOCK_EXPORT_ITEMS: ExportItem[] = [
  {
    id: "all-trades-csv",
    title: "All trades — CSV",
    description: "Every trade with date, coin, type, quantity, prices, fee, P&L, and notes. Opens in Excel or Google Sheets.",
    icon: <Download className="w-8 h-8 text-green-600" />,
    format: "CSV",
    fileSize: "~18 KB",
    count: "39 rows",
    timeRange: "Jan 2026 - Apr 2026",
    exportButton: "Export CSV",
  },
  {
    id: "full-journal-csv",
    title: "Full journal — CSV with emotions",
    description: "Includes all trade data plus emotion tags and trade notes. Best for deeper self-analysis outside the app.",
    icon: <Download className="w-8 h-8 text-green-600" />,
    format: "CSV",
    fileSize: "~24 KB",
    count: "39 rows",
    exportButton: "Export CSV",
  },
  {
    id: "ai-feedback-pdf",
    title: "AI feedback history PDF",
    description: "All generated AI feedback reports formatted as a readable PDF. Good for offline review or sharing.",
    icon: <FileText className="w-8 h-8 text-purple-600" />,
    format: "PDF",
    fileSize: "~120 KB",
    count: "3 reports",
    exportButton: "Export PDF",
  },
  {
    id: "monthly-reports-csv",
    title: "Monthly reports — CSV",
    description: "Summary stats per month: P&L, win rate, trade count, top emotion, fees. Useful for year-end analysis.",
    icon: <Download className="w-8 h-8 text-green-600" />,
    format: "CSV",
    fileSize: "~6 KB",
    count: "4 months",
    exportButton: "Export CSV",
  },
  {
    id: "full-backup-json",
    title: "Full data backup — JSON",
    description: "Everything: trades, tags, snapshots, reports, preferences, and feedback. Use to migrate or back up your account.",
    icon: <FileText className="w-8 h-8 text-slate-600" />,
    format: "JSON",
    fileSize: "~200 KB",
    count: "All tables",
    exportButton: "Export JSON",
  },
];

const MOCK_HISTORY: ImportExportHistory[] = [
  {
    id: "1",
    date: "Apr 20, 2026",
    type: "export",
    title: "All trad...",
    details: "39 trades",
    status: "success",
  },
  {
    id: "2",
    date: "Apr 18, 2026",
    type: "import",
    title: "12 trades added - 2 skipped (duplicate)",
    details: "",
    status: "success",
  },
  {
    id: "3",
    date: "Apr 10, 2026",
    type: "export",
    title: "Full jour...",
    details: "31 trades",
    status: "success",
  },
  {
    id: "4",
    date: "Mar 31, 2026",
    type: "export",
    title: "AI feed...",
    details: "2 reports",
    status: "success",
  },
  {
    id: "5",
    date: "Mar 15, 2026",
    type: "import",
    title: "Failed: missing required column 'date'",
    details: "",
    status: "failed",
    errorMessage: "Failed: missing required column 'date'",
  },
];

const CSV_TEMPLATE_COLUMNS = [
  { column: "date", type: "date", required: true, example: "2026-04-15 or 15/04/2026" },
  { column: "coin", type: "string", required: true, example: "BTC, bitcoin, or Bitcoin" },
  { column: "type", type: "string", required: true, example: "buy or sell (case insensitive)" },
  { column: "quantity", type: "number", required: true, example: "0.05" },
  { column: "buy_price", type: "number", required: false, example: "61800.00" },
  { column: "sell_price", type: "number", required: false, example: "63200.00" },
  { column: "fee", type: "number", required: false, example: "12.36 (defaults to 0)" },
  { column: "notes", type: "text", required: false, example: "Bought the dip" },
  { column: "emotion", type: "string", required: false, example: "Disciplined (must match an existing tag)" },
];

export default function ExportImportTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const [selectedTimeRange, setSelectedTimeRange] = useState("all-time");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setUploadedFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleExport = (itemId: string) => {
    console.log(`Exporting ${itemId}`);
  };

  const handleImport = () => {
    if (uploadedFile) {
      console.log(`Importing ${uploadedFile.name}`);
    }
  };

  const handleDownloadTemplate = () => {
    console.log("Downloading CSV template");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Export & Import</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Download your data for backup or analysis, or import trades from another platform. Your data is yours — no lock-in.
        </p>
      </div>

      {/* Export Data Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit">
          <h3 className="text-base sm:text-lg font-semibold text-foreground uppercase text-xs tracking-widest">Export Data</h3>
          <span className="text-xs font-medium text-muted-foreground">39 trades · Jan 2026 - Apr 2026</span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">Time range</label>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className={`w-full sm:w-48 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
            }`}
          >
            <option value="all-time">All time</option>
            <option value="1-year">Last 1 year</option>
            <option value="6-months">Last 6 months</option>
            <option value="3-months">Last 3 months</option>
            <option value="1-month">Last 1 month</option>
          </select>
        </div>

        <div className="space-y-4">
          {MOCK_EXPORT_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 rounded-lg border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.description}</p>
                  <div className="flex gap-3 mt-3 flex-wrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      isDark ? "bg-background text-muted-foreground" : "bg-white text-slate-600"
                    }`}>
                      {item.count}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      isDark ? "bg-background text-muted-foreground" : "bg-white text-slate-600"
                    }`}>
                      {item.format}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      isDark ? "bg-background text-muted-foreground" : "bg-white text-slate-600"
                    }`}>
                      {item.fileSize}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleExport(item.id)} className="whitespace-nowrap">
                {item.exportButton}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Import Trades Section */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          Import Trades from CSV
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Upload a CSV file from your exchange or another journal. Columns are auto-detected and mapped. Duplicate trades (same date + coin + quantity) are skipped automatically.
        </p>

        {/* Drag and Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-8 sm:p-12 text-center transition-colors mb-6 ${
            dragActive
              ? isDark
                ? "border-primary bg-primary/10"
                : "border-primary bg-blue-50"
              : isDark
              ? "border-border bg-muted/30"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">Drop your CSV here</p>
              <p className="text-xs text-muted-foreground mt-1">
                or <button className="text-primary hover:underline font-medium">browse files</button> · CSV up to 10 MB
              </p>
            </div>
          </div>
          {uploadedFile && (
            <p className="text-xs text-green-600 font-medium mt-3">✓ {uploadedFile.name} selected</p>
          )}
        </div>

        {/* Download Template Button */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3">Not sure about the format?</p>
          <Button variant="outline" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="w-4 h-4" />
            Download CSV template
          </Button>
        </div>

        {/* Column Guide */}
        <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
          <h4 className="text-sm font-semibold text-foreground mb-4 uppercase text-xs tracking-widest">
            Column Guide — CSV Template Format
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDark ? "border-border" : "border-slate-200"}`}>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Column</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Type</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Required</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Example</th>
                </tr>
              </thead>
              <tbody>
                {CSV_TEMPLATE_COLUMNS.map((col, idx) => (
                  <tr key={idx} className={`border-b ${isDark ? "border-border" : "border-slate-200"}`}>
                    <td className="py-3 px-3 text-foreground font-mono text-xs">{col.column}</td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{col.type}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        col.required
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {col.required ? "Required" : "Optional"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{col.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Import & Export History */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6 pb-4 border-b border-inherit uppercase text-xs tracking-widest">
          Import & Export History
        </h3>

        <div className="space-y-3">
          {MOCK_HISTORY.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 sm:p-6 rounded-lg border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-3 h-3 rounded-full shrink-0 ${
                  item.status === "success" ? "bg-green-600" : "bg-red-600"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{item.date}</span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      item.type === "export"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    item.status === "failed" ? "text-red-600 font-medium" : "text-muted-foreground"
                  }`}>
                    {item.errorMessage || item.title}
                  </p>
                  {item.details && (
                    <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className={`rounded-lg border p-4 sm:p-6 flex gap-3 ${
        isDark ? "bg-blue-950/30 border-blue-900/50" : "bg-blue-50 border-blue-200"
      }`}>
        <AlertCircle className={`w-5 h-5 shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
        <div>
          <p className={`text-sm font-semibold ${isDark ? "text-blue-300" : "text-blue-900"}`}>
            Your data is yours
          </p>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-blue-200" : "text-blue-800"}`}>
            We don't lock you in. Export anytime to migrate to another platform or keep a backup. All exports are unencrypted and ready to use.
          </p>
        </div>
      </div>
    </div>
  );
}
