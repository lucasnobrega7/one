const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Erro:', error)
    } else {
      console.log('✓ Conexão com Supabase estabelecida!')
      console.log('✓ Tabela users existe')
    }

    // Test health_check table
    const { data: healthData, error: healthError } = await supabase.from('health_check').select('*').limit(1)
    
    if (healthError) {
      console.error('Erro na tabela health_check:', healthError)
    } else {
      console.log('✓ Tabela health_check existe:', healthData)
    }

    // List all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('Erro listando tabelas:', tablesError)
    } else {
      console.log('✓ Tabelas criadas:', tables.map(t => t.table_name))
    }

  } catch (error) {
    console.error('Erro geral:', error)
  }
}

testConnection()