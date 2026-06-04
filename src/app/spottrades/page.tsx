"use client";

import TradeLog from "@/components/TradeLog";
import UserLayout from "@/layouts/UserLayout";

export default function SpotTradesPage() {
  return (
    <UserLayout>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Spot Trades Content */}
        <section>
          <TradeLog
            onLogTrade={() => {}}
            onExport={() => {}}
          />
        </section>
      </div>
    </UserLayout>
  );
}
