
import React from "react"
import { cn } from "@/lib/utils"

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  className?: string;
}

export function Shimmer({
  width = "100%",
  height = "1rem",
  rounded = "md",
  className,
  ...props
}: ShimmerProps) {
  return (
    <div
      className={cn(`shimmer-bg rounded-${rounded}`, className)}
      style={{ width, height }}
      {...props}
    />
  )
}
