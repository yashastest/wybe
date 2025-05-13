
import { useState, useEffect } from "react";
import { toast as sonnerToast, type ToastT } from "sonner";

// Match the expected structure from sonner
type ToastProps = ToastT & {
  id: string | number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

export function toast(...args: Parameters<typeof sonnerToast>) {
  return sonnerToast(...args);
}

interface UseToastReturn {
  toast: typeof sonnerToast;
  dismiss: (toastId?: number | string) => void;
  toasts: ToastProps[];
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // This monitors the sonner toast state
  useEffect(() => {
    // Create a custom event listener for toast events
    const handleToast = (event: CustomEvent<ToastProps>) => {
      const toast = event.detail;
      setToasts((prevToasts) => [...prevToasts, toast]);
    };

    const handleDismiss = (event: CustomEvent<{ id: string | number }>) => {
      const { id } = event.detail;
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

    // Register event listeners
    window.addEventListener("toast", handleToast as EventListener);
    window.addEventListener("toast-dismiss", handleDismiss as EventListener);

    return () => {
      window.removeEventListener("toast", handleToast as EventListener);
      window.removeEventListener("toast-dismiss", handleDismiss as EventListener);
    };
  }, []);

  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
    toasts
  };
}
