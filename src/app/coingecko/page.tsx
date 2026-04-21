import SettingsProfile from "@/components/SettingsProfile";
import UserLayout from "@/layouts/UserLayout";

export default function CoinGeckoPage() {
  return (
    <UserLayout>
      <SettingsProfile defaultTab="coingecko" />
    </UserLayout>
  );
}
