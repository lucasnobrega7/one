import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

async function testSupabaseConnection() {
  console.log('🔄 Testando conexão Supabase...')
  
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Test basic connection
    const { data, error } = await supabase.from('organizations').select('count').single()
    
    if (error && error.code !== 'PGRST116') { // 116 = no rows returned (table exists but empty)
      throw error
    }
    
    console.log('✅ Supabase: Conexão estabelecida')
    return true
  } catch (error) {
    console.error('❌ Supabase: Erro na conexão:', error)
    return false
  }
}

async function testPrismaConnection() {
  console.log('🔄 Testando conexão Prisma...')
  
  try {
    // Test the connection
    await prisma.$connect()
    
    // Test query
    const organizations = await prisma.organization.findMany({
      take: 1
    })
    
    console.log('✅ Prisma: Conexão estabelecida')
    console.log(`📊 Organizações encontradas: ${organizations.length}`)
    return true
  } catch (error) {
    console.error('❌ Prisma: Erro na conexão:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

async function testVectorStore() {
  console.log('🔄 Testando Vector Store (pgvector)...')
  
  try {
    // Test if pgvector extension is enabled
    const result = await prisma.$queryRaw`
      SELECT extname FROM pg_extension WHERE extname = 'vector';
    `
    
    if (Array.isArray(result) && result.length > 0) {
      console.log('✅ Vector Store: Extensão pgvector ativa')
      return true
    } else {
      console.log('⚠️  Vector Store: Extensão pgvector não encontrada')
      return false
    }
  } catch (error) {
    console.error('❌ Vector Store: Erro ao verificar extensão:', error)
    return false
  }
}

async function createTestData() {
  console.log('🔄 Criando dados de teste...')
  
  try {
    // Create test organization
    const org = await prisma.organization.upsert({
      where: { name: 'Agentes de Conversão - Test' },
      update: {},
      create: {
        name: 'Agentes de Conversão - Test',
        icon_url: 'https://agentesdeconversao.ai/logo.svg'
      }
    })
    
    console.log('✅ Organização de teste criada:', org.name)
    
    // Create test user
    const user = await prisma.user.upsert({
      where: { email: 'admin@agentesdeconversao.ai' },
      update: {},
      create: {
        email: 'admin@agentesdeconversao.ai',
        name: 'Admin Test',
        avatar_url: 'https://agentesdeconversao.ai/avatar.jpg'
      }
    })
    
    console.log('✅ Usuário de teste criado:', user.email)
    
    // Create test membership
    await prisma.membership.upsert({
      where: {
        organization_id_user_id: {
          organization_id: org.id,
          user_id: user.id
        }
      },
      update: {},
      create: {
        organization_id: org.id,
        user_id: user.id,
        role: 'OWNER'
      }
    })
    
    console.log('✅ Membership criado: Admin como OWNER')
    
    return true
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error)
    return false
  }
}

async function main() {
  console.log('🚀 TESTE DE CONEXÕES - AGENTES DE CONVERSÃO\n')
  
  const results = {
    supabase: await testSupabaseConnection(),
    prisma: await testPrismaConnection(),
    vectorStore: await testVectorStore(),
    testData: false
  }
  
  if (results.supabase && results.prisma) {
    results.testData = await createTestData()
  }
  
  console.log('\n📊 RESUMO DOS TESTES:')
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`)
  console.log(`Prisma: ${results.prisma ? '✅' : '❌'}`)
  console.log(`Vector Store: ${results.vectorStore ? '✅' : '⚠️'}`)
  console.log(`Dados de Teste: ${results.testData ? '✅' : '❌'}`)
  
  const allGood = results.supabase && results.prisma && results.testData
  
  if (allGood) {
    console.log('\n🎉 Todas as conexões estão funcionando! Projeto pronto para desenvolvimento.')
  } else {
    console.log('\n⚠️  Algumas conexões falharam. Verifique a configuração.')
  }
  
  return allGood
}

// Execute only if this file is run directly
if (require.main === module) {
  main()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error)
      process.exit(1)
    })
}

export { testSupabaseConnection, testPrismaConnection, testVectorStore, createTestData }