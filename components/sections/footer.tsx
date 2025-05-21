import * as React from "react"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import Link from "next/link"

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode
  navigation?: {
    title?: string
    links: {
      name: string
      href: string
    }[]
  }[]
  legal?: {
    name: string
    href: string
  }[]
  social?: {
    name: string
    href: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  }[]
  copyright?: string
  variant?: "default" | "minimal" | "centered"
}

/**
 * Footer component with flexible structure and styling options.
 * Supports navigation sections, legal links, social icons, and copyright text.
 */
export function Footer({
  className,
  logo,
  navigation,
  legal,
  social,
  copyright = `© ${new Date().getFullYear()} Your Company, Inc. All rights reserved.`,
  variant = "default",
  ...props
}: FooterProps) {
  const renderDefaultFooter = () => (
    <Container>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="col-span-1 md:col-span-4">
          <div className="flex flex-col gap-6">
            {logo && <div>{logo}</div>}
            {social && (
              <div className="flex items-center gap-4">
                {social.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={item.name}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {navigation && (
          <div className="col-span-1 md:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              {navigation.map((section, index) => (
                <div key={index}>
                  {section.title && (
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      {section.title}
                    </h3>
                  )}
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link 
                          href={link.href} 
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-surface-stroke pt-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-sm text-muted-foreground">{copyright}</p>
          
          {legal && (
            <nav className="flex gap-6">
              {legal.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </Container>
  )

  const renderMinimalFooter = () => (
    <Container>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {logo && <div>{logo}</div>}
        
        {legal && (
          <nav className="flex flex-wrap justify-center gap-6">
            {legal.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
        
        <p className="text-sm text-muted-foreground">{copyright}</p>
        
        {social && (
          <div className="flex items-center gap-4">
            {social.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={item.name}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  )

  const renderCenteredFooter = () => (
    <Container>
      <div className="flex flex-col items-center text-center">
        {logo && <div className="mb-6">{logo}</div>}
        
        {navigation && navigation[0] && (
          <nav className="flex flex-wrap justify-center gap-6 mb-6">
            {navigation[0].links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
        
        {social && (
          <div className="flex justify-center gap-6 mb-8">
            {social.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                aria-label={item.name}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-4 border-t border-surface-stroke pt-8 w-full">
          <p className="text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </Container>
  )

  const renderFooterVariant = () => {
    switch (variant) {
      case "minimal":
        return renderMinimalFooter()
      case "centered":
        return renderCenteredFooter()
      default:
        return renderDefaultFooter()
    }
  }

  return (
    <footer
      className={cn(
        "border-t border-surface-stroke py-12 md:py-16",
        className
      )}
      {...props}
    >
      {renderFooterVariant()}
    </footer>
  )
}