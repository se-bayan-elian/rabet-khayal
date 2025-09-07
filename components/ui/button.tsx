import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl hover:from-amber-500 hover:to-orange-600 hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-1 focus:ring-2 focus:ring-amber-400/50 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-1 focus:ring-2 focus:ring-red-400/50 active:scale-95",
        outline:
          "border-2 border-amber-200 bg-white/80 backdrop-blur-sm text-amber-700 rounded-xl hover:border-amber-400 hover:bg-amber-50 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-amber-400/50 active:scale-95 dark:border-amber-800 dark:bg-gray-800/80 dark:text-amber-300 dark:hover:bg-amber-900/20",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-gray-400/50 active:scale-95 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100",
        ghost: 
          "bg-transparent text-gray-700 rounded-xl hover:bg-amber-50 hover:text-amber-700 hover:shadow-md focus:ring-2 focus:ring-amber-400/50 active:scale-95 dark:text-gray-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-300",
        link: 
          "text-amber-600 underline-offset-4 hover:underline hover:text-amber-700 focus:ring-2 focus:ring-amber-400/50 rounded-lg dark:text-amber-400 dark:hover:text-amber-300",
        creative:
          "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 hover:scale-105 focus:ring-2 focus:ring-purple-400/50 active:scale-95 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500 before:via-pink-500 before:to-purple-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10",
        glass:
          "bg-white/10 backdrop-blur-xl border border-white/20 text-gray-800 rounded-2xl hover:bg-white/20 hover:shadow-xl hover:-translate-y-1 focus:ring-2 focus:ring-white/50 active:scale-95 dark:text-white",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 px-4 py-2 text-sm rounded-lg",
        lg: "h-14 px-8 py-4 text-lg rounded-2xl",
        icon: "h-12 w-12 rounded-xl",
        xl: "h-16 px-10 py-5 text-xl rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          "font-['Tajawal',sans-serif]",
          className
        )}
        ref={ref}
        {...props}
      >
        {variant === "creative" && (
          <span className="relative z-10">{children}</span>
        )}
        {variant !== "creative" && children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }