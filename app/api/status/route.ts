import { NextResponse } from "next/server"

/**
 * Consolidated API route for checking system status
 * Replaces multiple test/check routes
 */
// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions)

//     // Only allow admins to access detailed status information
//     const isAdmin = session?.user?.roles?.includes("admin")

//     if (!session) {
//       return NextResponse.json(
//         {
//           status: "Authenticated session required",
//         },
//         { status: 401 },
//       )
//     }

//     // Basic status check for regular users
//     if (!isAdmin) {
//       return NextResponse.json({
//         status: "online",
//         timestamp: new Date().toISOString(),
//       })
//     }

//     // Detailed status check for admins
//     const dbStatus = await checkDatabaseConnection()
//     const openaiStatus = process.env.OPENAI_API_KEY
//       ? await checkOpenAIConnection()
//       : { success: false, message: "API key not configured" }
//     const supabaseStatus = await checkSupabaseConnection()
//     const envStatus = checkEnvironmentVariables()

//     return NextResponse.json({
//       timestamp: new Date().toISOString(),
//       database: dbStatus,
//       openai: openaiStatus,
//       supabase: supabaseStatus,
//       environment: envStatus,
//     })
//   } catch (error: any) {
//     console.error("Error checking system status:", error)
//     return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
//   }
// }

// Helper functions
// async function checkDatabaseConnection() {
//   try {
//     const { data, error } = await supabase.from("users").select("id").limit(1)
//     if (error) throw error
//     return { success: true, message: "Database connection successful" }
//   } catch (error: any) {
//     return { success: false, message: error.message }
//   }
// }

// async function checkOpenAIConnection() {
//   try {
//     const response = await fetch("https://api.openai.com/v1/models", {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//     })

//     if (response.ok) {
//       return { success: true, message: "OpenAI connection successful" }
//     } else {
//       const error = await response.json()
//       return {
//         success: false,
//         message: `OpenAI API error: ${error.error?.message || "Unknown error"}`,
//       }
//     }
//   } catch (error: any) {
//     return { success: false, message: `OpenAI connection error: ${error.message}` }
//   }
// }

// async function checkSupabaseConnection() {
//   try {
//     const { data, error } = await supabase.auth.getSession()
//     if (error) throw error
//     return { success: true, message: "Supabase connection successful" }
//   } catch (error: any) {
//     return { success: false, message: error.message }
//   }
// }

// function checkEnvironmentVariables() {
//   const requiredVars = [
//     "NEXTAUTH_URL",
//     "NEXTAUTH_SECRET",
//     "NEXT_PUBLIC_SUPABASE_URL",
//     "NEXT_PUBLIC_SUPABASE_ANON_KEY",
//     "SUPABASE_SERVICE_ROLE_KEY",
//     "POSTGRES_URL",
//     "POSTGRES_URL_NON_POOLING",
//   ]

//   const missingVars = requiredVars.filter((varName) => !process.env[varName])

//   return {
//     success: missingVars.length === 0,
//     message:
//       missingVars.length === 0
//         ? "All required environment variables are set"
//         : `Missing environment variables: ${missingVars.join(", ")}`,
//     variables: requiredVars.reduce(
//       (acc, varName) => {
//         acc[varName] = process.env[varName] ? "✓ Set" : "✗ Missing"
//         return acc
//       },
//       {} as Record<string, string>,
//     ),
//   }
// }

export const runtime = "edge"

export async function GET(request: Request) {
  const startTime = Date.now()

  // Get geo information from request headers
  const geo = {
    country: request.headers.get("x-country") || "Unknown",
    city: request.headers.get("x-city") || "Unknown",
    region: request.headers.get("x-region") || "Unknown",
  }

  const responseTime = Date.now() - startTime

  return NextResponse.json({
    status: "online",
    timestamp: new Date().toISOString(),
    geo,
    responseTime: `${responseTime}ms`,
    version: "1.0.0",
  })
}
