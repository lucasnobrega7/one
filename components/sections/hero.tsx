import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  action?: {
    text: string
    href: string
    variant?: "default" | "secondary" | "outline" | "gradient"
  }
  secondaryAction?: {
    text: string
    href: string
    variant?: "default" | "secondary" | "outline" | "link"
  }
  imageSrc?: string
  imageAlt?: string
}

/**
 * Hero section component with standardized layout and styling.
 * Supports main and secondary CTAs, headings, description, and an optional image.
 */
export function Hero({
  className,
  title,
  description,
  action,
  secondaryAction,
  imageSrc,
  imageAlt = "Hero image",
  ...props
}: HeroProps) {
  return (
    <section
      className={cn("py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800", className)}
      {...props}
    >
      <Container className="flex flex-col items-center text-center">
        <Heading 
          as="h1" 
          className="max-w-3xl mb-6 text-4xl md:text-5xl lg:text-6xl font-bold"
        >
          {title}
        </Heading>
        
        <p className="max-w-2xl mb-8 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {action && (
            <Button 
              asChild 
              variant={action.variant === "gradient" ? "default" : (action.variant as any) || "default"} 
              size="lg"
              className="px-8 py-3"
            >
              <a href={action.href}>{action.text}</a>
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              asChild 
              variant={secondaryAction.variant || "outline"} 
              size="lg"
              className="px-8 py-3"
            >
              <a href={secondaryAction.href}>{secondaryAction.text}</a>
            </Button>
          )}
        </div>
        
        {imageSrc && (
          <div className="mt-12 w-full max-w-4xl mx-auto">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </div>
        )}
      </Container>
    </section>
  )
}