#!/usr/bin/env node

/**
 * Script to analyze API routes and identify redundancies
 */

import fs from "fs"
import path from "path"

const apiDir = path.join(process.cwd(), "app/api")

// Function to recursively get all files in a directory
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      fileList = getAllFiles(filePath, fileList)
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

// Get all API route files
const apiRoutes = getAllFiles(apiDir)

// Group routes by functionality
const routeGroups: Record<string, string[]> = {
  auth: [],
  user: [],
  agents: [],
  conversations: [],
  knowledge: [],
  admin: [],
  test: [],
  other: [],
}

// Categorize routes
apiRoutes.forEach((route) => {
  const relativePath = route.replace(process.cwd(), "")

  if (relativePath.includes("/api/auth/")) {
    routeGroups.auth.push(relativePath)
  } else if (relativePath.includes("/api/user/")) {
    routeGroups.user.push(relativePath)
  } else if (relativePath.includes("/api/agents/")) {
    routeGroups.agents.push(relativePath)
  } else if (relativePath.includes("/api/conversations/")) {
    routeGroups.conversations.push(relativePath)
  } else if (relativePath.includes("/api/knowledge/")) {
    routeGroups.knowledge.push(relativePath)
  } else if (relativePath.includes("/api/admin/")) {
    routeGroups.admin.push(relativePath)
  } else if (relativePath.includes("/api/test/") || relativePath.includes("/api/check-")) {
    routeGroups.test.push(relativePath)
  } else {
    routeGroups.other.push(relativePath)
  }
})

// Identify potential redundancies
const redundancies: Record<string, string[]> = {}

// Check for test/check routes that can be consolidated
if (routeGroups.test.length > 2) {
  redundancies.test = routeGroups.test
}

// Check for multiple auth-related routes
if (routeGroups.auth.length > 3) {
  redundancies.auth = routeGroups.auth
}

console.log("API Route Analysis:")
console.log("===================")
console.log(`Total API routes: ${apiRoutes.length}`)
console.log("\nRoutes by category:")
Object.entries(routeGroups).forEach(([category, routes]) => {
  console.log(`- ${category}: ${routes.length} routes`)
})

console.log("\nPotential redundancies:")
Object.entries(redundancies).forEach(([category, routes]) => {
  console.log(`\n${category.toUpperCase()} routes that could be consolidated:`)
  routes.forEach((route) => console.log(`- ${route}`))
})

// Identify routes to be removed or consolidated
const routesToRemove = [
  "/app/api/test/openai/route.ts",
  "/app/api/test/pinecone/route.ts",
  "/app/api/test/cohere/route.ts",
  "/app/api/pinecone/test/route.ts",
  "/app/api/pinecone/index-info/route.ts",
  "/app/api/pinecone/test-embedding/route.ts",
  "/app/api/check-env/route.ts",
  "/app/api/check-status/route.ts",
  "/app/api/drizzle-check/route.ts",
  "/app/api/db-status/route.ts",
]

console.log("\nRecommended routes to remove or consolidate:")
routesToRemove.forEach((route) => console.log(`- ${route}`))

// Identify unused dependencies
console.log("\nAnalyzing package.json for unused dependencies...")
const packageJsonPath = path.join(process.cwd(), "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

const potentiallyUnusedDeps = [
  "@paralleldrive/cuid2", // Can be replaced with uuid which is already in use
  "embla-carousel-react", // Check if actually used in the project
  "vaul", // Check if actually used in the project
  "sonner", // Can be replaced with built-in toast from @radix-ui
]

console.log("Potentially unused dependencies:")
potentiallyUnusedDeps.forEach((dep) => console.log(`- ${dep}`))
