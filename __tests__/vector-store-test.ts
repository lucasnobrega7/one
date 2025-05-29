#!/usr/bin/env ts-node

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

import { SupabaseVectorManager } from '../lib/vector/supabase-vector-store'
import { AppDocument, ChunkMetadata } from '../lib/types/document'
import { v4 as uuidv4 } from 'uuid'

// Test configuration
const TEST_DATASTORE = {
  id: uuidv4(),
  name: 'test-datastore',
  description: 'Test datastore for vector operations',
  type: 'supabase_vector' as any,
  config: {
    tableName: 'test_document_chunks',
    queryName: 'test_match_documents'
  },
  organization_id: uuidv4(),
  created_at: new Date(),
  updated_at: new Date()
}

const TEST_DATASOURCE_ID = uuidv4()

// Sample documents for testing
const SAMPLE_DOCUMENTS: AppDocument<ChunkMetadata>[] = [
  {
    pageContent: "Agentes de conversão são sistemas de inteligência artificial projetados para automatizar e otimizar processos de vendas e atendimento ao cliente.",
    metadata: {
      chunk_hash: 'hash1',
      datasource_id: TEST_DATASOURCE_ID,
      source_url: 'test://doc1'
    }
  },
  {
    pageContent: "A integração com WhatsApp permite que os agentes interajam diretamente com clientes através da plataforma de mensagens mais popular do Brasil.",
    metadata: {
      chunk_hash: 'hash2', 
      datasource_id: TEST_DATASOURCE_ID,
      source_url: 'test://doc2'
    }
  },
  {
    pageContent: "OpenRouter oferece acesso a múltiplos modelos de IA com preços competitivos, proporcionando custos otimizados para inferência.",
    metadata: {
      chunk_hash: 'hash3',
      datasource_id: TEST_DATASOURCE_ID, 
      source_url: 'test://doc3'
    }
  }
]

async function runVectorStoreTest() {
  console.log('🧪 Iniciando teste end-to-end do Vector Store...\n')
  
  try {
    // 1. Initialize vector store
    console.log('1️⃣ Inicializando Vector Store...')
    const vectorStore = new SupabaseVectorManager(TEST_DATASTORE)
    await vectorStore.initializeSchema()
    console.log('✅ Schema inicializado com sucesso\n')

    // 2. Upload test documents
    console.log('2️⃣ Fazendo upload de documentos de teste...')
    const uploadedDocs = await vectorStore.uploadDatasourceDocs(TEST_DATASOURCE_ID, SAMPLE_DOCUMENTS)
    console.log(`✅ Upload realizado: ${uploadedDocs.length} documentos processados\n`)

    // 3. Test similarity search
    console.log('3️⃣ Testando busca por similaridade...')
    
    // Test query about sales agents
    const searchResults1 = await vectorStore.search({
      query: "Como funcionam os agentes de vendas com IA?",
      topK: 2,
      threshold: 0.3
    })
    
    console.log('📊 Resultados da busca por "agentes de vendas":')
    searchResults1.forEach((doc, index) => {
      console.log(`   ${index + 1}. Similaridade: ${doc.metadata.similarity_score?.toFixed(3)}`)
      console.log(`      Conteúdo: ${doc.pageContent.substring(0, 100)}...`)
    })
    console.log()

    // Test query about WhatsApp integration  
    const searchResults2 = await vectorStore.search({
      query: "Integração com WhatsApp",
      topK: 2, 
      threshold: 0.3
    })
    
    console.log('📊 Resultados da busca por "WhatsApp":')
    searchResults2.forEach((doc, index) => {
      console.log(`   ${index + 1}. Similaridade: ${doc.metadata.similarity_score?.toFixed(3)}`)
      console.log(`      Conteúdo: ${doc.pageContent.substring(0, 100)}...`)
    })
    console.log()

    // 4. Test chunk retrieval
    if (searchResults1.length > 0) {
      console.log('4️⃣ Testando recuperação de chunk específico...')
      const chunkId = searchResults1[0].metadata.chunk_id
      const chunk = await vectorStore.getChunk(chunkId!)
      console.log(`✅ Chunk recuperado: ${chunk.pageContent.substring(0, 100)}...\n`)
    }

    // 5. Test metadata update
    console.log('5️⃣ Testando atualização de metadata...')
    await vectorStore.updateDatasourceMetadata({
      datasourceId: TEST_DATASOURCE_ID,
      metadata: { datasource_id: TEST_DATASOURCE_ID }
    })
    console.log('✅ Metadata atualizada com sucesso\n')

    // 6. Cleanup - remove test data
    console.log('6️⃣ Limpando dados de teste...')
    await vectorStore.remove(TEST_DATASOURCE_ID)
    console.log('✅ Dados de teste removidos\n')

    // 7. Validate search results structure
    console.log('7️⃣ Validando estrutura dos resultados...')
    const hasValidResults = searchResults1.every(doc => 
      doc.pageContent && 
      doc.metadata &&
      typeof doc.metadata.similarity_score === 'number'
    )
    
    if (hasValidResults) {
      console.log('✅ Estrutura dos resultados está correta\n')
    } else {
      throw new Error('❌ Estrutura dos resultados inválida')
    }

    // Test summary
    console.log('🎉 TESTE CONCLUÍDO COM SUCESSO!')
    console.log('✅ Schema inicializado')
    console.log('✅ Upload de documentos funcionando') 
    console.log('✅ Busca por similaridade funcionando')
    console.log('✅ Recuperação de chunks funcionando')
    console.log('✅ Atualização de metadata funcionando')
    console.log('✅ Remoção de dados funcionando')
    console.log('✅ Estrutura de dados validada')
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:')
    console.error(error)
    
    // Attempt cleanup on error
    try {
      console.log('\n🧹 Tentando cleanup em caso de erro...')
      const vectorStore = new SupabaseVectorManager(TEST_DATASTORE)
      await vectorStore.remove(TEST_DATASOURCE_ID)
      console.log('✅ Cleanup realizado')
    } catch (cleanupError) {
      console.error('❌ Erro no cleanup:', cleanupError)
    }
    
    process.exit(1)
  }
}

// Run the test
runVectorStoreTest()