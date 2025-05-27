#!/usr/bin/env tsx

import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function createTestData() {
  console.log('🚀 Creating test data...')
  
  try {
    // Find or create test organization
    let organization = await prisma.organization.findFirst({
      where: { name: 'Agentes de Conversão' }
    })
    
    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: 'Agentes de Conversão',
          icon_url: '/logo.svg'
        }
      })
      console.log('✅ Created organization:', organization.name)
    } else {
      console.log('✅ Organization exists:', organization.name)
    }
    
    // Create test user (simulating Supabase auth user)
    const testUser = await prisma.user.upsert({
      where: { email: 'admin@agentesdeconversao.com.br' },
      update: {},
      create: {
        email: 'admin@agentesdeconversao.com.br',
        name: 'Admin User',
        email_verified: new Date()
      }
    })
    console.log('✅ User ready:', testUser.email)
    
    // Create membership
    await prisma.membership.create({
      data: {
        role: 'OWNER',
        organization_id: organization.id,
        user_id: testUser.id
      }
    })
    console.log('✅ Created membership')
    
    // Create test datastore
    const datastore = await prisma.datastore.create({
      data: {
        name: 'Knowledge Base Principal',
        description: 'Base de conhecimento principal',
        type: 'supabase_vector',
        organization_id: organization.id,
        config: {
          embedding_model: 'text-embedding-3-small',
          chunk_size: 1000
        }
      }
    })
    console.log('✅ Created datastore:', datastore.name)
    
    // Create test agent
    const agent = await prisma.agent.create({
      data: {
        name: 'VendasBot',
        description: 'Especialista em vendas e qualificação de leads',
        system_prompt: 'Você é um especialista em vendas consultivas. Sua missão é qualificar leads e converter prospects em clientes.',
        model_name: 'gpt_4_turbo',
        temperature: 0.7,
        max_tokens: 2000,
        organization_id: organization.id,
        datastore_id: datastore.id
      }
    })
    console.log('✅ Created agent:', agent.name)
    
    // Create test conversation
    const conversation = await prisma.conversation.create({
      data: {
        agent_id: agent.id,
        user_id: testUser.id,
        title: 'Conversa de Teste',
        status: 'active'
      }
    })
    console.log('✅ Created conversation')
    
    // Create test messages
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        content: 'Olá! Como posso ajudar você hoje?',
        role: 'assistant',
        tokens_used: 45,
        model_used: 'gpt-4-turbo'
      }
    })
    
    await prisma.message.create({
      data: {
        conversation_id: conversation.id,
        content: 'Preciso de informações sobre seus produtos.',
        role: 'user'
      }
    })
    console.log('✅ Created test messages')
    
    // Create test API key
    await prisma.apiKey.create({
      data: {
        name: 'Test API Key',
        key: 'ak_test_' + Math.random().toString(36).substring(2, 15),
        organization_id: organization.id
      }
    })
    console.log('✅ Created API key')
    
    console.log('\n🎉 Test data created successfully!')
    console.log('📊 Summary:')
    console.log(`- Organization: ${organization.name}`)
    console.log(`- User: ${testUser.email}`)
    console.log(`- Agent: ${agent.name}`)
    console.log(`- Datastore: ${datastore.name}`)
    console.log(`- Conversation with 2 messages`)
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestData()