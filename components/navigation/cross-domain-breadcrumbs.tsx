'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Home, ArrowLeft, ExternalLink } from 'lucide-react'
import { ContextBridge, type Breadcrumb } from './context-bridge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CrossDomainBreadcrumbsProps {
  currentLabel?: string
  currentPath?: string
  showReturnButton?: boolean
  className?: string
}

export function CrossDomainBreadcrumbs({
  currentLabel,
  currentPath,
  showReturnButton = true,
  className
}: CrossDomainBreadcrumbsProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [returnContext, setReturnContext] = useState<{
    subdomain: string
    path: string
  } | null>(null)

  useEffect(() => {
    // Carregar breadcrumbs e contexto de retorno
    const storedBreadcrumbs = ContextBridge.getBreadcrumbs()
    const returnCtx = ContextBridge.getReturnContext()
    
    setBreadcrumbs(storedBreadcrumbs)
    setReturnContext(returnCtx)

    // Adicionar página atual aos breadcrumbs se fornecida
    if (currentLabel && currentPath) {
      const currentSubdomain = ContextBridge.getCurrentSubdomain()
      const currentBreadcrumb: Breadcrumb = {
        label: currentLabel,
        href: window.location.href,
        subdomain: currentSubdomain
      }
      
      ContextBridge.addToBreadcrumbs(currentBreadcrumb)
    }
  }, [currentLabel, currentPath])

  const handleReturnNavigation = () => {
    if (!returnContext) return

    const returnUrl = ContextBridge.generateReturnUrl(
      returnContext.subdomain, 
      returnContext.path
    )
    
    ContextBridge.preserveContext(returnContext.subdomain, {
      returnUrl: window.location.href
    })
    
    window.location.href = returnUrl
  }

  if (!breadcrumbs.length && !returnContext) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {/* Botão de Retorno */}
      {showReturnButton && returnContext && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReturnNavigation}
          className="border-[#27272a] text-gray-300 hover:bg-[#27272a]/30 flex items-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Voltar para {ContextBridge.getSubdomainLabel(returnContext.subdomain)}
          <ExternalLink className="w-3 h-3 opacity-50" />
        </Button>
      )}

      {/* Breadcrumbs Trail */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-gray-400">
          <Home className="w-4 h-4" />
          
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={`${breadcrumb.subdomain}-${index}`}>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              
              <Link
                href={breadcrumb.href}
                className="hover:text-white transition-colors flex items-center gap-1"
                onClick={() => {
                  ContextBridge.preserveContext(breadcrumb.subdomain, {
                    returnUrl: window.location.href
                  })
                }}
              >
                {breadcrumb.label}
                {breadcrumb.subdomain !== ContextBridge.getCurrentSubdomain() && (
                  <ExternalLink className="w-3 h-3 opacity-50" />
                )}
              </Link>
            </React.Fragment>
          ))}
          
          {currentLabel && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-white font-medium">{currentLabel}</span>
            </>
          )}
        </nav>
      )}
    </div>
  )
}