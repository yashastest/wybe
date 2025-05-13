
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "wave" | "pulse";
}

function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-muted",
        variant === "default" && "animate-pulse",
        variant === "wave" && "animate-shimmer relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        variant === "pulse" && "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
