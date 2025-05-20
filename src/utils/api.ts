import { config } from "@/lib/config"

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
}

/**
 * Função para fazer requisições autenticadas à API
 */
export async function authenticatedRequest<T>(options: RequestOptions): Promise<T> {
  const { method, path, body, headers = {}, params = {} } = options

  // Construir URL com parâmetros de consulta
  const url = new URL(`${config.apiBaseUrl}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  // Obter token de autenticação (implementação depende do seu sistema de autenticação)
  const token = await getAuthToken()

  // Configurar headers
  const requestHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...headers,
  }

  // Fazer requisição
  const response = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Verificar se a resposta foi bem-sucedida
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `API request failed with status ${response.status}`)
  }

  // Retornar dados da resposta
  return response.json()
}

/**
 * Função para obter token de autenticação
 * Esta implementação depende do seu sistema de autenticação
 */
async function getAuthToken(): Promise<string> {
  // Implementação simplificada - substituir pela sua lógica de autenticação
  // Por exemplo, obter token do localStorage, cookie, ou de um serviço de autenticação
  return localStorage.getItem("authToken") || ""
}
