// Cliente de API base
import { config } from "../config"

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  body?: any
  params?: Record<string, string>
  headers?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export async function apiRequest<T>({ method, path, body, params, headers = {} }: RequestOptions): Promise<T> {
  // Construir a URL com parâmetros de consulta
  const url = new URL(path, config.apiBaseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
  }

  // Configurar as opções da requisição
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Incluir cookies para autenticação
  }

  // Adicionar corpo da requisição para métodos não-GET
  if (body && method !== "GET") {
    options.body = JSON.stringify(body)
  }

  // Fazer a requisição
  const response = await fetch(url.toString(), options)

  // Verificar se a resposta é JSON
  const contentType = response.headers.get("content-type")
  const isJson = contentType && contentType.includes("application/json")

  // Processar a resposta
  const data = isJson ? await response.json() : await response.text()

  // Verificar se a resposta foi bem-sucedida
  if (!response.ok) {
    throw new ApiError(`API request failed: ${response.status} ${response.statusText}`, response.status, data)
  }

  return data as T
}

// Função para fazer requisições autenticadas (client-side)
export async function clientAuthenticatedRequest<T>(options: RequestOptions, token: string): Promise<T> {
  if (!token) {
    throw new ApiError("Authentication required", 401)
  }

  return apiRequest<T>({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}

// Alias para compatibilidade com código existente
export const authenticatedRequest = clientAuthenticatedRequest
