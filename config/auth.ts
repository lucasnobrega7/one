import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          // Import Supabase client
          const { createClient } = await import("@supabase/supabase-js")
          const bcrypt = await import("bcryptjs")
          
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
          
          if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Supabase credentials not configured")
            return null
          }
          
          const supabase = createClient(supabaseUrl, supabaseServiceKey)
          
          // Find user by email
          const { data: user, error } = await supabase
            .from("users")
            .select("id, email, name, password")
            .eq("email", credentials.email)
            .single()
            
          if (error || !user) {
            console.error("User not found:", error)
            return null
          }
          
          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            console.error("Invalid password")
            return null
          }
          
          // Get user roles
          const { data: userRoles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)
            
          const roles = userRoles?.map(ur => ur.role) || []
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: roles,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
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
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)