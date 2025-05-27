#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function verifyDatabase() {
  console.log('🔍 Verifying database state...')
  
  try {
    // Check tables exist and count records
    const counts = {
      organizations: await prisma.organization.count(),
      users: await prisma.user.count(),
      agents: await prisma.agent.count(),
      conversations: await prisma.conversation.count(),
      messages: await prisma.message.count(),
      memberships: await prisma.membership.count(),
      datastores: await prisma.datastore.count(),
      apiKeys: await prisma.apiKey.count()
    }
    
    console.log('📊 Database Statistics:')
    console.log('=======================')
    for (const [table, count] of Object.entries(counts)) {
      console.log(`${table.padEnd(15)}: ${count} records`)
    }
    
    // Check if we have at least basic data
    if (counts.organizations > 0 && counts.users > 0) {
      console.log('\n✅ Database has basic data structure')
      
      // Show sample data
      const org = await prisma.organization.findFirst()
      const user = await prisma.user.findFirst()
      
      console.log('\n📋 Sample Data:')
      console.log(`Organization: ${org?.name}`)
      console.log(`User: ${user?.email}`)
      
      if (counts.agents > 0) {
        const agent = await prisma.agent.findFirst()
        console.log(`Agent: ${agent?.name}`)
      }
      
    } else {
      console.log('\n⚠️  Database is empty - this is normal for fresh setup')
    }
    
    console.log('\n🎯 Database Status: ✅ OPERATIONAL')
    console.log('Ready to restore frontend components!')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error)
    console.log('\n🎯 Database Status: ❌ ISSUES DETECTED')
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()