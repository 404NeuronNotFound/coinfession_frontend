import { InputHTMLAttributes, ReactNode } from "react";
import { Tokens } from "@/lib/theme";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  tk: Tokens;
  /** Optional leading icon — rendered inside the input on the left */
  icon?: ReactNode;
}

/**
 * InputField — reusable labeled text input with optional icon and inline error.
 * Used on: Register, Login, Profile edit, any form.
 */
export default function InputField({
  label,
  error,
  tk,
  icon,
  className = "",
  id,
  ...props
}: InputFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={`text-[11px] font-semibold uppercase tracking-wider ${tk.textFaint}`}
      >
        {label}
      </label>

      <div className="relative">
        {/* Leading icon */}
        {icon && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${tk.textFaint}`}
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          className={[
            "w-full rounded-md py-2.5 text-sm outline-none transition-colors",
            icon ? "pl-9 pr-4" : "px-4",
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
      </div>

      {error && (
        <p className="text-[11px] text-[#E05454] leading-snug">{error}</p>
      )}
    </div>
  );
}