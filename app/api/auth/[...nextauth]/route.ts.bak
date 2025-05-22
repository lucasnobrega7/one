import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Create a safe handler that catches errors
const handler = async (req: Request, context: { params: { nextauth: string[] } }) => {
  try {
    // Use NextAuth's built-in handler
    const authHandler = NextAuth(authOptions)
    return await authHandler(req, context)
  } catch (error) {
    console.error("NextAuth error:", error)
    // Return a proper JSON error response instead of throwing
    return new Response(
      JSON.stringify({
        error: "Authentication error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export { handler as GET, handler as POST }
