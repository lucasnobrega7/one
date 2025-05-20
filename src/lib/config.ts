/**
 * Configurações globais da aplicação
 */
export const config = {
  // API
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  // Clerk
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkBaseUrl: process.env.NEXT_PUBLIC_CLERK_BASE_URL,

  // Vercel Blob
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,

  // PostHog
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,

  // App
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Limites
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxFilesPerDatastore: 100,

  // Temas
  theme: {
    background: "#0e0e10",
    cardBackground: "#1a1a1d",
    cardBorder: "#27272a",
    gradientStart: "#46B2E0",
    gradientMiddle: "#8A53D2",
    gradientEnd: "#E056A0",
  },
}
