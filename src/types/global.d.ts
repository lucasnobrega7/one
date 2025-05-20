// Tipos globais para a aplicação

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
    CLERK_SECRET_KEY: string
    CLERK_WEBHOOK_SECRET: string
    NEXT_PUBLIC_CLERK_BASE_URL: string
    NEXT_PUBLIC_APP_URL: string
    OPENAI_API_KEY: string
    NEXT_PUBLIC_ZAPI_URL: string
    ZAPI_TOKEN: string
  }
}

// Extensões para tipos existentes
interface Window {
  dataLayer?: any[]
}
