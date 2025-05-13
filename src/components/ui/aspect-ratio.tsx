
"use client"

import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { cn } from "@/lib/utils"

// Enhanced AspectRatio with additional props for curved corners
const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
    curved?: boolean;
    curvedSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  }
>(({ className, curved = false, curvedSize = "lg", ...props }, ref) => {
  const curvedClasses = curved ? 
    `overflow-hidden rounded-${curvedSize}` : 
    "";
    
  return (
    <AspectRatioPrimitive.Root
      ref={ref}
      className={cn(curvedClasses, className)}
      {...props}
    />
  );
});

AspectRatio.displayName = "AspectRatio";

export { AspectRatio }
