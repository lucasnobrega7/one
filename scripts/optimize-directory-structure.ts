#!/usr/bin/env node
import fs from "fs"
import path from "path"
import chalk from "chalk"

// Define the ideal directory structure
const idealStructure = {
  app: {
    "(auth)": ["login", "signup", "forgot-password", "reset-password", "error", "access-denied"],
    "(dashboard)": ["dashboard", "agents", "knowledge", "conversations", "settings", "profile"],
    "(marketing)": ["page.tsx", "about", "features", "pricing"],
    api: {
      auth: ["[...nextauth]"],
      agents: [],
      conversations: [],
      knowledge: [],
      user: [],
      status: [],
      admin: [],
    },
    admin: [],
    onboarding: [],
  },
  components: {
    auth: [],
    dashboard: [],
    layout: [],
    ui: [],
    agents: [],
    knowledge: [],
    conversations: [],
  },
  lib: {
    auth: [],
    db: [],
    supabase: [],
    utils: [],
    ai: {
      providers: [],
      adapters: [],
    },
  },
  hooks: [],
  types: [],
  utils: [],
  public: {
    fonts: [],
    images: [],
  },
  tests: {
    unit: [],
    integration: [],
    e2e: [],
  },
}

// Function to create directory structure
function createDirectoryStructure(basePath: string, structure: any, depth = 0) {
  Object.entries(structure).forEach(([dir, subDirs]) => {
    const dirPath = path.join(basePath, dir)

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`${" ".repeat(depth * 2)}${chalk.green("✓")} Created: ${dirPath}`)
    } else {
      console.log(`${" ".repeat(depth * 2)}${chalk.blue("i")} Exists: ${dirPath}`)
    }

    // Process subdirectories
    if (Array.isArray(subDirs)) {
      subDirs.forEach((subDir) => {
        const subDirPath = path.join(dirPath, subDir)
        if (!fs.existsSync(subDirPath)) {
          fs.mkdirSync(subDirPath, { recursive: true })
          console.log(`${" ".repeat((depth + 1) * 2)}${chalk.green("✓")} Created: ${subDirPath}`)
        } else {
          console.log(`${" ".repeat((depth + 1) * 2)}${chalk.blue("i")} Exists: ${subDirPath}`)
        }
      })
    } else if (typeof subDirs === "object") {
      createDirectoryStructure(dirPath, subDirs, depth + 1)
    }
  })
}

// Function to move files to their appropriate directories
function moveFilesToAppropriateDirectories(basePath: string) {
  console.log(chalk.yellow("\nAnalyzing files for relocation..."))

  // Define file patterns and their target directories
  const filePatterns = [
    { pattern: /login\/page\.tsx$/, target: "app/(auth)/login" },
    { pattern: /signup\/page\.tsx$/, target: "app/(auth)/signup" },
    { pattern: /auth\/forgot-password\/page\.tsx$/, target: "app/(auth)/forgot-password" },
    { pattern: /auth\/error\/page\.tsx$/, target: "app/(auth)/error" },
    { pattern: /auth\/access-denied\/page\.tsx$/, target: "app/(auth)/access-denied" },
    { pattern: /dashboard\/page\.tsx$/, target: "app/(dashboard)/dashboard" },
    { pattern: /agents\/page\.tsx$/, target: "app/(dashboard)/agents" },
    { pattern: /knowledge\/page\.tsx$/, target: "app/(dashboard)/knowledge" },
    { pattern: /dashboard\/profile\/page\.tsx$/, target: "app/(dashboard)/profile" },
    { pattern: /dashboard\/settings\/page\.tsx$/, target: "app/(dashboard)/settings" },
  ]

  // Walk through all files
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath)
      } else {
        // Check if file matches any pattern
        for (const { pattern, target } of filePatterns) {
          if (pattern.test(filePath)) {
            const targetDir = path.join(basePath, target)
            const targetFile = path.join(targetDir, path.basename(filePath))

            // Create target directory if it doesn't exist
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true })
            }

            // Only move if target doesn't already exist
            if (!fs.existsSync(targetFile)) {
              try {
                // Copy file to new location
                fs.copyFileSync(filePath, targetFile)
                console.log(`${chalk.green("✓")} Copied: ${filePath} -> ${targetFile}`)

                // Don't delete original files in this script to be safe
                console.log(`${chalk.yellow("!")} Original file preserved: ${filePath}`)
              } catch (error) {
                console.error(`${chalk.red("✗")} Error copying file: ${filePath}`, error)
              }
            } else {
              console.log(`${chalk.blue("i")} Target already exists: ${targetFile}`)
            }

            break
          }
        }
      }
    })
  }

  walkDir(basePath)
}

// Function to create index files for directories
function createIndexFiles(basePath: string, structure: any) {
  console.log(chalk.yellow("\nCreating index files for key directories..."))

  // Define directories that should have index files
  const dirsNeedingIndex = ["components/ui", "components/auth", "components/dashboard", "lib/utils", "hooks", "types"]

  dirsNeedingIndex.forEach((dir) => {
    const dirPath = path.join(basePath, dir)
    const indexPath = path.join(dirPath, "index.ts")

    if (fs.existsSync(dirPath) && !fs.existsSync(indexPath)) {
      try {
        // Get all .ts and .tsx files in the directory
        const files = fs
          .readdirSync(dirPath)
          .filter((file) => (file.endsWith(".ts") || file.endsWith(".tsx")) && file !== "index.ts")

        if (files.length > 0) {
          // Generate index file content
          const indexContent =
            files
              .map((file) => {
                const baseName = path.basename(file, path.extname(file))
                return `export * from './${baseName}';`
              })
              .join("\n") + "\n"

          fs.writeFileSync(indexPath, indexContent)
          console.log(`${chalk.green("✓")} Created index file: ${indexPath}`)
        }
      } catch (error) {
        console.error(`${chalk.red("✗")} Error creating index file for ${dirPath}:`, error)
      }
    } else if (fs.existsSync(indexPath)) {
      console.log(`${chalk.blue("i")} Index file already exists: ${indexPath}`)
    }
  })
}

// Main function
function main() {
  const basePath = process.cwd()

  console.log(chalk.green("Starting directory structure optimization..."))

  // Create the ideal directory structure
  createDirectoryStructure(basePath, idealStructure)

  // Move files to their appropriate directories
  moveFilesToAppropriateDirectories(basePath)

  // Create index files for key directories
  createIndexFiles(basePath, idealStructure)

  console.log(chalk.green("\nDirectory structure optimization completed!"))
  console.log(
    chalk.yellow(
      "\nNote: Original files have been preserved. After verifying the new structure works correctly, you can manually delete the redundant files.",
    ),
  )
}

main()
