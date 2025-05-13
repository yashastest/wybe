
import { toast } from "sonner";

// Configure the toast with custom properties for curved UI
const configuredToast = {
  ...toast,
  success: (title: string, options?: any) => 
    toast.success(`✅ ${title}`, { 
      className: "rounded-xl border border-green-500/20 shadow-curved",
      ...options 
    }),
  error: (title: string, options?: any) => 
    toast.error(`❌ ${title}`, { 
      className: "rounded-xl border border-red-500/20 shadow-curved",
      ...options 
    }),
  info: (title: string, options?: any) => 
    toast.info(`ℹ️ ${title}`, { 
      className: "rounded-xl border border-blue-500/20 shadow-curved",
      ...options 
    }),
  warning: (title: string, options?: any) => 
    toast.warning(`⚠️ ${title}`, { 
      className: "rounded-xl border border-yellow-500/20 shadow-curved",
      ...options 
    }),
};

// Export the enhanced toast
export { configuredToast as toast };
