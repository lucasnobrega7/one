import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import bcrypt from "bcryptjs"
import { createClient } from "@/utils/supabase/server"
import type { Role } from "@/lib/auth/permissions"

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      // Add profile callback to ensure we have all necessary data
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.picture,
          roles: ["user"], // Assign default role
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null // Return null instead of throwing
        }

        try {
          const supabase = createClient()

          // Fetch user from Supabase
          const { data: user, error } = await supabase.from("users").select("*").eq("email", credentials.email).single()

          if (error || !user) {
            return null // Return null instead of throwing
          }

          // Verify password
          if (!user.password) {
            return null // Return null instead of throwing
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null // Return null instead of throwing
          }

          // Fetch user roles
          const { data: userRolesList, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.id)

          if (rolesError) {
            // Don't fail login if roles can't be fetched
          }

          const roles = userRolesList?.map((ur) => ur.role) || ["user"]

          return {
            id: user.id,
            name: user.name || "",
            email: user.email,
            image: user.image || "",
            roles: roles,
          }
        } catch (error) {
          return null // Return null instead of throwing
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      try {
        // Include account and profile for access to more data
        if (user) {
          token.id = user.id
          token.roles = user.roles || ["user"]

          // Check if it's a Google login and ensure we have an ID
          if (account?.provider === "google" && !token.id && profile?.sub) {
            token.id = profile.sub
          }
        }
        return token
      } catch (error) {
        return token // Return the token as is in case of error
      }
    },
    async session({ session, token }: { session: Session; token: any }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.roles = (token.roles as Role[]) || ["user"] // Ensure there's always at least the "user" role
          session.user.permissions = []
        }
        return session
      } catch (error) {
        return session // Return the session as is in case of error
      }
    },
    async signIn({ user, account, profile }) {
      try {
        // Ensure user is created/updated in Supabase after Google login
        if (account?.provider === "google" && user.email) {
          try {
            const supabase = createClient()

            // Check if user already exists
            const { data: existingUser } = await supabase.from("users").select("id").eq("email", user.email).single()

            if (!existingUser) {
              // Create user if doesn't exist
              await supabase.from("users").insert({
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              })

              // Add default role
              await supabase.from("user_roles").insert({
                user_id: user.id,
                role: "user",
              })
            }
          } catch (error) {
            // Don't fail login if sync fails
          }
        }
        return true
      } catch (error) {
        return false // Return false in case of error
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        // Allow relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allow callback URLs on the same domain
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      } catch (error) {
        return baseUrl // Return baseUrl in case of error
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      // Auth error logging disabled in production
    },
    warn(code) {
      // Auth warning logging disabled in production
    },
    debug(code, metadata) {
      // Auth debug logging disabled in production
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
