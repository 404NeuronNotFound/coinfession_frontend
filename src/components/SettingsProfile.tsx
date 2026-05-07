"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { SettingsTabs } from "@/components/ui/SettingsTabs";
import ProfileTab from "@/components/ui/ProfileTab";
import SecurityTab from "@/components/ui/SecurityTab";
import EmotionTagsTab from "@/components/ui/EmotionTagsTab";
import ExportImportTab from "@/components/ui/ExportImportTab";
import DangerZoneTab from "@/components/ui/DangerZoneTab";

export default function SettingsProfile({ defaultTab = "profile" }: { defaultTab?: string }) {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const d = theme === "dark";
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <main className={`min-h-screen transition-colors duration-200 ${d ? "bg-background" : "bg-white"}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 pb-24 font-sans">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Manage your account and preferences
            </p>
        </div>

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar Tabs */}
          <div className={`lg:col-span-1 rounded-lg border ${d ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "emotions" && <EmotionTagsTab />}
            {activeTab === "export" && <ExportImportTab />}
            {activeTab === "danger" && <DangerZoneTab />}
          </div>
        </div>
      </div>
    </main>
  );
}
