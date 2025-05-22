#!/usr/bin/env node
import fs from "fs"
import path from "path"
import chalk from "chalk"

// Configuration
const API_DIR = path.join(process.cwd(), "app/api")
const COMPONENTS_DIR = path.join(process.cwd(), "components")
const LIB_DIR = path.join(process.cwd(), "lib")

// Function to recursively get all files in a directory
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList

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

// Function to read file content
function readFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf8")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return ""
  }
}

// Function to analyze API routes for redundancy
function analyzeApiRoutes() {
  console.log(chalk.blue("\n=== Analyzing API Routes for Redundancy ===\n"))

  const apiFiles = getAllFiles(API_DIR)

  // Group routes by functionality
  const routeGroups: Record<string, string[]> = {
    auth: [],
    user: [],
    agents: [],
    conversations: [],
    knowledge: [],
    admin: [],
    test: [],
    status: [],
    other: [],
  }

  // Categorize routes
  apiFiles.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file)

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
    } else if (relativePath.includes("/api/status/") || relativePath.includes("/api/db-status/")) {
      routeGroups.status.push(relativePath)
    } else {
      routeGroups.other.push(relativePath)
    }
  })

  // Identify potential redundancies
  const redundancies: Record<string, string[]> = {}

  // Check for test/check routes that can be consolidated
  if (routeGroups.test.length > 1) {
    redundancies.test = routeGroups.test
  }

  // Check for status routes that can be consolidated
  if (routeGroups.status.length > 1) {
    redundancies.status = routeGroups.status
  }

  // Check for multiple auth-related routes
  if (routeGroups.auth.length > 3) {
    redundancies.auth = routeGroups.auth
  }

  // Print results
  console.log(chalk.green(`Total API routes: ${apiFiles.length}`))
  console.log("\nRoutes by category:")
  Object.entries(routeGroups).forEach(([category, routes]) => {
    console.log(chalk.yellow(`- ${category}: ${routes.length} routes`))
  })

  console.log("\nPotential redundancies:")
  Object.entries(redundancies).forEach(([category, routes]) => {
    console.log(chalk.red(`\n${category.toUpperCase()} routes that could be consolidated:`))
    routes.forEach((route) => console.log(`- ${route}`))
  })

  // Identify routes to be removed or consolidated
  const routesToRemove = [
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
  ]

  console.log(chalk.red("\nRecommended routes to remove or consolidate:"))
  routesToRemove.forEach((route) => console.log(`- ${route}`))

  return routesToRemove
}

// Function to analyze unused components
function analyzeUnusedComponents() {
  console.log(chalk.blue("\n=== Analyzing Components for Usage ===\n"))

  const componentFiles = getAllFiles(COMPONENTS_DIR)
  const allFiles = [...getAllFiles(path.join(process.cwd(), "app")), ...getAllFiles(LIB_DIR)]

  const potentiallyUnusedComponents: string[] = []

  componentFiles.forEach((componentFile) => {
    const componentName = path.basename(componentFile, path.extname(componentFile))
    const relativePath = path.relative(process.cwd(), componentFile)

    // Skip index files
    if (componentName === "index") return

    // Check if component is imported in any file
    let isUsed = false

    for (const file of allFiles) {
      if (file === componentFile) continue

      const content = readFileContent(file)

      // Check for import statements or JSX usage
      if (
        content.includes(`from '${componentName}'`) ||
        content.includes(`from "./${componentName}"`) ||
        content.includes(`from '../components/${componentName}'`) ||
        content.includes(`from "@/components/${componentName}"`) ||
        content.includes(`<${componentName}`) ||
        content.includes(`<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`)
      ) {
        isUsed = true
        break
      }
    }

    if (!isUsed) {
      potentiallyUnusedComponents.push(relativePath)
    }
  })

  console.log(chalk.yellow(`Potentially unused components (${potentiallyUnusedComponents.length}):`))
  potentiallyUnusedComponents.forEach((component) => {
    console.log(`- ${component}`)
  })

  return potentiallyUnusedComponents
}

// Function to analyze package.json for unused dependencies
function analyzePackageJson() {
  console.log(chalk.blue("\n=== Analyzing package.json for Unused Dependencies ===\n"))

  const packageJsonPath = path.join(process.cwd(), "package.json")
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  const allFiles = [
    ...getAllFiles(path.join(process.cwd(), "app")),
    ...getAllFiles(COMPONENTS_DIR),
    ...getAllFiles(LIB_DIR),
  ]

  const dependencies = Object.keys(packageJson.dependencies || {})
  const devDependencies = Object.keys(packageJson.devDependencies || {})

  const potentiallyUnusedDeps: string[] = []

  // Check each dependency
  dependencies.forEach((dep) => {
    // Skip essential dependencies
    if (
      [
        "react",
        "react-dom",
        "next",
        "@types/node",
        "@types/react",
        "@types/react-dom",
        "typescript",
        "eslint",
        "eslint-config-next",
      ].includes(dep)
    ) {
      return
    }

    let isUsed = false

    for (const file of allFiles) {
      const content = readFileContent(file)

      if (
        content.includes(`from '${dep}'`) ||
        content.includes(`from "${dep}"`) ||
        content.includes(`require('${dep}')`) ||
        content.includes(`require("${dep}")`) ||
        content.includes(`import '${dep}'`) ||
        content.includes(`import "${dep}"`)
      ) {
        isUsed = true
        break
      }
    }

    if (!isUsed) {
      potentiallyUnusedDeps.push(dep)
    }
  })

  console.log(chalk.yellow(`Potentially unused dependencies (${potentiallyUnusedDeps.length}):`))
  potentiallyUnusedDeps.forEach((dep) => {
    console.log(`- ${dep}`)
  })

  return potentiallyUnusedDeps
}

// Main function
function main() {
  console.log(chalk.green("Starting project redundancy analysis..."))

  const routesToRemove = analyzeApiRoutes()
  const unusedComponents = analyzeUnusedComponents()
  const unusedDeps = analyzePackageJson()

  console.log(chalk.green("\n=== Analysis Complete ===\n"))

  // Generate cleanup script
  const cleanupScript = `
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Files to be removed
const filesToRemove = [
${routesToRemove.map((route) => `  '${route}',`).join("\n")}
${unusedComponents.map((comp) => `  '${comp}',`).join("\n")}
];

// Process files
console.log('Removing redundant files...');
filesToRemove.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(\`✅ Removed: \${file}\`);
  } else {
    console.log(\`⚠️ File not found: \${file}\`);
  }
});

// Update package.json to remove unused dependencies
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const depsToRemove = [
${unusedDeps.map((dep) => `  '${dep}',`).join("\n")}
];

depsToRemove.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    delete packageJson.dependencies[dep];
    console.log(\`✅ Removed dependency: \${dep}\`);
  }
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json');

console.log('\\nRedundancy cleanup completed!');
`

  // Write cleanup script
  const cleanupScriptPath = path.join(process.cwd(), "scripts", "cleanup-redundancy.ts")
  fs.mkdirSync(path.dirname(cleanupScriptPath), { recursive: true })
  fs.writeFileSync(cleanupScriptPath, cleanupScript)

  console.log(chalk.green(`Cleanup script generated at: ${cleanupScriptPath}`))
  console.log(chalk.yellow("Run the cleanup script to remove redundant files and dependencies."))
}

main()
