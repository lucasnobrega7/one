#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Função para analisar o schema do Supabase
function analyzeSupabaseSchema() {
  const schemaPath = path.join(__dirname, '../types/supabase.ts')
  
  try {
    const content = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📊 Análise do Schema Supabase')
    console.log('='.repeat(50))
    
    // Extrair tabelas
    const tablesMatch = content.match(/Tables:\s*{([^}]+)}/s)
    if (tablesMatch) {
      const tablesContent = tablesMatch[1]
      const tableNames = [...tablesContent.matchAll(/(\w+):\s*{/g)].map(match => match[1])
      
      console.log('🗂️  Tabelas encontradas:')
      tableNames.forEach(table => {
        console.log(`   • ${table}`)
      })
      console.log(`\n📈 Total: ${tableNames.length} tabelas`)
    }
    
    // Extrair views
    const viewsMatch = content.match(/Views:\s*{([^}]+)}/s)
    if (viewsMatch) {
      const viewsContent = viewsMatch[1]
      const viewNames = [...viewsContent.matchAll(/(\w+):\s*{/g)].map(match => match[1])
      
      console.log('\n👁️  Views encontradas:')
      viewNames.forEach(view => {
        console.log(`   • ${view}`)
      })
      console.log(`\n📈 Total: ${viewNames.length} views`)
    }
    
    // Extrair funções
    const functionsMatch = content.match(/Functions:\s*{([^}]+)}/s)
    if (functionsMatch) {
      const functionsContent = functionsMatch[1]
      const functionNames = [...functionsContent.matchAll(/(\w+):\s*{/g)].map(match => match[1])
      
      console.log('\n⚙️  Funções encontradas:')
      functionNames.forEach(func => {
        console.log(`   • ${func}`)
      })
      console.log(`\n📈 Total: ${functionNames.length} funções`)
    }
    
    // Verificar se há estrutura de agentes
    if (content.includes('agents') || content.includes('Agents')) {
      console.log('\n✅ Estrutura de agentes detectada!')
    } else {
      console.log('\n⚠️  Estrutura de agentes não encontrada')
    }
    
    // Verificar se há estrutura de conversas
    if (content.includes('conversations') || content.includes('Conversations')) {
      console.log('✅ Estrutura de conversas detectada!')
    } else {
      console.log('⚠️  Estrutura de conversas não encontrada')
    }
    
    // Verificar se há estrutura de usuários
    if (content.includes('users') || content.includes('Users') || content.includes('Perfis')) {
      console.log('✅ Estrutura de usuários detectada!')
    } else {
      console.log('⚠️  Estrutura de usuários não encontrada')
    }
    
    console.log('\n🔗 URLs importantes:')
    console.log(`   • Dashboard: https://supabase.com/dashboard/project/jiasbwazaicmcckmehtn`)
    console.log(`   • API: https://jiasbwazaicmcckmehtn.supabase.co/rest/v1/`)
    console.log(`   • Auth: https://jiasbwazaicmcckmehtn.supabase.co/auth/v1/`)
    
    console.log('\n📋 Scripts disponíveis:')
    console.log('   • npm run supabase:status - Ver status do projeto')
    console.log('   • npm run supabase:gen:types - Regenerar tipos')
    console.log('   • npm run test:api - Testar conectividade')
    
  } catch (error) {
    console.error('❌ Erro ao analisar schema:', error.message)
  }
}

// Executar análise
analyzeSupabaseSchema()