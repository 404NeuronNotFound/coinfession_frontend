"use client";

import { Tokens, Theme } from "@/lib/theme";
import { SunIcon, MoonIcon } from "@/components/Icons";

interface NavbarProps {
  tk: Tokens;
  theme: Theme;
  onToggleTheme: () => void;
  /** Nav links to show. Defaults to landing page links if omitted. */
  links?: { label: string; href: string }[];
  /** Active tab label — used in the dashboard nav */
  activeLink?: string;
}

const DEFAULT_LINKS = [
  { label: "Features",     href: "#features"      },
  { label: "How it works", href: "#how-it-works"  },
  { label: "Pricing",      href: "#pricing"        },
];

export default function Navbar({
  tk,
  theme,
  onToggleTheme,
  links = DEFAULT_LINKS,
  activeLink,
}: NavbarProps) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b ${tk.border} ${tk.navBg} transition-colors duration-200`}>

      {/* Logo */}
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img 
            src="/CoinFessionLogo.svg" 
            alt="CoinFession Logo"
            className="w-full h-full object-contain"
            />
        </div>
        <div className="leading-none">
          <span className={`font-bold text-sm tracking-tight ${tk.text}`}>CoinFession</span>
          <span className={`text-xs ml-2 ${tk.textGhost}`}>Trade Journal</span>
        </div>
      </a>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`px-4 py-2 rounded-md text-sm transition-colors no-underline ${
              activeLink === label ? tk.tabActive : tk.tabInactive
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors cursor-pointer`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        <a
          href="/login"
          className={`hidden md:inline-flex text-sm border ${tk.border} ${tk.textMid} px-4 py-2 rounded-md transition-colors no-underline`}
        >
          Log In
        </a>
        <a
          href="/signup"
          className="text-sm bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-5 py-2 rounded-md transition-colors no-underline"
        >
          Get Started
        </a>
      </div>
    </nav>
  );
}