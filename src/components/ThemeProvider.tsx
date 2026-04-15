"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Apply theme to document root on mount and when theme changes
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
