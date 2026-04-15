"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Theme, getTokens } from "@/lib/theme";
import { useThemeStore } from "@/stores/themeStore";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";
import InputField from "@/components/ui/InputField";
import PasswordInput from "@/components/ui/PasswordInput";

// ─── Types, API, Store ────────────────────────────────────
import { RegisterPayload, ApiError } from "@/types/auth";
import { register } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

// Register page never writes to the auth store.
// clearSession() is called on mount to wipe any stale session
// in case an already-logged-in user navigates to /register.

// ─── Local form state types ───────────────────────────────
// These are UI-only — separate from RegisterPayload on purpose.
// RegisterPayload goes to the API; FormFields drives the inputs.
type FormFields = RegisterPayload; // same shape here, but kept distinct

interface FormErrors {
  username?:         string;
  first_name?:       string;
  last_name?:        string;
  email?:            string;
  password?:         string;
  confirm_password?: string;
  form?:             string;
}

const EMPTY: FormFields = {
  username:         "",
  first_name:       "",
  last_name:        "",
  email:            "",
  password:         "",
  confirm_password: "",
};

// ─── Client-side validation ───────────────────────────────
// Runs before hitting the API — gives instant feedback.
// Server errors (e.g. duplicate username) are handled separately.
function validate(data: FormFields): FormErrors {
  const e: FormErrors = {};

  if (!data.username.trim())
    e.username = "Username is required.";
  else if (data.username.length < 3)
    e.username = "At least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(data.username))
    e.username = "Letters, numbers, and underscores only.";

  if (!data.first_name.trim())
    e.first_name = "First name is required.";

  if (!data.last_name.trim())
    e.last_name = "Last name is required.";

  if (!data.email.trim())
    e.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    e.email = "Enter a valid email address.";

  if (!data.password)
    e.password = "Password is required.";
  else if (data.password.length < 8)
    e.password = "At least 8 characters.";

  if (!data.confirm_password)
    e.confirm_password = "Please confirm your password.";
  else if (data.password !== data.confirm_password)
    e.confirm_password = "Passwords do not match.";

  return e;
}

// ─── Page ─────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();

  // ── Theme
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const tk = getTokens(theme);
  const d  = theme === "dark";

  // Clear any stale session — register must always start fresh.
  // If a user is somehow logged in and hits /register, wipe it.
  const clearSession = useAuthStore((s) => s.clearSession);
  useEffect(() => { clearSession(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form state
  const [form, setForm]       = useState<FormFields>(EMPTY);
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [agreed, setAgreed]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);


  // ── Re-validate touched fields on every keystroke
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

  // ── Submit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Touch every field to surface all errors at once
    const allTouched = Object.fromEntries(
      Object.keys(EMPTY).map((k) => [k, true])
    ) as Record<keyof FormFields, boolean>;
    setTouched(allTouched);

    // 1. Client-side validation
    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    // 2. Terms agreement check
    if (!agreed) {
      setErrors({ form: "Please agree to the Terms of Service and Privacy Policy." });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // 3. Call POST /api/user/register/
      const newUser = await register(form);

      // 4. Registration succeeded — do NOT touch the auth store.
      //    The new account has no tokens yet. The user must log in
      //    to receive their access + refresh token pair.
      //    Any previous session is irrelevant here — show success
      //    and let the user navigate to /login.
      setSubmitted(true);

    } catch (err: unknown) {
      // 6. Map DRF field errors back to form fields
      const apiErr = err as ApiError;

      if (apiErr.fieldErrors) {
        const mapped: FormErrors = {};
        for (const [field, messages] of Object.entries(apiErr.fieldErrors)) {
          const key = field as keyof FormErrors;
          // Take only the first message per field to keep it clean
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

  // ── Shared styles
  const pageWrap  = `min-h-screen flex items-center justify-center px-4 py-10 transition-colors duration-200 ${tk.bg}`;
  const outerCard = `w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden border ${tk.border}`;

  // ── Success screen
  if (submitted) {
    return (
      <main className={pageWrap}>
        <button
          onClick={toggleTheme}
          className={`fixed top-5 right-6 p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors`}
          aria-label="Toggle theme"
        >
          {d ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className={`${outerCard} items-stretch`}>
          <div className="flex-1 flex items-center justify-center p-16 text-center">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#50AF95]/15 flex items-center justify-center mx-auto mb-6">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#50AF95" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className={`text-2xl font-black tracking-tight mb-3 ${tk.text}`}>
                You&apos;re in.
              </h2>
              <p className={`text-sm leading-relaxed mb-8 max-w-xs mx-auto ${tk.textMuted}`}>
                Account created. Check your inbox to verify your email,
                then start logging trades.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="inline-flex bg-[#50AF95] hover:bg-[#3d9e82] text-[#0a0a0a] font-bold px-8 py-2.5 rounded-md text-sm transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Form
  return (
    <main className={pageWrap}>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-5 right-6 p-2 rounded-md border ${tk.border} ${tk.textMid} ${tk.socialHover} transition-colors`}
        aria-label="Toggle theme"
      >
        {d ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Split card */}
      <div className={outerCard}>

        {/* ── LEFT — brand pitch ── */}
        <div className={`
          w-full md:w-[42%] flex flex-col justify-between p-10
          border-b md:border-b-0 md:border-r ${tk.border}
          ${d ? "bg-[#111111]" : "bg-[#f0efea]"}
        `}>
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
              <span className={`font-bold text-sm tracking-tight ${tk.text}`}>
                CoinFession
              </span>
            </a>

            {/* Headline */}
            <h2 className={`text-2xl font-black tracking-tight leading-snug mb-3 ${tk.text}`}>
              Start your<br />trade journal today.
            </h2>
            <p className={`text-sm leading-relaxed mb-8 ${tk.textMuted}`}>
              Create your free account and stop repeating the same costly trading mistakes.
            </p>

            {/* Steps */}
            <div className="space-y-5">
              {[
                { n: "1", title: "Create your account",    desc: "Takes less than a minute."                          },
                { n: "2", title: "Log your first trade",   desc: "Coin, price, amount, date, and how you felt."       },
                { n: "3", title: "Let AI mirror you back", desc: "See your patterns. Get brutally honest feedback."    },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full shrink-0 flex items-center justify-center
                    text-[11px] font-bold border mt-0.5
                    ${d ? "border-white/[0.12] text-white/40" : "border-black/[0.15] text-black/40"}
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

        {/* ── RIGHT — form ── */}
        <div className={`flex-1 p-10 ${d ? "bg-[#0a0a0a]" : "bg-white"}`}>

          {/* Header */}
          <div className="mb-7">
            <h1 className={`text-xl font-black tracking-tight mb-1 ${tk.text}`}>
              Create an account
            </h1>
            <p className={`text-sm ${tk.textMuted}`}>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Username */}
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
            />

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <InputField
                tk={tk}
                label="First name"
                id="first_name"
                name="first_name"
                type="text"
                autoComplete="given-name"
                placeholder="Juan"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                onBlur={() => handleBlur("first_name")}
                error={errors.first_name}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              />
              <InputField
                tk={tk}
                label="Last name"
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                placeholder="dela Cruz"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                onBlur={() => handleBlur("last_name")}
                error={errors.last_name}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              />
            </div>

            {/* Email */}
            <InputField
              tk={tk}
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              }
            />

            {/* Password + Confirm — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <PasswordInput
                tk={tk}
                label="Password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="Min. 8 chars"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                error={errors.password}
              />
              <PasswordInput
                tk={tk}
                label="Confirm password"
                id="confirm_password"
                name="confirm_password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={form.confirm_password}
                onChange={(e) => handleChange("confirm_password", e.target.value)}
                onBlur={() => handleBlur("confirm_password")}
                error={errors.confirm_password}
              />
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
                <div className={`
                  w-4 h-4 rounded border transition-colors
                  peer-checked:bg-[#50AF95] peer-checked:border-[#50AF95]
                  peer-focus:ring-2 peer-focus:ring-[#50AF95]/30
                  ${d ? "border-white/[0.2] bg-white/[0.04]" : "border-black/[0.2] bg-black/[0.03]"}
                `}/>
                <svg
                  className="absolute inset-0 w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-[#0a0a0a]"
                  viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="3 8 6.5 11.5 13 4.5"/>
                </svg>
              </div>
              <span className={`text-xs leading-relaxed ${tk.textMuted}`}>
                I agree to the{" "}
                <a href="/terms" className="underline text-[#50AF95]">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" className="underline text-[#50AF95]">Privacy Policy</a>
              </span>
            </label>

            {/* Form-level error (API or terms) */}
            {errors.form && (
              <p className="text-xs text-[#E05454] bg-[#E05454]/8 border border-[#E05454]/20 rounded-md px-4 py-2.5">
                {errors.form}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#50AF95] hover:bg-[#3d9e82] disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2"
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
            </button>

            {/* Login link */}
            <p className={`text-xs text-center ${tk.textMuted}`}>
              Already have an account?{" "}
              <a href="/login" className="text-[#50AF95] font-semibold hover:underline">
                Sign in
              </a>
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}