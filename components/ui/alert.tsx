import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground shadow-lg backdrop-blur-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white/90 dark:bg-gray-900/90 text-foreground border-gray-200 dark:border-gray-700",
        destructive:
          "border-red-200 bg-red-50/90 text-red-800 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        success: "border-green-200 bg-green-50/90 text-green-800 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning: "border-yellow-200 bg-yellow-50/90 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/20 dark:text-yellow-300 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        info: "border-blue-200 bg-blue-50/90 text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
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
    className={cn("mb-1 font-bold leading-none tracking-tight", className)}
    style={{ fontFamily: 'Tajwal, sans-serif' }}
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
