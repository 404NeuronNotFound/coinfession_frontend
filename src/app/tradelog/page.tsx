import TradeLog from "@/components/TradeLog";

export default function TradeLogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24">
        <TradeLog
          onLogTrade={() => console.log("Log trade")}
          onExport={() => console.log("Export CSV")}
        />
      </div>
    </main>
  );
}
