"use client";

import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";

interface NavbarProps {
  /** Nav links to show. Defaults to landing page links if omitted. */
  links?: { label: string; href: string }[];
  /** Active tab label — used in the dashboard nav */
  activeLink?: string;
}

const DEFAULT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Claude AI", href: "#claude-ai" },
];

export default function Navbar({
  links = DEFAULT_LINKS,
  activeLink,
}: NavbarProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const d = theme === "dark";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border bg-background transition-colors duration-200">

      {/* Logo */}
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-black text-sm">C</span>
        </div>
        <div className="leading-none">
          <span className="font-bold text-sm tracking-tight text-foreground">CoinFession</span>
          <span className="text-xs ml-2 text-muted-foreground">Trade Journal</span>
        </div>
      </a>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`px-4 py-2 rounded-md text-sm transition-colors no-underline ${
              activeLink === label
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className="cursor-pointer"
        >
          {d ? <SunIcon /> : <MoonIcon />}
        </Button>

        <Button variant="outline" asChild className="hidden md:inline-flex">
          <a href="/login">Log In</a>
        </Button>
        <Button asChild>
          <a href="/register">Get Started</a>
        </Button>
      </div>
    </nav>
  );
}
