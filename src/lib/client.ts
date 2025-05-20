import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token de autenticação
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode adicionar lógica para lidar com erros específicos
    // como redirecionamento para página de login em caso de 401
    return Promise.reject(error)
  },
)

export default client
