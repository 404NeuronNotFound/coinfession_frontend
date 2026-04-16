"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeStore } from "@/stores/themeStore";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";

// ─── Types, API, Store ────────────────────────────────────
import { RegisterPayload, ApiError } from "@/types/auth";
import { register } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

// ─── Local form state types ───────────────────────────────
type FormFields = RegisterPayload;
type FormErrors = Partial<Record<keyof FormFields | "form", string>>;

const EMPTY: FormFields = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

// ─── Validation ───────────────────────────────────────────
function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!form.username?.trim()) errors.username = "Username is required";
  if (!form.first_name?.trim()) errors.first_name = "First name is required";
  if (!form.last_name?.trim()) errors.last_name = "Last name is required";
  if (!form.email?.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
  if (!form.password?.trim()) errors.password = "Password is required";
  else if (form.password.length < 8) errors.password = "Min. 8 characters";
  if (form.password !== form.confirm_password) errors.confirm_password = "Passwords don't match";
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();

  // ── Theme
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const d = theme === "dark";

  // Clear any stale session
  const clearSession = useAuthStore((s) => s.clearSession);
  useEffect(() => { clearSession(); }, []);

  // ── Form state
  const [form, setForm] = useState<FormFields>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  // ── Submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true])
    ) as Record<keyof FormFields, boolean>;
    setTouched(allTouched);

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    if (!agreed) {
      setErrors({ form: "Please agree to the Terms of Service and Privacy Policy." });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await register(form);
      setSubmitted(true);
    } catch (err: unknown) {
      const apiErr = err as ApiError;

      if (apiErr.fieldErrors) {
        const mapped: FormErrors = {};
        for (const [field, messages] of Object.entries(apiErr.fieldErrors)) {
          const key = field as keyof FormErrors;
          mapped[key] = messages[0];
        }
        setErrors(mapped);
      } else {
        setErrors({
          form: apiErr.message ?? "Something went wrong. Please try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-200 bg-background">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="fixed top-5 right-6"
          aria-label="Toggle theme"
        >
          {d ? <SunIcon /> : <MoonIcon />}
        </Button>

        <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border items-stretch">
          <div className="flex-1 flex items-center justify-center p-16 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-3 text-foreground">
                You&apos;re in.
              </h2>
              <p className="text-sm leading-relaxed mb-8 max-w-xs mx-auto text-muted-foreground">
                Account created. Check your inbox to verify your email,
                then start logging trades.
              </p>
              <Button onClick={() => router.push("/login")} size="lg">
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Form
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-200 bg-background">

      {/* Theme toggle */}
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="fixed top-5 right-6"
        aria-label="Toggle theme"
      >
        {d ? <SunIcon /> : <MoonIcon />}
      </Button>

      {/* Split card */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border">

        {/* ── LEFT — brand pitch ── */}
        <div className="w-full md:w-[42%] flex flex-col justify-between p-10 border-b md:border-b-0 md:border-r border-border bg-card">
          <div>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline mb-10">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img
                  src="/CoinFessionLogo.svg"
                  alt="CoinFession Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                CoinFession
              </span>
            </a>

            {/* Headline */}
            <h2 className="text-2xl font-black tracking-tight leading-snug mb-3 text-foreground">
              Start your<br />trade journal today.
            </h2>
            <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
              Create your free account and stop repeating the same costly trading mistakes.
            </p>

            {/* Steps */}
            <div className="space-y-5">
              {[
                { n: "1", title: "Create your account", desc: "Takes less than a minute." },
                { n: "2", title: "Log your first trade", desc: "Coin, price, amount, date, and how you felt." },
                { n: "3", title: "Let AI mirror you back", desc: "See your patterns. Get brutally honest feedback." },
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

        {/* ── RIGHT — form ── */}
        <div className="flex-1 p-10 bg-background">

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-xl font-black tracking-tight mb-1 text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Username */}
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

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first_name" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  First name
                </label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Juan"
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  onBlur={() => handleBlur("first_name")}
                  className={errors.first_name ? "border-destructive" : ""}
                />
                {errors.first_name && (
                  <p className="text-xs text-destructive mt-1">{errors.first_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Last name
                </label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="dela Cruz"
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  onBlur={() => handleBlur("last_name")}
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && (
                  <p className="text-xs text-destructive mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 chars"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirm_password" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Confirm password
                </label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={form.confirm_password}
                  onChange={(e) => handleChange("confirm_password", e.target.value)}
                  onBlur={() => handleBlur("confirm_password")}
                  className={errors.confirm_password ? "border-destructive" : ""}
                />
                {errors.confirm_password && (
                  <p className="text-xs text-destructive mt-1">{errors.confirm_password}</p>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none mt-1">
              <div className="relative shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <div className="w-4 h-4 rounded border border-input bg-background transition-colors peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/30" />
                <svg
                  className="absolute inset-0 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-primary-foreground"
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="3 8 6.5 11.5 13 4.5"/>
                </svg>
              </div>
              <span className="text-xs leading-relaxed text-muted-foreground">
                I agree to the{" "}
                <a href="/terms" className="underline text-primary hover:text-primary/80">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="underline text-primary hover:text-primary/80">Privacy Policy</a>
              </span>
            </label>

            {/* Form-level error */}
            {errors.form && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-2.5">
                {errors.form}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account →"
              )}
            </Button>

            {/* Login link */}
            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </a>
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}
