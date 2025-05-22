#!/usr/bin/env node

/**
 * Script to create the refined directory structure
 */

import fs from "fs"
import path from "path"

// Refined directory structure
const directories = [
  // App Router
  "app/(auth)",
  "app/(auth)/login",
  "app/(auth)/signup",
  "app/(auth)/forgot-password",
  "app/(auth)/reset-password",
  "app/(auth)/error",
  "app/(auth)/access-denied",

  "app/(dashboard)",
  "app/(dashboard)/agents",
  "app/(dashboard)/conversations",
  "app/(dashboard)/knowledge",
  "app/(dashboard)/settings",
  "app/(dashboard)/profile",

  "app/admin",
  "app/admin/users",
  "app/admin/api-keys",
  "app/admin/settings",

  "app/api/auth",
  "app/api/agents",
  "app/api/conversations",
  "app/api/knowledge",
  "app/api/user",
  "app/api/admin",
  "app/api/status",

  "app/onboarding",

  // Components
  "components/auth",
  "components/agents",
  "components/conversations",
  "components/knowledge",
  "components/dashboard",
  "components/layout",
  "components/ui",
  "components/forms",

  // Core functionality
  "lib/auth",
  "lib/db",
  "lib/supabase",
  "lib/ai",
  "lib/ai/providers",
  "lib/ai/adapters",
  "lib/cache",

  // Types and utilities
  "types",
  "utils",
  "hooks",
  "contexts",
  "config",
  "constants",

  // Testing
  "tests",
  "tests/unit",
  "tests/integration",
]

// Create directories
console.log("Creating refined directory structure...")
directories.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
    console.log(`✅ Created: ${dir}`)
  } else {
    console.log(`⚠️ Already exists: ${dir}`)
  }
})

// Create index files for key directories to improve imports
const indexFiles = [
  "components/index.ts",
  "components/ui/index.ts",
  "lib/index.ts",
  "lib/auth/index.ts",
  "lib/db/index.ts",
  "lib/ai/index.ts",
  "hooks/index.ts",
  "utils/index.ts",
]

console.log("\nCreating index files for key directories...")
indexFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, `// Export all from this directory\n`)
    console.log(`✅ Created: ${file}`)
  } else {
    console.log(`⚠️ Already exists: ${file}`)
  }
})

// Create a README.md file for each major directory
const readmeFiles = [
  "app/README.md",
  "components/README.md",
  "lib/README.md",
  "hooks/README.md",
  "utils/README.md",
  "types/README.md",
  "tests/README.md",
]

console.log("\nCreating README files for major directories...")
readmeFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file)
  const dirName = path.dirname(file).split("/").pop()

  if (!fs.existsSync(fullPath)) {
    const content = `# ${dirName} Directory\n\nThis directory contains ${dirName}-related files for the Agentes de Conversão project.\n`
    fs.writeFileSync(fullPath, content)
    console.log(`✅ Created: ${file}`)
  } else {
    console.log(`⚠️ Already exists: ${file}`)
  }
})

console.log("\nDirectory structure creation completed!")
