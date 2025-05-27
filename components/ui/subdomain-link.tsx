"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SubdomainLinkProps {
  subdomain: 'lp' | 'login' | 'dash' | 'docs' | 'api'
  path?: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asButton?: boolean
}

const subdomainUrls = {
  lp: 'https://one-2wow7l0ne-agentesdeconversao.vercel.app',
  login: 'https://one-2wow7l0ne-agentesdeconversao.vercel.app',
  dash: 'https://one-2wow7l0ne-agentesdeconversao.vercel.app',
  docs: 'https://one-2wow7l0ne-agentesdeconversao.vercel.app',
  api: 'https://one-2wow7l0ne-agentesdeconversao.vercel.app'
}

export function SubdomainLink({
  subdomain,
  path = '',
  children,
  className,
  variant = "default",
  size = "default",
  asButton = false
}: SubdomainLinkProps) {
  const url = `${subdomainUrls[subdomain]}${path}`

  if (asButton) {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={className}
      >
        <Link href={url} className="transition-colors">
          {children}
        </Link>
      </Button>
    )
  }

  return (
    <Link 
      href={url}
      className={cn("transition-colors", className)}
    >
      {children}
    </Link>
  )
}