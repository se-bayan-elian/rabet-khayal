import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-2xl border border-transparent",
      "bg-white/90 backdrop-blur-xl shadow-xl shadow-black/5",
      "transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10",
      "before:absolute before:inset-0 before:bg-gradient-to-r",
      "before:from-amber-400/10 before:via-orange-400/10 before:to-pink-400/10",
      "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
      "after:absolute after:top-0 after:left-0 after:right-0 after:h-1",
      "after:bg-gradient-to-r after:from-amber-400 after:via-orange-500 after:to-pink-500",
      "after:transform after:scale-x-0 hover:after:scale-x-100",
      "after:transition-transform after:duration-500 after:origin-left",
      "dark:bg-gray-900/90 dark:border-gray-800/50",
      "dark:shadow-black/20 dark:hover:shadow-amber-500/20",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 pb-4 relative z-10",
      "font-['Tajawal',sans-serif]",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xl font-bold text-gray-900 dark:text-white",
      "bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent",
      "font-['Tajawal',sans-serif] leading-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm text-gray-600 dark:text-gray-300 leading-relaxed",
      "font-['Tajawal',sans-serif]",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "p-6 pt-0 relative z-10",
      "font-['Tajawal',sans-serif]",
      className
    )} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 relative z-10",
      "font-['Tajawal',sans-serif]",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }