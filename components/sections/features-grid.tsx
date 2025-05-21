import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { Heading } from "@/components/ui/heading"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { type LucideIcon } from "lucide-react"
import { Icon } from "@/components/ui/icon"

interface FeatureItem {
  title: string
  description: string
  icon?: LucideIcon
}

interface FeaturesGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4
  variant?: "cards" | "minimal" | "bordered"
}

/**
 * Features grid section component for displaying multiple feature items
 * in a responsive grid layout with different styling options.
 */
export function FeaturesGrid({
  className,
  title,
  description,
  features,
  columns = 3,
  variant = "cards",
  ...props
}: FeaturesGridProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }

  const variantClasses = {
    cards: "",
    minimal: "gap-y-8",
    bordered: "gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-surface-stroke",
  }

  const renderFeature = (feature: FeatureItem, index: number) => {
    switch (variant) {
      case "cards":
        return (
          <Card key={index} className="h-full">
            <CardHeader>
              {feature.icon && (
                <div className="mb-3">
                  <Icon icon={feature.icon} size="lg" color="accent" />
                </div>
              )}
              <CardTitle className="mb-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        )
      case "minimal":
        return (
          <div key={index} className="flex flex-col">
            {feature.icon && (
              <div className="mb-4">
                <Icon icon={feature.icon} size="lg" color="primary" />
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        )
      case "bordered":
        return (
          <div key={index} className="p-6 sm:p-8">
            {feature.icon && (
              <div className="mb-4">
                <Icon icon={feature.icon} size="lg" color="accent" />
              </div>
            )}
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section
      className={cn("py-16 md:py-24", className)}
      {...props}
    >
      <Container>
        {(title || description) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <Heading as="h2" className="mb-4">
                {title}
              </Heading>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-1 gap-6", 
            columnClasses[columns],
            variantClasses[variant]
          )}
        >
          {features.map((feature, index) => renderFeature(feature, index))}
        </div>
      </Container>
    </section>
  )
}