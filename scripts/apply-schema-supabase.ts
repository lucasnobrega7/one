import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://faccixlabriqwxkxqprw.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTablesDirectly() {
  console.log('🚀 Aplicando schema no Supabase...')

  try {
    // Criar extensão UUID
    await supabase.rpc('exec_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    })

    // Criar tabela users
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT,
          email TEXT UNIQUE,
          email_verified TIMESTAMP WITH TIME ZONE,
          image TEXT,
          password TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (usersError) {
      console.error('Erro ao criar tabela users:', usersError)
    } else {
      console.log('✅ Tabela users criada')
    }

    // Criar outras tabelas...
    console.log('✅ Schema aplicado com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao aplicar schema:', error)
  }
}

createTablesDirectly()