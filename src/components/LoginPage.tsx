"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useThemeStore } from "@/stores/themeStore";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";

// ─── Types, API, Store ────────────────────────────────────
import { LoginPayload, ApiError } from "@/types/auth";
import { login, getMe } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

// ─── Local form state types ───────────────────────────────
type FormFields = LoginPayload;
type FormErrors = Partial<Record<keyof FormFields | "form", string>>;

const EMPTY: FormFields = { username: "", password: "" };

// ─── Validation ───────────────────────────────────────────
function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!form.username?.trim()) errors.username = "Username is required";
  if (!form.password?.trim()) errors.password = "Password is required";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();

  // ── Theme
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const d = theme === "dark";

  // ── Form state
  const [form, setForm] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Auth store — pull what we need
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  // ── Guard: already logged in → go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // ── Re-validate touched fields on every keystroke
  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const all = validate(form);
    const next: FormErrors = {};
    (Object.keys(touched) as (keyof FormFields)[]).forEach((k) => {
      if (touched[k] && all[k]) next[k] = all[k];
    });
    setErrors((prev) => ({ ...prev, ...next }));
  }, [form, touched]);

  const handleChange = (field: keyof FormFields, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleBlur = (field: keyof FormFields) =>
    setTouched((t) => ({ ...t, [field]: true }));

  // ── Submit handler
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setTouched({ username: true, password: true });

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    clearSession();

    try {
      const tokens = await login(form);
      const user = await getMe(tokens.access);
      setSession(tokens, user);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setErrors({
        form: apiErr.message ?? "Invalid username or password. Please try again.",
      });
      clearSession();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={`min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-200 ${d ? "bg-background" : "bg-background"}`}>

      {/* ── Theme toggle ── */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="fixed top-5 right-6"
        aria-label="Toggle theme"
      >
        {d ? <SunIcon /> : <MoonIcon />}
      </Button>

      {/* ── Split card ── */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border">

        {/* ─── LEFT — brand pitch ─────────────────────────── */}
        <div className={`w-full md:w-[42%] flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-border ${d ? "bg-card" : "bg-card"}`}>
          <div>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline mb-10">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-black text-sm">C</span>
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                CoinFession
              </span>
            </a>

            {/* Headline */}
            <h2 className="text-2xl font-black tracking-tight leading-snug mb-3 text-foreground">
              Welcome back.<br />Your journal missed you.
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
              Log in to pick up where you left off — trades, patterns,
              and your AI feedback are waiting.
            </p>

            {/* What's inside reminders */}
            <div className="space-y-5">
              {[
                {
                  n: "1",
                  title: "Your trade history",
                  desc: "Every buy and sell you've logged, in one place.",
                },
                {
                  n: "2",
                  title: "Emotion patterns",
                  desc: "See exactly which feelings cost you money.",
                },
                {
                  n: "3",
                  title: "AI mirror",
                  desc: "Updated analysis based on your latest trades.",
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold border border-border text-muted-foreground mt-0.5">
                    {n}
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-0.5 text-foreground">
                      {title}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs mt-10 text-muted-foreground/50">
            Free forever for personal use. No credit card required.
          </p>
        </div>

        {/* ─── RIGHT — form ───────────────────────────────── */}
        <div className="flex-1 p-10 bg-background">

          {/* Form header */}
          <div className="mb-7">
            <h1 className="text-xl font-black tracking-tight mb-1 text-foreground">
              Sign in
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your journal
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* ── Username ── */}
            <div>
              <label htmlFor="username" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="yourhandle"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-xs text-destructive mt-1">{errors.username}</p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* ── Credential error from Django ── */}
            {errors.form && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-2.5 leading-relaxed">
                {errors.form}
              </div>
            )}

            {/* ── Submit ── */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-2"
              size="lg"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin" width="14" height="14"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </Button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground/50">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Register link ── */}
            <p className="text-xs text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Create one free
              </a>
            </p>

          </form>
        </div>

      </div>
    </main>
  );
}
