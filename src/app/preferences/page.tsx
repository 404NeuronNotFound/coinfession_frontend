'use client';

import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function PreferencesPage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="preferences" />
    </UserLayout>
  );
}
