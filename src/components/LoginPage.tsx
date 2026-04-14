"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter }                       from "next/navigation";
import { Theme, getTokens }                from "@/lib/theme";
import { SunIcon, MoonIcon }               from "@/components/ui/Icons";
import InputField                          from "@/components/ui/InputField";
import PasswordInput                       from "@/components/ui/PasswordInput";

// ─── Types, API, Store ────────────────────────────────────
import { LoginPayload, ApiError } from "@/types/auth";
import { login, getMe }           from "@/api/auth";
import { useAuthStore }           from "@/stores/authStore";

// ─── Local form types ─────────────────────────────────────
// Kept separate from LoginPayload intentionally —
// UI form state (what the inputs hold) is not the same concern
// as the API payload (what gets sent over the wire).
type FormFields = LoginPayload;

interface FormErrors {
  username?: string;
  password?: string;
  form?:     string; // credential errors from Django: { "detail": "..." }
}

const EMPTY: FormFields = {
  username: "",
  password: "",
};

// ─── Client-side validation ───────────────────────────────
// Minimal — only checks fields are not empty.
// Credential correctness is the server's job.
function validate(data: FormFields): FormErrors {
  const e: FormErrors = {};
  if (!data.username.trim()) e.username = "Username is required.";
  if (!data.password)        e.password = "Password is required.";
  return e;
}

// ─── Page ─────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  // ── Theme
  const [theme, setTheme] = useState<Theme>("dark");
  const tk = getTokens(theme);
  const d  = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", d);
  }, [d]);

  // ── Form state
  const [form, setForm]         = useState<FormFields>(EMPTY);
  const [errors, setErrors]     = useState<FormErrors>({});
  const [touched, setTouched]   = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Auth store — pull what we need
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession      = useAuthStore((s) => s.setSession);
  const clearSession    = useAuthStore((s) => s.clearSession);

  // ── Guard: already logged in → go straight to dashboard
  // Runs on mount and whenever isAuthenticated changes.
  // Covers the case where a user navigates to /login manually
  // while still holding a valid session in localStorage.
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // ── Re-validate touched fields on every keystroke
  // Errors only show after the user has touched a field (onBlur),
  // and clear as soon as the value becomes valid again.
  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const all  = validate(form);
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

    // Touch all fields so every error shows at once on submit
    setTouched({ username: true, password: true });

    // 1. Client-side check — don't hit the API with empty fields
    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    // Clear any stale partial state from a previous failed attempt
    // before writing a fresh session. This prevents leftover data
    // (e.g. a user object without tokens) from persisting in the store.
    clearSession();

    try {
      // 2. POST /api/token/
      //    Django Simple JWT validates username + password.
      //    On success: returns { access, refresh }
      //    On failure: throws ApiError with { "detail": "No active account..." }
      const tokens = await login(form);

      // 3. GET /api/user/me/
      //    Use the new access token immediately to fetch the user profile.
      //    If this call fails (unlikely but possible), we do not store
      //    the session — better to show an error than a half-authenticated state.
      const user = await getMe(tokens.access);

      // 4. Store both tokens + user in Zustand (persisted to localStorage).
      //    After this point isAuthenticated becomes true,
      //    the useEffect above fires, and router.replace("/dashboard") runs.
      setSession(tokens, user);

    } catch (err: unknown) {
      const apiErr = err as ApiError;

      // Django returns { "detail": "No active account found..." }
      // for wrong credentials — surfaces as apiErr.message.
      // Any other failure (network, server error) falls back to a
      // generic message so we never show raw JSON to the user.
      setErrors({
        form: apiErr.message ?? "Invalid username or password. Please try again.",
      });

      // Wipe any partial state that may have been written before the error
      clearSession();
    } finally {
      setSubmitting(false);
    }
  }

  // ── Styles
  const pageWrap  = `min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-200 ${tk.bg}`;
  const outerCard = `w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden border ${tk.border}`;

  return (
    <main className={pageWrap}>

      {/* ── Theme toggle ── */}
      <button
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        className={`fixed top-5 right-6 p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors`}
        aria-label="Toggle theme"
      >
        {d ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* ── Split card ── */}
      <div className={outerCard}>

        {/* ─── LEFT — brand pitch ─────────────────────────── */}
        <div className={`
          w-full md:w-[42%] flex flex-col justify-between p-10
          border-b md:border-b-0 md:border-r ${tk.border}
          ${d ? "bg-[#111111]" : "bg-[#f0efea]"}
        `}>
          <div>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 no-underline mb-10">
              <div className="w-8 h-8 rounded-md bg-[#50AF95] flex items-center justify-center shrink-0">
                <span className="text-[#0a0a0a] font-black text-sm">C</span>
              </div>
              <span className={`font-bold text-sm tracking-tight ${tk.text}`}>
                CoinFession
              </span>
            </a>

            {/* Headline */}
            <h2 className={`text-2xl font-black tracking-tight leading-snug mb-3 ${tk.text}`}>
              Welcome back.<br />Your journal missed you.
            </h2>
            <p className={`text-sm leading-relaxed mb-8 ${tk.textMuted}`}>
              Log in to pick up where you left off — trades, patterns,
              and your AI feedback are waiting.
            </p>

            {/* What's inside reminders */}
            <div className="space-y-5">
              {[
                {
                  n:     "1",
                  title: "Your trade history",
                  desc:  "Every buy and sell you've logged, in one place.",
                },
                {
                  n:     "2",
                  title: "Emotion patterns",
                  desc:  "See exactly which feelings cost you money.",
                },
                {
                  n:     "3",
                  title: "AI mirror",
                  desc:  "Updated analysis based on your latest trades.",
                },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full shrink-0 flex items-center justify-center
                    text-[11px] font-bold border mt-0.5
                    ${d
                      ? "border-white/[0.12] text-white/40"
                      : "border-black/[0.15] text-black/40"}
                  `}>
                    {n}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold leading-none mb-0.5 ${tk.text}`}>
                      {title}
                    </p>
                    <p className={`text-xs leading-relaxed ${tk.textFaint}`}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className={`text-xs mt-10 ${tk.textGhost}`}>
            Free forever for personal use. No credit card required.
          </p>
        </div>

        {/* ─── RIGHT — form ───────────────────────────────── */}
        <div className={`flex-1 p-10 ${d ? "bg-[#0a0a0a]" : "bg-white"}`}>

          {/* Form header */}
          <div className="mb-7">
            <h1 className={`text-xl font-black tracking-tight mb-1 ${tk.text}`}>
              Sign in
            </h1>
            <p className={`text-sm ${tk.textMuted}`}>
              Enter your credentials to access your journal
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* ── Username ── */}
            <InputField
              tk={tk}
              label="Username"
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="yourhandle"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              onBlur={() => handleBlur("username")}
              error={errors.username}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
            />

            {/* ── Password — custom label row with "Forgot password?" ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className={`text-[11px] font-semibold uppercase tracking-wider ${tk.textFaint}`}
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className={`text-[11px] no-underline transition-colors ${tk.textFaint} hover:text-[#50AF95]`}
                >
                  Forgot password?
                </a>
              </div>
              <PasswordInput
                tk={tk}
                label="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                error={errors.password}
                hideLabel
              />
            </div>

            {/* ── Credential error from Django ── */}
            {errors.form && (
              <p className="text-xs text-[#E05454] bg-[#E05454]/8 border border-[#E05454]/20 rounded-md px-4 py-2.5 leading-relaxed">
                {errors.form}
              </p>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#50AF95] hover:bg-[#3d9e82] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-2"
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
            </button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3">
              <div className={`flex-1 h-px ${d ? "bg-white/[0.06]" : "bg-black/[0.06]"}`} />
              <span className={`text-[11px] ${tk.textGhost}`}>or</span>
              <div className={`flex-1 h-px ${d ? "bg-white/[0.06]" : "bg-black/[0.06]"}`} />
            </div>

            {/* ── Register link ── */}
            <p className={`text-xs text-center ${tk.textMuted}`}>
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-[#50AF95] font-semibold hover:underline"
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