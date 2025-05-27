import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { Role } from "@/lib/auth/permissions"

export const config: NextAuthConfig = {
  providers: [
    // Only include Google provider if valid credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && 
        process.env.GOOGLE_CLIENT_SECRET && 
        process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" 
      ? [GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })] 
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          // Import Supabase client
          const { createClient } = await import("@supabase/supabase-js")
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
          
          if (!supabaseUrl || !supabaseServiceKey) {
            return null
          }
          
          const supabase = createClient(supabaseUrl, supabaseServiceKey)
          
          // Use Supabase Auth directly
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })
            
          if (authError || !authData.user) {
            return null
          }
          
          const user = authData.user
          
          // Return user data from Supabase Auth
          return {
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email || "",
            roles: [Role.Admin], // For now, give admin role to authenticated users
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard subdomain after successful login
      if (url.startsWith("/dashboard") || url === "/") {
        return "https://dash.agentesdeconversao.ai"
      }
      // Allow callback URLs on the same domain
      if (url.startsWith(baseUrl)) return url
      // Allow callback URLs on subdomain
      if (url.startsWith("https://dash.agentesdeconversao.ai")) return url
      if (url.startsWith("https://login.agentesdeconversao.ai")) return url
      if (url.startsWith("https://lp.agentesdeconversao.ai")) return url
      // Default redirect to dashboard
      return "https://dash.agentesdeconversao.ai"
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.roles = (user as any).roles
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.roles = token.roles || []
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)