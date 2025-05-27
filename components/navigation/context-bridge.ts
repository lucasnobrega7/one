'use client'

/**
 * Sistema de Context Bridge para preservar estado entre subdomínios
 */

export interface NavigationContext {
  currentPath: string
  timestamp: number
  user?: string
  subdomain: string
  returnUrl?: string
  breadcrumbs?: Breadcrumb[]
}

export interface Breadcrumb {
  label: string
  href: string
  subdomain: string
}

export class ContextBridge {
  private static readonly STORAGE_KEY = 'nav-context'
  private static readonly BREADCRUMB_KEY = 'nav-breadcrumbs'
  private static readonly MAX_AGE = 30 * 60 * 1000 // 30 minutos

  /**
   * Preserva o contexto atual antes de navegar para outro subdomínio
   */
  static preserveContext(targetSubdomain: string, context: Partial<NavigationContext>) {
    if (typeof window === 'undefined') return

    const fullContext: NavigationContext = {
      currentPath: window.location.pathname,
      timestamp: Date.now(),
      subdomain: this.getCurrentSubdomain(),
      ...context,
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fullContext))
    
    // Adicionar ao breadcrumb trail
    this.addToBreadcrumbs({
      label: this.getSubdomainLabel(fullContext.subdomain),
      href: window.location.href,
      subdomain: fullContext.subdomain
    })
  }

  /**
   * Restaura o contexto ao chegar em um novo subdomínio
   */
  static restoreContext(): NavigationContext | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const context: NavigationContext = JSON.parse(stored)
      
      // Verificar se o contexto não expirou
      if (Date.now() - context.timestamp > this.MAX_AGE) {
        this.clearContext()
        return null
      }

      return context
    } catch (error) {
      console.error('Erro ao restaurar contexto:', error)
      return null
    }
  }

  /**
   * Limpa o contexto armazenado
   */
  static clearContext() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Adiciona uma entrada ao trail de breadcrumbs
   */
  static addToBreadcrumbs(breadcrumb: Breadcrumb) {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.BREADCRUMB_KEY)
      let breadcrumbs: Breadcrumb[] = stored ? JSON.parse(stored) : []
      
      // Evitar duplicatas
      breadcrumbs = breadcrumbs.filter(b => 
        b.subdomain !== breadcrumb.subdomain || b.href !== breadcrumb.href
      )
      
      breadcrumbs.push(breadcrumb)
      
      // Manter apenas os últimos 5 breadcrumbs
      if (breadcrumbs.length > 5) {
        breadcrumbs = breadcrumbs.slice(-5)
      }
      
      localStorage.setItem(this.BREADCRUMB_KEY, JSON.stringify(breadcrumbs))
    } catch (error) {
      console.error('Erro ao adicionar breadcrumb:', error)
    }
  }

  /**
   * Recupera o trail de breadcrumbs
   */
  static getBreadcrumbs(): Breadcrumb[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.BREADCRUMB_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao recuperar breadcrumbs:', error)
      return []
    }
  }

  /**
   * Determina o subdomínio atual baseado na URL
   */
  static getCurrentSubdomain(): string {
    if (typeof window === 'undefined') return 'unknown'

    const hostname = window.location.hostname
    
    if (hostname.includes('localhost') || hostname.includes('vercel.app')) {
      // Em desenvolvimento ou Vercel, determinar baseado no path
      const path = window.location.pathname
      if (path.startsWith('/dashboard')) return 'dash'
      if (path.startsWith('/docs')) return 'docs'
      if (path.startsWith('/auth') || path.startsWith('/login')) return 'login'
      return 'lp'
    }

    // Em produção, extrair do hostname
    const subdomain = hostname.split('.')[0]
    return ['lp', 'login', 'dash', 'docs', 'api'].includes(subdomain) ? subdomain : 'lp'
  }

  /**
   * Converte o código do subdomínio para um label legível
   */
  static getSubdomainLabel(subdomain: string): string {
    const labels: Record<string, string> = {
      'lp': 'Home',
      'login': 'Login',
      'dash': 'Dashboard', 
      'docs': 'Documentação',
      'api': 'API'
    }
    
    return labels[subdomain] || subdomain
  }

  /**
   * Gera URL de retorno com contexto preservado
   */
  static generateReturnUrl(targetSubdomain: string, path: string = '/'): string {
    const context = this.restoreContext()
    
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${targetSubdomain}.agentesdeconversao.ai`
      : `http://localhost:3000${targetSubdomain === 'lp' ? '' : `/${targetSubdomain}`}`
    
    const url = new URL(path, baseUrl)
    
    if (context) {
      url.searchParams.set('returnFrom', context.subdomain)
      if (context.currentPath) {
        url.searchParams.set('returnPath', context.currentPath)
      }
    }
    
    return url.toString()
  }

  /**
   * Verifica se existe um contexto de retorno na URL atual
   */
  static getReturnContext(): { subdomain: string; path: string } | null {
    if (typeof window === 'undefined') return null

    const params = new URLSearchParams(window.location.search)
    const returnFrom = params.get('returnFrom')
    const returnPath = params.get('returnPath')
    
    if (returnFrom) {
      return {
        subdomain: returnFrom,
        path: returnPath || '/'
      }
    }
    
    return null
  }
}