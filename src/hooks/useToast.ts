import { useState, useCallback } from "react";
import { ToastType } from "@/components/ui/Toast";

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = useCallback((message: string, type: ToastType = "success", duration: number = 3000) => {
    setToast({ message, type, isVisible: true });
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
