
import { toast as sonnerToast, type ToastT } from "sonner";
import { useState } from "react";

export function toast(...args: Parameters<typeof sonnerToast>) {
  return sonnerToast(...args);
}

interface UseToastReturn {
  toast: typeof sonnerToast;
  dismiss: (toastId?: number | string) => void;
}

export function useToast(): UseToastReturn {
  // This is just a wrapper around sonner's toast
  // to match the shadcn/ui pattern
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss
  }
}
