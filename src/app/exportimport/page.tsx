'use client';

import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function ExportImportPage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="export" />
    </UserLayout>
  );
}
