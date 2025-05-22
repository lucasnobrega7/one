import { Redis } from "ioredis"

let redisClient: Redis | null = null

/**
 * Obtém uma instância do cliente Redis
 */
export function getRedisClient(): Redis {
  if (!redisClient) {
    // Verificar se a URL do Redis está configurada
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) {
      throw new Error("REDIS_URL não está configurada nas variáveis de ambiente")
    }

    // Criar nova instância do cliente Redis
    redisClient = new Redis(redisUrl)

    // Configurar handlers de erro
    redisClient.on("error", (err) => {
      console.error("Erro na conexão Redis:", err)
    })
  }

  return redisClient
}

/**
 * Armazena um valor no cache com TTL opcional
 */
export async function setCache(key: string, value: any, ttlSeconds?: number): Promise<void> {
  const client = getRedisClient()
  const serializedValue = JSON.stringify(value)

  if (ttlSeconds) {
    await client.set(key, serializedValue, "EX", ttlSeconds)
  } else {
    await client.set(key, serializedValue)
  }
}

/**
 * Recupera um valor do cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  const value = await client.get(key)

  if (!value) return null

  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error("Erro ao fazer parse do valor do cache:", error)
    return null
  }
}

/**
 * Remove um valor do cache
 */
export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient()
  await client.del(key)
}

/**
 * Wrapper para função que implementa cache
 */
export async function withCache<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
  // Tentar obter do cache primeiro
  const cachedValue = await getCache<T>(key)
  if (cachedValue) return cachedValue

  // Se não estiver no cache, executar a função
  const result = await fn()

  // Armazenar o resultado no cache
  await setCache(key, result, ttlSeconds)

  return result
}
