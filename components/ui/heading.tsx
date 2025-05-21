import * as React from "react"
import { cn } from "@/lib/utils"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  size?: "h1" | "h2" | "h3" | "h4" | "custom"
}

/**
 * A customizable heading component that can render as any heading element (h1-h6)
 * while maintaining consistent typography styling based on the design system.
 */
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Tag = "h2", size, children, ...props }, ref) => {
    // If size is not specified, default to using the same size as the tag
    const headingSize = size || Tag
    
    // Define size-based classes
    const sizeClasses = {
      h1: "text-h1 font-bold tracking-tight",
      h2: "text-h2 font-semibold tracking-tight",
      h3: "text-h3 font-semibold tracking-tight",
      h4: "text-h4 font-semibold tracking-tight",
      h5: "text-base font-medium",
      h6: "text-sm font-medium",
      custom: "", // No predefined styles, fully rely on className
    }
    
    return (
      <Tag
        ref={ref}
        className={cn(
          // Apply size-based classes if not custom
          headingSize !== "custom" && sizeClasses[headingSize],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = "Heading"

export { Heading }