import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-100/50 via-orange-100/50 to-amber-100/50",
        "bg-[length:200%_100%] animate-pulse",
        "before:absolute before:inset-0 before:bg-gradient-to-r",
        "before:from-transparent before:via-white/40 before:to-transparent",
        "before:animate-[shimmer_2s_infinite] before:translate-x-[-100%]",
        "dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-800/50",
        "dark:before:via-gray-600/20",
        "w-full max-w-full box-border", // Fixed width issues
        className
      )}
      style={{
        animationDelay: `${Math.random() * 2}s`
      }}
      {...props}
    >
      <div className="opacity-0">Loading...</div>
    </div>
  )
}

export { Skeleton }