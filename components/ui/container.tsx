import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "xl" | "full"
  as?: React.ElementType
}

/**
 * A container component for constraining content width and centering it.
 * Follows a standardized responsive approach with proper spacing.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "default", as: Component = "div", ...props }, ref) => {
    const sizes = {
      sm: "max-w-3xl",
      default: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full",
    }

    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

Container.displayName = "Container"

export { Container }