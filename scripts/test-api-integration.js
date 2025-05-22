#!/usr/bin/env node

const { execSync } = require('child_process')
const { existsSync, readFileSync } = require('fs')
const path = require('path')

class ApiIntegrationTester {
  constructor() {
    this.projectRoot = process.cwd()
    this.results = new Map()
  }

  async runAllTests() {
    console.log('🚀 Starting API Integration Test Suite\n')

    // Check prerequisites
    await this.checkPrerequisites()

    // Run API health checks
    await this.runApiHealthChecks()

    // Run basic connectivity tests
    await this.runConnectivityTests()

    // Generate summary report
    this.generateReport()
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...')

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

  checkEnvironmentVariables() {
    const requiredEnvVars = [
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const optionalEnvVars = [
      'RUN_INTEGRATION_TESTS',
      'USE_EXTERNAL_API',
      'ENABLE_AUTO_SYNC',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'ZAPI_TOKEN'
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
        console.log(`ℹ️  ${envVar}: ${process.env[envVar].length > 20 ? '[HIDDEN]' : process.env[envVar]}`)
      }
    }
  }

  async runApiHealthChecks() {
    console.log('🏥 Running API health checks...')

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.agentesdeconversao.com.br'

    // Test basic connectivity
    await this.testApiEndpoint('health', `${apiUrl}/health`)

    // Test OpenAPI documentation
    await this.testApiEndpoint('openapi-docs', `${apiUrl}/docs`)

    // Test OpenAPI spec
    await this.testApiEndpoint('openapi-spec', `${apiUrl}/openapi.json`)

    // Test authentication endpoint
    await this.testApiEndpoint('auth-login', `${apiUrl}/auth/login`)

    // Test AI endpoints
    await this.testApiEndpoint('ai-chat', `${apiUrl}/ai/chat/completion`)

    // Test WhatsApp endpoints
    await this.testApiEndpoint('zapi-send', `${apiUrl}/zapi/send`)

    // Test Supabase endpoints
    await this.testApiEndpoint('supabase-query', `${apiUrl}/supabase/query`)

    console.log('')
  }

  async runConnectivityTests() {
    console.log('🔗 Running connectivity tests...')

    // Test Supabase connectivity
    await this.testSupabaseConnectivity()

    // Test Z-API connectivity
    await this.testZApiConnectivity()

    console.log('')
  }

  async testSupabaseConnectivity() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl) {
      this.results.set('supabase-connectivity', {
        success: false,
        output: '',
        error: 'SUPABASE_URL not configured'
      })
      console.log('❌ supabase-connectivity: URL not configured')
      return
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'User-Agent': 'API-Integration-Tester/1.0'
        }
      })

      const result = {
        success: response.status === 200 || response.status === 404, // 404 is OK for root endpoint
        output: `Status: ${response.status} ${response.statusText}`
      }

      this.results.set('supabase-connectivity', result)

      if (result.success) {
        console.log(`✅ supabase-connectivity: ${result.output}`)
      } else {
        console.log(`❌ supabase-connectivity: ${result.output}`)
      }

    } catch (error) {
      this.results.set('supabase-connectivity', {
        success: false,
        output: '',
        error: error.message
      })
      console.log(`❌ supabase-connectivity: ${error.message}`)
    }
  }

  async testZApiConnectivity() {
    const zapiBaseUrl = process.env.ZAPI_BASE_URL
    const zapiInstanceId = process.env.ZAPI_INSTANCE_ID
    
    if (!zapiBaseUrl || !zapiInstanceId) {
      this.results.set('zapi-connectivity', {
        success: false,
        output: '',
        error: 'Z-API credentials not configured'
      })
      console.log('❌ zapi-connectivity: Credentials not configured')
      return
    }

    try {
      const response = await fetch(`${zapiBaseUrl}/${zapiInstanceId}/token/status`, {
        method: 'GET',
        headers: {
          'User-Agent': 'API-Integration-Tester/1.0'
        }
      })

      const result = {
        success: response.ok,
        output: `Status: ${response.status} ${response.statusText}`
      }

      this.results.set('zapi-connectivity', result)

      if (result.success) {
        console.log(`✅ zapi-connectivity: ${result.output}`)
      } else {
        console.log(`❌ zapi-connectivity: ${result.output}`)
      }

    } catch (error) {
      this.results.set('zapi-connectivity', {
        success: false,
        output: '',
        error: error.message
      })
      console.log(`❌ zapi-connectivity: ${error.message}`)
    }
  }

  async testApiEndpoint(name, url) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'API-Integration-Tester/1.0',
          'Accept': 'application/json'
        }
      })

      clearTimeout(timeoutId)

      const result = {
        success: response.ok || [401, 403, 422, 405].includes(response.status), // Some endpoints expect auth or specific methods
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

    } catch (error) {
      this.results.set(`api-${name}`, {
        success: false,
        output: '',
        error: error.message
      })

      console.log(`❌ ${name}: ${error.message}`)
    }
  }

  generateReport() {
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

// Load environment variables from .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '') // Remove quotes
      process.env[key] = value
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

module.exports = { ApiIntegrationTester }