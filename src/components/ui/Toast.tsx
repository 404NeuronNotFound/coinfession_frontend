"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500/10 border-green-500/50",
    error: "bg-destructive/10 border-destructive/50",
    info: "bg-blue-500/10 border-blue-500/50",
  }[type];

  const textColor = {
    success: "text-green-700",
    error: "text-destructive",
    info: "text-blue-700",
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[type];

  const iconColor = {
    success: "text-green-600",
    error: "text-destructive",
    info: "text-blue-600",
  }[type];

  return (
    <div className={`fixed top-4 right-4 rounded-lg border ${bgColor} p-4 flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-top-2 duration-300 z-50`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
      <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      <button onClick={onClose} className="ml-auto flex-shrink-0">
        <X className={`w-4 h-4 ${textColor} hover:opacity-70 transition-opacity`} />
      </button>
    </div>
  );
}
