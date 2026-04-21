"use client";

import { useThemeStore } from "@/stores/themeStore";
import { User, Lock, Sliders, Key, Tag, Settings, Download, AlertTriangle } from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    category: "ACCOUNT",
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
    category: "ACCOUNT",
  },
  {
    id: "apikeys",
    label: "API Keys",
    icon: Key,
    category: "INTEGRATIONS",
  },
  {
    id: "coingecko",
    label: "CoinGecko",
    icon: Tag,
    category: "INTEGRATIONS",
  },
  {
    id: "emotions",
    label: "Emotion Tags",
    icon: Sliders,
    category: "JOURNAL",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Settings,
    category: "JOURNAL",
  },
  {
    id: "export",
    label: "Export & Import",
    icon: Download,
    category: "DATA",
  },
  {
    id: "danger",
    label: "Danger zone",
    icon: AlertTriangle,
    category: "DATA",
    isDanger: true,
  },
];

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const groupedTabs = tabs.reduce(
    (acc, tab) => {
      const category = tab.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(tab);
      return acc;
    },
    {} as Record<string, typeof tabs>
  );

  return (
    <nav className="p-4 sm:p-6 space-y-6">
      {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
        <div key={category}>
          <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-3">
            {category}
          </p>
          <div className="space-y-1">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-left ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : tab.isDanger
                      ? "text-destructive hover:bg-destructive/10"
                      : isDark
                      ? "text-foreground hover:bg-muted"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
