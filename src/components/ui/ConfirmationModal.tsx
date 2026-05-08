"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";
import { AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`relative rounded-lg shadow-lg max-w-sm w-full ${
          isDark ? "bg-background border border-border" : "bg-white border border-slate-200"
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between p-6 border-b ${
          isDark ? "border-border" : "border-slate-200"
        }`}>
          <div className="flex items-start gap-3">
            {isDangerous && (
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            )}
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 p-6 border-t ${
          isDark ? "border-border" : "border-slate-200"
        }`}>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing || isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || isLoading}
            variant={isDangerous ? "destructive" : "default"}
            className="flex-1"
          >
            {isProcessing || isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
