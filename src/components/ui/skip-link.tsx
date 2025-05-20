"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  className?: string
  children?: React.ReactNode
}

export function SkipLink({ href, className, children = "Pular para o conteúdo principal" }: SkipLinkProps) {
  return (
    <a href={href} className={cn("skip-link", className)}>
      {children}
    </a>
  )
}
