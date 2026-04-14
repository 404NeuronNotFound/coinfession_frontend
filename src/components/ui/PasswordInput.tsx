"use client";

import { useState, InputHTMLAttributes } from "react";
import { Tokens } from "@/lib/theme";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  tk: Tokens;
  /**
   * Pass true when the parent renders its own label row
   * (e.g. Login page adds "Forgot password?" inline with the label).
   * The input still gets the correct id — just the <label> element is hidden.
   */
  hideLabel?: boolean;
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function EyeOnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

/**
 * PasswordInput — reusable password field with lock icon + show/hide toggle.
 * Used on: Register (password + confirm_password), Login, Change Password.
 */
export default function PasswordInput({
  label,
  error,
  tk,
  hideLabel = false,
  className = "",
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {!hideLabel && label && (
        <label
          htmlFor={inputId}
          className={`text-[11px] font-semibold uppercase tracking-wider ${tk.textFaint}`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Lock icon — left */}
        <span className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${tk.textFaint}`}>
          <LockIcon />
        </span>

        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={[
            "w-full rounded-md py-2.5 pl-9 pr-10 text-sm outline-none transition-colors",
            tk.bgInput,
            tk.text,
            tk.inputPH,
            error
              ? "border border-[#E05454]/60 focus:border-[#E05454]"
              : `border ${tk.inputBorder} ${tk.inputFocus}`,
            className,
          ].join(" ")}
          {...props}
        />

        {/* Eye toggle — right */}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${tk.textFaint} hover:${tk.textMuted}`}
        >
          {visible ? <EyeOffIcon /> : <EyeOnIcon />}
        </button>
      </div>

      {error && (
        <p className="text-[11px] text-[#E05454] leading-snug">{error}</p>
      )}
    </div>
  );
}