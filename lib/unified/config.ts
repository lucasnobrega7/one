export const unifiedConfig = {
  // API Principal
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br',
  
  // Autenticação
  AUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  
  // Banco de Dados (como fallback/cache local)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // IA Services (para funcionalidades diretas quando necessário)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  COHERE_API_KEY: process.env.COHERE_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
  
  // Features toggles para migração gradual
  USE_LOCAL_DB: process.env.USE_LOCAL_DB === 'true',
  USE_EXTERNAL_API: process.env.USE_EXTERNAL_API !== 'false',
  USE_LOCAL_AI: process.env.USE_LOCAL_AI === 'true',
  USE_VECTOR_SEARCH: process.env.USE_VECTOR_SEARCH === 'true',
  
  // Sync configuration
  ENABLE_AUTO_SYNC: process.env.ENABLE_AUTO_SYNC !== 'false',
  SYNC_INTERVAL_MS: parseInt(process.env.SYNC_INTERVAL_MS || '60000'),
  
  // Cache configuration
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '300'),
  ENABLE_CACHE: process.env.ENABLE_CACHE !== 'false',
  
  // Error handling
  RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS || '3'),
  RETRY_DELAY_MS: parseInt(process.env.RETRY_DELAY_MS || '1000'),
  
  // Development
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true',
}

// Helper function to check if external API is available
export async function isExternalApiAvailable(): Promise<boolean> {
  if (!unifiedConfig.USE_EXTERNAL_API) return false
  
  try {
    const response = await fetch(`${unifiedConfig.API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    return response.ok
  } catch {
    return false
  }
}

// Helper to get the appropriate AI service
export function getAIService() {
  if (unifiedConfig.USE_LOCAL_AI) {
    return 'local'
  }
  return 'external'
}

// Helper to determine if we should use cache
export function shouldUseCache(): boolean {
  return unifiedConfig.ENABLE_CACHE && unifiedConfig.USE_LOCAL_DB
}

// Export type for config
export type UnifiedConfig = typeof unifiedConfig