'use client';

import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function APIKeysPage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="apikeys" />
    </UserLayout>
  );
}
