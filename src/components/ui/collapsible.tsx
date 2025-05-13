
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"
import * as React from "react"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleTrigger> & {
    curved?: boolean
  }
>(({ className, curved = true, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    className={cn(curved && "rounded-2xl", className)}
    {...props}
  />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> & {
    curved?: boolean
  }
>(({ className, curved = true, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(curved && "mt-2 rounded-2xl overflow-hidden", className)}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
