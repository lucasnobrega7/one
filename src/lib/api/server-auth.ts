// Este arquivo só deve ser importado em componentes do servidor
import { auth } from "@clerk/nextjs/server"
import { apiRequest } from "./api-client"

// Função para obter o token JWT do Clerk (server-side)
export async function getServerAuthToken(): Promise<string | null> {
  try {
    const { getToken } = auth()
    const token = await getToken()
    return token
  } catch (error) {
    console.error("Error getting server auth token:", error)
    return null
  }
}

// Função para fazer requisições autenticadas (server-side)
export async function serverAuthenticatedRequest<T>(options: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  body?: any
  params?: Record<string, string>
  headers?: Record<string, string>
}): Promise<T> {
  const token = await getServerAuthToken()

  if (!token) {
    throw new Error("Authentication required")
  }

  return apiRequest<T>({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
