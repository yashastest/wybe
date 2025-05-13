
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Map Sonner toast types to shadcn/ui toast variants
  const mapToastTypeToVariant = (type?: string): "default" | "destructive" => {
    if (type === "error" || type === "destructive") return "destructive"
    return "default"
  }

  return (
    <ToastProvider>
      {toasts && toasts.map(function ({ id, title, description, action, type, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            variant={mapToastTypeToVariant(type)}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
