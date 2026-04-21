'use client';

import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function EmotionTagsPage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="emotions" />
    </UserLayout>
  );
}
