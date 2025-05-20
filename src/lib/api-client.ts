import axios from "axios"

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Cliente de API configurado para comunicação entre domínios
 */
const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para enviar cookies entre domínios
})

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(async (config) => {
  // Se estiver no navegador, adiciona o token de autenticação
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default apiClient
