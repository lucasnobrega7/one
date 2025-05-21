import * as React from "react"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "muted" | "accent" | "success" | "warning" | "destructive" | "inherit"
}

/**
 * A consistent icon component that wraps Lucide icons
 * with standardized sizing and color options.
 */
const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ className, icon: IconComponent, size = "md", color = "inherit", ...props }, ref) => {
    // Size mapping to pixel values
    const sizeMap = {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    }

    // Color mapping to tailwind classes
    const colorMap = {
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent",
      success: "text-green-600 dark:text-green-500",
      warning: "text-yellow-600 dark:text-yellow-500",
      destructive: "text-destructive",
      inherit: "text-inherit",
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", colorMap[color], className)}
        {...props}
      >
        <IconComponent size={sizeMap[size]} strokeWidth={1.5} />
      </div>
    )
  }
)

Icon.displayName = "Icon"

export { Icon }