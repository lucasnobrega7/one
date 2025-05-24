import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

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
          const supabase = createClient()
          
          // Query user from Supabase
          const { data: user, error } = await supabase
            .from('users')
            .select('id, email, name, password')
            .eq('email', credentials.email)
            .single()
          
          if (error || !user) {
            return null
          }
          
          // Verify password if exists (for users with password)
          if (user.password) {
            const isValid = await bcrypt.compare(credentials.password as string, user.password)
            if (!isValid) {
              return null
            }
          }
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Ensure user is authorized
    authorized: async ({ auth }) => {
      return !!auth?.user
    },
    
    // Include user ID in JWT token
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = "user" // Default role
      }
      
      // For OAuth providers, create user in Supabase if not exists
      if (account?.provider === "google" && user) {
        // This will be handled in the signIn callback
      }
      
      return token
    },
    
    // Include user data in session
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    
    // Handle sign in
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const supabase = createClient()
          
          // Check if user exists
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single()
          
          if (!existingUser) {
            // Create new user
            const { error } = await supabase
              .from('users')
              .insert({
                email: user.email,
                name: user.name,
                image: user.image,
                email_verified: new Date().toISOString(),
              })
            
            if (error) {
              console.error("Error creating user:", error)
              return false
            }
          }
        } catch (error) {
          console.error("SignIn error:", error)
          return false
        }
      }
      
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)