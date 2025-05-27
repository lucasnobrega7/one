#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  console.log('📡 Supabase URL:', supabaseUrl)
  console.log('🔑 Anon Key:', supabaseKey.substring(0, 20) + '...')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📊 Health check data:', data)
    return true
  } catch (error) {
    console.error('❌ Supabase connection error:', error)
    return false
  }
}

// Test Prisma connection
async function testPrismaConnection() {
  console.log('\n🔍 Testing Prisma connection...')
  
  const prisma = new PrismaClient()
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Prisma connection successful')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log('👥 Users in database:', userCount)
    
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.error('❌ Prisma connection failed:', error)
    await prisma.$disconnect()
    return false
  }
}

// Test auth functionality
async function testAuthFunctionality() {
  console.log('\n🔍 Testing Supabase Auth...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    // Test getting current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('⚠️ No active session (expected in test):', error.message)
    } else {
      console.log('📱 Session status:', session ? 'Active' : 'None')
    }
    
    // Test auth configuration
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.log('⚠️ No authenticated user (expected in test)')
    } else {
      console.log('👤 Current user:', user?.email || 'None')
    }
    
    console.log('✅ Auth functionality accessible')
    return true
  } catch (error) {
    console.error('❌ Auth test failed:', error)
    return false
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting connection tests...\n')
  
  const results = {
    supabase: await testSupabaseConnection(),
    prisma: await testPrismaConnection(),
    auth: await testAuthFunctionality()
  }
  
  console.log('\n📋 Test Results:')
  console.log('================')
  console.log(`Supabase: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Prisma: ${results.prisma ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Auth: ${results.auth ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  
  console.log('\n🎯 Overall Status:', allPassed ? '✅ ALL SYSTEMS GO' : '❌ ISSUES DETECTED')
  
  if (allPassed) {
    console.log('🚀 Ready to restore frontend components!')
  } else {
    console.log('🔧 Please fix the issues above before proceeding.')
  }
  
  process.exit(allPassed ? 0 : 1)
}

// Run the tests
runTests().catch(console.error)