#!/usr/bin/env node

/**
 * Script to remove redundant files and consolidate functionality
 */

import fs from "fs"
import path from "path"

// Files to be removed
const filesToRemove = [
  // Test/check API routes that can be consolidated
  "app/api/test/openai/route.ts",
  "app/api/test/pinecone/route.ts",
  "app/api/test/cohere/route.ts",
  "app/api/pinecone/test/route.ts",
  "app/api/pinecone/index-info/route.ts",
  "app/api/pinecone/test-embedding/route.ts",
  "app/api/check-env/route.ts",
  "app/api/check-status/route.ts",
  "app/api/drizzle-check/route.ts",
  "app/api/db-status/route.ts",

  // Redundant auth routes
  "app/auth/callback/route.ts", // Functionality moved to NextAuth

  // Unused components
  "components/particles-background.tsx",
  "components/hero-geometric.tsx",

  // Unused utility files
  "lib/pinecone-utils.ts",

  // Duplicate layout files
  "app/login/page.tsx", // Using app/(auth)/login/page.tsx instead
  "app/signup/page.tsx", // Using app/(auth)/signup/page.tsx instead
]

// Create a consolidated API status route
const consolidatedApiStatusRoute = `
import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"
import { supabase } from "@/lib/db"

/**
 * Consolidated API route for checking system status
 * Replaces multiple test/check routes
 */
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check database connection
    const dbStatus = await checkDatabaseConnection()
    
    // Check OpenAI connection if API key exists
    const openaiStatus = process.env.OPENAI_API_KEY 
      ? await checkOpenAIConnection() 
      : { success: false, message: "API key not configured" }
    
    // Check Supabase connection
    const supabaseStatus = await checkSupabaseConnection()
    
    // Check environment variables
    const envStatus = checkEnvironmentVariables()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      database: dbStatus,
      openai: openaiStatus,
      supabase: supabaseStatus,
      environment: envStatus
    })
  } catch (error: any) {
    console.error("Error checking system status:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions
async function checkDatabaseConnection() {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1)
    if (error) throw error
    return { success: true, message: "Database connection successful" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

async function checkOpenAIConnection() {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\`,
      },
    })
    
    if (response.ok) {
      return { success: true, message: "OpenAI connection successful" }
    } else {
      const error = await response.json()
      return { 
        success: false, 
        message: \`OpenAI API error: \${error.error?.message || "Unknown error"}\` 
      }
    }
  } catch (error: any) {
    return { success: false, message: \`OpenAI connection error: \${error.message}\` }
  }
}

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

function checkEnvironmentVariables() {
  const requiredVars = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
  ]
  
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  return {
    success: missingVars.length === 0,
    message: missingVars.length === 0 
      ? "All required environment variables are set" 
      : \`Missing environment variables: \${missingVars.join(", ")}\`
  }
}
`

// Process files
console.log("Removing redundant files...")
filesToRemove.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`✅ Removed: ${file}`)
  } else {
    console.log(`⚠️ File not found: ${file}`)
  }
})

// Create consolidated API status route
const consolidatedApiStatusPath = path.join(process.cwd(), "app/api/status/route.ts")
fs.writeFileSync(consolidatedApiStatusPath, consolidatedApiStatusRoute)
console.log("✅ Created consolidated API status route: app/api/status/route.ts")

// Update package.json to remove unused dependencies
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

const depsToRemove = ["@paralleldrive/cuid2", "embla-carousel-react", "vaul", "sonner"]

depsToRemove.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    delete packageJson.dependencies[dep]
    console.log(`✅ Removed dependency: ${dep}`)
  }
})

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
console.log("✅ Updated package.json")

console.log("\nRedundancy cleanup completed!")
