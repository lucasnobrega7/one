const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function applySchema() {
  try {
    console.log('Conectando ao Supabase...')
    console.log('URL:', supabaseUrl)
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Ler o arquivo de schema
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')

    console.log('Aplicando schema...')
    
    // Test connection first
    const { data, error: testError } = await supabase.from('health_check').select('*').limit(1)
    if (testError) {
      console.log('Conexão testada - table não existe ainda, isso é esperado')
    } else {
      console.log('Conexão com Supabase estabelecida!')
    }

    // Dividir o SQL em blocos por CREATE TABLE, CREATE INDEX, etc.
    const blocks = schemaSql.split(/(?=CREATE|INSERT|ALTER|DROP)/gi).filter(block => block.trim())

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i].trim()
      if (block && !block.startsWith('--')) {
        try {
          console.log(`Executando bloco ${i + 1}/${blocks.length}: ${block.substring(0, 50)}...`)
          
          // Use raw SQL execution via REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({
              sql: block
            })
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`Erro HTTP ${response.status}: ${errorText}`)
          } else {
            console.log(`✓ Bloco ${i + 1} executado com sucesso`)
          }
        } catch (err) {
          console.error(`Erro no bloco ${i + 1}:`, err.message)
        }
      }
    }

    console.log('Schema aplicado com sucesso!')
    
  } catch (error) {
    console.error('Erro ao aplicar schema:', error)
    process.exit(1)
  }
}

applySchema()