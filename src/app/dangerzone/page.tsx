'use client';

import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function DangerZonePage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="danger" />
    </UserLayout>
  );
}
