/**
 * Configuração da API para diferentes ambientes
 */
export const apiConfig = {
  // URL base da API
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",

  // Timeout padrão para requisições (em ms)
  timeout: 30000,

  // Headers padrão para todas as requisições
  headers: {
    "Content-Type": "application/json",
  },
}

/**
 * Retorna a URL completa para um endpoint da API
 */
export function getApiUrl(path: string): string {
  // Remover barras duplicadas na junção
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${apiConfig.baseUrl}${normalizedPath}`
}
