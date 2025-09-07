import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border-2 border-transparent",
          "bg-white/80 backdrop-blur-sm px-4 py-3 text-base shadow-lg shadow-black/5",
          "transition-all duration-300 resize-y",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "focus:border-amber-400 focus:shadow-xl focus:shadow-amber-400/20 focus:-translate-y-1 focus:bg-white",
          "hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-gray-800/80 dark:text-white dark:border-gray-700",
          "dark:focus:border-amber-400 dark:focus:bg-gray-800",
          "dark:hover:border-amber-500",
          "font-['Tajawal',sans-serif] leading-relaxed",
          "relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber-400/10 before:to-orange-400/10",
          "before:opacity-0 focus:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }