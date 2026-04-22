'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from './button';
import { Moon, Sun, X, Settings } from 'lucide-react';
import {
  DashboardIcon,
  TradeLogIcon,
  PortfolioIcon,
  PnLIcon,
  EmotionIcon,
  ReportIcon,
  AIFeedbackIcon,
} from './Icons';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { href: '/tradelog', label: 'Trade Log', Icon: TradeLogIcon },
  { href: '/portfolio', label: 'Portfolio', Icon: PortfolioIcon },
  { href: '/pnl-analysis', label: 'P&L Analysis', Icon: PnLIcon },
  { href: '/emotionjournal', label: 'Emotion Journal', Icon: EmotionIcon },
  { href: '/monthlyreport', label: 'Monthly Report', Icon: ReportIcon },
  { href: '/aifeedback', label: 'AI Feedback', Icon: AIFeedbackIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 min-h-screen flex flex-col border-r transition-all duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          isDark
            ? 'bg-background border-border'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-inherit">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-black text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground">
                CoinFession
              </span>
              <span className="text-xs text-muted-foreground">
                Trade smarter
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors no-underline text-sm font-medium ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isDark
                    ? 'text-foreground hover:bg-muted'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t border-inherit">
          {/* User Info */}
          {user && (
            <div className={`px-4 py-3 rounded-lg ${
              isDark ? 'bg-muted' : 'bg-slate-50'
            }`}>
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-medium text-foreground truncate">
                {user.username}
              </p>
            </div>
          )}

          {/* Settings */}
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors no-underline text-sm font-medium ${
              pathname === '/settings'
                ? 'bg-primary text-primary-foreground'
                : isDark
                ? 'text-foreground hover:bg-muted'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 px-4"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-3 px-4 text-destructive hover:text-destructive"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
