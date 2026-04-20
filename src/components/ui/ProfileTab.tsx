"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "./button";
import { User } from "lucide-react";

export default function ProfileTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    username: user?.username || "juandelacruz",
    email: user?.email || "juan@email.com",
    currency: "USD — US Dollar",
    timezone: "Asia/Manila (PHT +8)",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving profile:", formData);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "juandelacruz",
      email: user?.email || "juan@email.com",
      currency: "USD — US Dollar",
      timezone: "Asia/Manila (PHT +8)",
    });
  };

  return (
    <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">
        Your personal information and display settings
      </h2>

      {/* Profile Header */}
      <div className={`rounded-lg p-6 mb-6 ${isDark ? "bg-muted/50" : "bg-slate-50"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-black text-2xl">
              {user?.username?.[0]?.toUpperCase() || "J"}D
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              {user?.username || "Juan Dela Cruz"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {user?.email || "juan@email.com"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since January 2026 · 47 trades logged
            </p>
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Change photo
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Username
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Used for your profile and exports
          </p>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Email
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            For account notifications and reports
          </p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
            }`}
          />
        </div>

        {/* Display Currency */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Display currency
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            All P&L values shown in this currency
          </p>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
            }`}
          >
            <option>USD — US Dollar</option>
            <option>EUR — Euro</option>
            <option>GBP — British Pound</option>
            <option>JPY — Japanese Yen</option>
            <option>PHP — Philippine Peso</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Timezone
          </label>
          <p className="text-xs text-muted-foreground mb-3">
            Used for trade timestamps and reports
          </p>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 focus:border-primary focus:outline-none"
            }`}
          >
            <option>Asia/Manila (PHT +8)</option>
            <option>Asia/Bangkok (ICT +7)</option>
            <option>Asia/Singapore (SGT +8)</option>
            <option>America/New_York (EST -5)</option>
            <option>Europe/London (GMT +0)</option>
            <option>UTC (UTC +0)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-inherit">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
