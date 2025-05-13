
import { useToast as useHookToast, toast as toastHook } from "@radix-ui/react-toast";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  duration?: number;
};

const useToast = () => {
  const { toast } = useHookToast();
  
  return {
    toast: (props: ToastProps) => toast(props)
  };
};

const toast = {
  success: (message: string, options?: Omit<ToastProps, "title" | "variant">) => {
    toastHook({
      title: "Success",
      description: message,
      variant: "success",
      duration: options?.duration || 3000,
    });
  },
  error: (message: string, options?: Omit<ToastProps, "title" | "variant">) => {
    toastHook({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: options?.duration || 5000,
    });
  },
  warning: (message: string, options?: Omit<ToastProps, "title" | "variant">) => {
    toastHook({
      title: "Warning",
      description: message,
      variant: "warning",
      duration: options?.duration || 4000,
    });
  },
  info: (message: string, options?: Omit<ToastProps, "title" | "variant">) => {
    toastHook({
      title: "Info",
      description: message,
      variant: "info",
      duration: options?.duration || 3000,
    });
  },
};

export { useToast, toast };
