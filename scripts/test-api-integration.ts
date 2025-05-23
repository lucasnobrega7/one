#!/usr/bin/env ts-node

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

interface TestResult {
  success: boolean
  output: string
  error?: string
}

class ApiIntegrationTester {
  private readonly projectRoot: string
  private readonly results: Map<string, TestResult> = new Map()

  constructor() {
    this.projectRoot = process.cwd()
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Integration Test Suite\n')

    // Check prerequisites
    await this.checkPrerequisites()

    // Run unit tests
    await this.runUnitTests()

    // Run integration tests (if enabled)
    await this.runIntegrationTests()

    // Run API health checks
    await this.runApiHealthChecks()

    // Generate summary report
    this.generateReport()
  }

  private async checkPrerequisites(): Promise<void> {
    console.log('🔍 Checking prerequisites...')

    // Check if TypeScript is available
    try {
      execSync('npx tsc --version', { stdio: 'pipe' })
      console.log('✅ TypeScript compiler available')
    } catch (error) {
      console.log('❌ TypeScript compiler not found')
      process.exit(1)
    }

    // Check if Jest is available
    try {
      execSync('npx jest --version', { stdio: 'pipe' })
      console.log('✅ Jest test runner available')
    } catch (error) {
      console.log('❌ Jest test runner not found')
      process.exit(1)
    }

    // Check if package.json exists
    const packageJsonPath = path.join(this.projectRoot, 'package.json')
    if (!existsSync(packageJsonPath)) {
      console.log('❌ package.json not found')
      process.exit(1)
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    console.log(`✅ Project: ${packageJson.name} v${packageJson.version}`)

    // Check environment variables
    this.checkEnvironmentVariables()

    console.log('')
  }

  private checkEnvironmentVariables(): void {
    const requiredEnvVars = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const optionalEnvVars = [
      'RUN_INTEGRATION_TESTS',
      'USE_EXTERNAL_API',
      'ENABLE_AUTO_SYNC'
    ]

    console.log('🌍 Environment variables:')
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: configured`)
      } else {
        console.log(`⚠️  ${envVar}: not set (required)`)
      }
    }

    for (const envVar of optionalEnvVars) {
      if (process.env[envVar]) {
        console.log(`ℹ️  ${envVar}: ${process.env[envVar]}`)
      }
    }
  }

  private async runUnitTests(): Promise<void> {
    console.log('🧪 Running unit tests...')

    try {
      const output = execSync(
        'npx jest lib/unified/__tests__/ --testPathPattern="\\.(test|spec)\\.(ts|tsx)$" --verbose',
        { 
          stdio: 'pipe',
          encoding: 'utf8',
          cwd: this.projectRoot
        }
      )

      this.results.set('unit-tests', {
        success: true,
        output: output.toString()
      })

      console.log('✅ Unit tests passed')
    } catch (error: any) {
      this.results.set('unit-tests', {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message
      })

      console.log('❌ Unit tests failed')
      console.log(error.stdout || error.message)
    }

    console.log('')
  }

  private async runIntegrationTests(): Promise<void> {
    const runIntegration = process.env.RUN_INTEGRATION_TESTS === 'true'
    
    if (!runIntegration) {
      console.log('⏭️  Skipping integration tests (set RUN_INTEGRATION_TESTS=true to enable)')
      console.log('')
      return
    }

    console.log('🔗 Running integration tests...')

    try {
      const output = execSync(
        'RUN_INTEGRATION_TESTS=true npx jest lib/unified/__tests__/integration.test.ts --verbose --timeout=30000',
        { 
          stdio: 'pipe',
          encoding: 'utf8',
          cwd: this.projectRoot,
          env: { ...process.env, RUN_INTEGRATION_TESTS: 'true' }
        }
      )

      this.results.set('integration-tests', {
        success: true,
        output: output.toString()
      })

      console.log('✅ Integration tests passed')
    } catch (error: any) {
      this.results.set('integration-tests', {
        success: false,
        output: error.stdout || '',
        error: error.stderr || error.message
      })

      console.log('❌ Integration tests failed')
      console.log(error.stdout || error.message)
    }

    console.log('')
  }

  private async runApiHealthChecks(): Promise<void> {
    console.log('🏥 Running API health checks...')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br'

    // Test basic connectivity
    await this.testApiEndpoint('health', `${apiUrl}/health`)

    // Test OpenAPI documentation
    await this.testApiEndpoint('openapi', `${apiUrl}/docs`)

    // Test authentication endpoint
    await this.testApiEndpoint('auth', `${apiUrl}/auth/login`)

    console.log('')
  }

  private async testApiEndpoint(name: string, url: string): Promise<void> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'API-Integration-Tester/1.0'
        }
      })

      clearTimeout(timeoutId)

      const result: TestResult = {
        success: response.ok || [401, 403, 422].includes(response.status), // Some endpoints expect auth
        output: `Status: ${response.status} ${response.statusText}`
      }

      if (!result.success && response.status === 404) {
        result.error = 'Endpoint not found'
      }

      this.results.set(`api-${name}`, result)

      if (result.success) {
        console.log(`✅ ${name}: ${result.output}`)
      } else {
        console.log(`❌ ${name}: ${result.output}`)
      }

    } catch (error: any) {
      this.results.set(`api-${name}`, {
        success: false,
        output: '',
        error: error.message
      })

      console.log(`❌ ${name}: ${error.message}`)
    }
  }

  private generateReport(): void {
    console.log('\n📊 Test Summary Report')
    console.log('='.repeat(50))

    let totalTests = 0
    let passedTests = 0

    for (const [testName, result] of this.results) {
      totalTests++
      if (result.success) {
        passedTests++
        console.log(`✅ ${testName}`)
      } else {
        console.log(`❌ ${testName}: ${result.error || 'Failed'}`)
      }
    }

    console.log('='.repeat(50))
    console.log(`Total: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`)

    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    console.log(`Success Rate: ${successRate}%`)

    if (successRate >= 80) {
      console.log('\n🎉 Integration test suite completed successfully!')
    } else if (successRate >= 60) {
      console.log('\n⚠️  Integration test suite completed with warnings')
    } else {
      console.log('\n💥 Integration test suite failed')
      process.exit(1)
    }

    // Detailed output for debugging
    if (process.env.VERBOSE_OUTPUT === 'true') {
      console.log('\n🔍 Detailed Test Output')
      console.log('='.repeat(50))

      for (const [testName, result] of this.results) {
        console.log(`\n--- ${testName} ---`)
        if (result.output) {
          console.log(result.output)
        }
        if (result.error) {
          console.log(`Error: ${result.error}`)
        }
      }
    }
  }
}

// Main execution
async function main() {
  const tester = new ApiIntegrationTester()
  
  try {
    await tester.runAllTests()
  } catch (error) {
    console.error('💥 Test runner failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { ApiIntegrationTester }