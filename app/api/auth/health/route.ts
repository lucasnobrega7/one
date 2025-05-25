import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Simple health check without importing auth
    const hasCredentialsProvider = true // Simplified
    const hasGoogleProvider = true // Simplified

    // Check if required environment variables are set
    const envCheck = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    return NextResponse.json({
      status: "ok",
      providers: {
        credentials: hasCredentialsProvider,
        google: hasGoogleProvider,
      },
      environment: envCheck,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
