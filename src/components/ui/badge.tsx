
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        secondary:
          "border-transparent bg-gradient-to-r from-gray-600 to-gray-700 text-white",
        blue:
          "border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white",
        green:
          "border-transparent bg-gradient-to-r from-green-600 to-emerald-500 text-white",
        red:
          "border-transparent bg-gradient-to-r from-red-600 to-rose-500 text-white",
        purple:
          "border-transparent bg-gradient-to-r from-purple-600 to-violet-500 text-white",
        amber:
          "border-transparent bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
        destructive:
          "border-transparent bg-gradient-to-r from-red-600 to-rose-700 text-white",
        outline: 
          "text-foreground bg-black/20 backdrop-blur-sm border-white/20 hover:bg-white/5",
        success:
          "border-transparent bg-gradient-to-r from-green-600 to-emerald-500 text-white",
        gradient:
          "badge-gradient text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
