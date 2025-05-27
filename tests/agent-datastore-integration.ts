import { PrismaClient } from '@prisma/client'
import { SupabaseVectorManager } from '@/lib/vector/supabase-vector-store'
import { AppDocument, ChunkMetadata } from '@/lib/types/document'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

interface TestData {
  organization: any
  datastore: any
  datasource: any
  agent: any
}

class AgentDatastoreIntegrationTest {
  private testData: TestData | null = null

  async run() {
    console.log('🚀 Starting Agent-Datastore Integration Test')
    
    try {
      // 1. Create test organization
      await this.createTestOrganization()
      
      // 2. Create test datastore
      await this.createTestDatastore()
      
      // 3. Create test datasource
      await this.createTestDatasource()
      
      // 4. Create test agent
      await this.createTestAgent()
      
      // 5. Simulate document upload
      await this.simulateDocumentUpload()
      
      // 6. Simulate agent query
      await this.simulateAgentQuery()
      
      console.log('✅ All integration tests passed!')
      
    } catch (error) {
      console.error('❌ Integration test failed:', error)
      throw error
    } finally {
      // 7. Cleanup
      await this.cleanup()
    }
  }

  private async createTestOrganization() {
    console.log('📝 Creating test organization...')
    
    this.testData = { organization: null, datastore: null, datasource: null, agent: null }
    
    this.testData.organization = await prisma.organization.create({
      data: {
        id: uuidv4(),
        name: 'Test Organization - Integration',
        icon_url: 'https://example.com/icon.png',
      }
    })
    
    console.log(`✅ Organization created: ${this.testData.organization.id}`)
  }

  private async createTestDatastore() {
    if (!this.testData?.organization) throw new Error('Organization not created')
    
    console.log('🗄️ Creating test datastore...')
    
    this.testData.datastore = await prisma.datastore.create({
      data: {
        id: uuidv4(),
        name: 'Test Vector Datastore',
        description: 'Integration test vector datastore',
        type: 'supabase_vector',
        organization_id: this.testData.organization.id,
        config: {
          tableName: 'test_document_chunks',
          queryName: 'test_match_documents'
        }
      }
    })
    
    console.log(`✅ Datastore created: ${this.testData.datastore.id}`)
  }

  private async createTestDatasource() {
    if (!this.testData?.datastore) throw new Error('Datastore not created')
    
    console.log('📄 Creating test datasource...')
    
    this.testData.datasource = await prisma.datasource.create({
      data: {
        id: uuidv4(),
        name: 'Test PDF Document',
        type: 'pdf',
        datastore_id: this.testData.datastore.id,
        status: 'synched',
        config: {
          file_name: 'integration-test.pdf',
          file_size: 1024,
          mime_type: 'application/pdf'
        }
      }
    })
    
    console.log(`✅ Datasource created: ${this.testData.datasource.id}`)
  }

  private async createTestAgent() {
    if (!this.testData?.organization || !this.testData?.datastore) {
      throw new Error('Organization or Datastore not created')
    }
    
    console.log('🤖 Creating test agent...')
    
    this.testData.agent = await prisma.agent.create({
      data: {
        id: uuidv4(),
        name: 'Test Knowledge Agent',
        description: 'Integration test agent with vector knowledge',
        system_prompt: 'You are a helpful assistant with access to knowledge documents.',
        model_name: 'gpt_3_5_turbo',
        temperature: 0.7,
        max_tokens: 1000,
        include_sources: true,
        restrict_knowledge: true,
        organization_id: this.testData.organization.id,
        datastore_id: this.testData.datastore.id,
        is_active: true
      }
    })
    
    console.log(`✅ Agent created: ${this.testData.agent.id}`)
  }

  private async simulateDocumentUpload() {
    if (!this.testData?.datastore || !this.testData?.datasource) {
      throw new Error('Datastore or Datasource not created')
    }
    
    console.log('📤 Simulating document upload to vector store...')
    
    // Initialize vector manager
    const vectorManager = new SupabaseVectorManager(this.testData.datastore)
    
    // Create test documents
    const testDocuments: AppDocument<ChunkMetadata>[] = [
      {
        pageContent: 'Agentes de Conversão é uma plataforma revolucionária para criar chatbots inteligentes. A plataforma utiliza IA avançada para processar documentos e responder perguntas de forma precisa.',
        metadata: {
          datastore_id: this.testData.datastore.id,
          datasource_id: this.testData.datasource.id,
          datasource_name: 'integration-test.pdf',
          datasource_type: 'pdf',
          chunk_hash: 'chunk_1_hash',
          chunk_offset: 0,
          page_number: 1,
          total_pages: 3
        }
      },
      {
        pageContent: 'Nossa tecnologia utiliza OpenRouter para acesso a mais de 300 modelos de IA diferentes, garantindo flexibilidade e economia de custos para nossos usuários.',
        metadata: {
          datastore_id: this.testData.datastore.id,
          datasource_id: this.testData.datasource.id,
          datasource_name: 'integration-test.pdf',
          datasource_type: 'pdf',
          chunk_hash: 'chunk_2_hash',
          chunk_offset: 1,
          page_number: 2,
          total_pages: 3
        }
      },
      {
        pageContent: 'O sistema de vetores do Supabase permite busca semântica avançada, encontrando informações relevantes mesmo quando as palavras exatas não coincidem com a consulta.',
        metadata: {
          datastore_id: this.testData.datastore.id,
          datasource_id: this.testData.datasource.id,
          datasource_name: 'integration-test.pdf',
          datasource_type: 'pdf',
          chunk_hash: 'chunk_3_hash',
          chunk_offset: 2,
          page_number: 3,
          total_pages: 3
        }
      }
    ]
    
    // Upload documents to vector store
    const uploadedDocs = await vectorManager.uploadDatasourceDocs(
      this.testData.datasource.id,
      testDocuments
    )
    
    console.log(`✅ Uploaded ${uploadedDocs.length} documents to vector store`)
    
    // Verify upload by checking vector store
    const searchResult = await vectorManager.search({
      query: 'Agentes de Conversão',
      topK: 1,
      threshold: 0.1
    })
    
    if (searchResult.length === 0) {
      throw new Error('Document upload verification failed - no results found')
    }
    
    console.log(`✅ Upload verified - found ${searchResult.length} chunks in vector store`)
  }

  private async simulateAgentQuery() {
    if (!this.testData?.datastore) {
      throw new Error('Datastore not created')
    }
    
    console.log('🔍 Simulating agent query against vector store...')
    
    const vectorManager = new SupabaseVectorManager(this.testData.datastore)
    
    // Test queries
    const testQueries = [
      'O que é Agentes de Conversão?',
      'Como funciona a tecnologia OpenRouter?',
      'Quais são as vantagens do sistema de vetores?'
    ]
    
    for (const query of testQueries) {
      console.log(`🔎 Testing query: "${query}"`)
      
      const results = await vectorManager.search({
        query,
        topK: 3,
        threshold: 0.3
      })
      
      if (results.length === 0) {
        throw new Error(`No results found for query: "${query}"`)
      }
      
      console.log(`  ✅ Found ${results.length} relevant chunks`)
      
      // Validate result structure
      for (const result of results) {
        if (!result.pageContent || !result.metadata) {
          throw new Error('Invalid result structure')
        }
        
        if (!result.metadata.similarity_score || result.metadata.similarity_score < 0.3) {
          throw new Error(`Low similarity score: ${result.metadata.similarity_score}`)
        }
        
        console.log(`    📄 Chunk similarity: ${result.metadata.similarity_score?.toFixed(3)}`)
      }
    }
    
    console.log('✅ All queries returned valid results')
  }

  private async cleanup() {
    if (!this.testData) return
    
    console.log('🧹 Cleaning up test data...')
    
    try {
      // Clean vector store first
      if (this.testData.datastore) {
        const vectorManager = new SupabaseVectorManager(this.testData.datastore)
        await vectorManager.delete()
        console.log('✅ Vector store cleaned')
      }
      
      // Clean database records
      if (this.testData.agent) {
        await prisma.agent.delete({ where: { id: this.testData.agent.id } })
        console.log('✅ Agent deleted')
      }
      
      if (this.testData.datasource) {
        await prisma.datasource.delete({ where: { id: this.testData.datasource.id } })
        console.log('✅ Datasource deleted')
      }
      
      if (this.testData.datastore) {
        await prisma.datastore.delete({ where: { id: this.testData.datastore.id } })
        console.log('✅ Datastore deleted')
      }
      
      if (this.testData.organization) {
        await prisma.organization.delete({ where: { id: this.testData.organization.id } })
        console.log('✅ Organization deleted')
      }
      
    } catch (error) {
      console.error('⚠️ Cleanup error (non-critical):', error)
    } finally {
      await prisma.$disconnect()
      console.log('✅ Database connection closed')
    }
  }
}

// Run the test
async function runIntegrationTest() {
  const test = new AgentDatastoreIntegrationTest()
  await test.run()
}

// Export for npm script usage
if (require.main === module) {
  runIntegrationTest()
    .then(() => {
      console.log('🎉 Integration test completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Integration test failed:', error)
      process.exit(1)
    })
}

export { AgentDatastoreIntegrationTest, runIntegrationTest }