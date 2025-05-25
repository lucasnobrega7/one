import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"

interface CTAProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: "default" | "secondary" | "gradient"
  }
  secondaryAction?: {
    text: string
    href: string
    variant?: "outline" | "secondary" | "link"
  }
  variant?: "default" | "gradient" | "dark"
}

/**
 * Call-to-action section with standardized styling and layout options.
 * Supports main title, description, primary and secondary actions.
 */
export function CTA({
  className,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  ...props
}: CTAProps) {
  const variantStyles = {
    default: "bg-card",
    gradient: "bg-accent-gradient text-white",
    dark: "bg-surface-base dark:bg-surface-raised text-white",
  }

  // Adjust button variant based on CTA variant
  const getActionVariant = (): "link" | "secondary" | "default" | "destructive" | "outline" | "ghost" => {
    if (variant === "gradient" || variant === "dark") {
      return "outline"
    }
    return "default"
  }

  const getSecondaryActionVariant = (): "link" | "secondary" | "default" | "destructive" | "outline" | "ghost" => {
    if (variant === "gradient" || variant === "dark") {
      return "secondary"
    }
    return "outline"
  }

  return (
    <section
      className={cn(
        "py-16 md:py-20",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <Container size="lg">
        <div className="flex flex-col items-center text-center">
          <Heading 
            as="h2" 
            className="mb-4 max-w-2xl mx-auto"
          >
            {title}
          </Heading>
          
          {description && (
            <p className={cn(
              "max-w-2xl mx-auto mb-8 text-lg",
              variant === "default" ? "text-muted-foreground" : "text-white/80"
            )}>
              {description}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button 
              asChild 
              variant={getActionVariant()} 
              size="lg"
            >
              <a href={action.href}>{action.text}</a>
            </Button>
            
            {secondaryAction && (
              <Button 
                asChild 
                variant={getSecondaryActionVariant()} 
                size="lg"
              >
                <a href={secondaryAction.href}>{secondaryAction.text}</a>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}