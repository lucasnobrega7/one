/**
 * Utilitário para navegação entre domínios
 */

import { clerkConfig } from "./auth/clerk-multi-domain"

export type DomainType = "dashboard" | "login" | "api" | "docs"

/**
 * Obtém a URL completa para um domínio específico
 */
export function getDomainUrl(domain: DomainType, path = "/"): string {
  const baseUrl = {
    dashboard: clerkConfig.dashboardUrl,
    login: clerkConfig.loginUrl,
    api: clerkConfig.apiUrl,
    docs: clerkConfig.docsUrl,
  }[domain]

  // Garante que o path comece com /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

/**
 * Redireciona para um domínio específico
 */
export function redirectToDomain(domain: DomainType, path = "/"): void {
  if (typeof window !== "undefined") {
    window.location.href = getDomainUrl(domain, path)
  }
}

/**
 * Verifica se a URL atual pertence a um domínio específico
 */
export function isCurrentDomain(domain: DomainType): boolean {
  if (typeof window === "undefined") return false

  const domainUrl = getDomainUrl(domain).replace(/https?:\/\//, "")
  return window.location.hostname.includes(domainUrl.split("/")[0])
}
