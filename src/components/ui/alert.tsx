
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-md border-white/10 text-foreground",
        destructive:
          "bg-gradient-to-br from-red-950/60 to-black/80 backdrop-blur-md border-red-500/30 text-red-400 [&>svg]:text-red-400",
        success:
          "bg-gradient-to-br from-green-950/60 to-black/80 backdrop-blur-md border-green-500/30 text-green-400 [&>svg]:text-green-400",
        warning:
          "bg-gradient-to-br from-amber-950/60 to-black/80 backdrop-blur-md border-amber-500/30 text-amber-400 [&>svg]:text-amber-400",
        info:
          "bg-gradient-to-br from-blue-950/60 to-black/80 backdrop-blur-md border-blue-500/30 text-blue-400 [&>svg]:text-blue-400",
        purple:
          "bg-gradient-to-br from-purple-950/60 to-black/80 backdrop-blur-md border-purple-500/30 text-purple-400 [&>svg]:text-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
