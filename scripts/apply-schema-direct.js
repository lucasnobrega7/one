const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function executeSQL(supabase, sql, description) {
  try {
    console.log(`Executando: ${description}`)
    
    // Use raw SQL execution
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: sql
      })
    })

    if (response.ok) {
      console.log(`✓ ${description} - sucesso`)
      return true
    } else {
      const errorText = await response.text()
      console.log(`⚠ ${description} - erro: ${errorText}`)
      return false
    }
  } catch (error) {
    console.log(`⚠ ${description} - erro: ${error.message}`)
    return false
  }
}

async function applySchemaSequentially() {
  console.log('🚀 Iniciando aplicação do schema...')
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Schema in logical order
  const schemas = [
    {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      description: 'Habilitando extensão UUID'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT,
        email TEXT UNIQUE,
        email_verified TIMESTAMP WITH TIME ZONE,
        image TEXT,
        password TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      description: 'Criando tabela users'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.accounts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        provider_account_id TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, provider_account_id)
      );`,
      description: 'Criando tabela accounts'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_token TEXT NOT NULL UNIQUE,
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL
      );`,
      description: 'Criando tabela sessions'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMP WITH TIME ZONE NOT NULL,
        PRIMARY KEY (identifier, token)
      );`,
      description: 'Criando tabela verification_tokens'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.user_roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, role)
      );`,
      description: 'Criando tabela user_roles'
    },
    {
      sql: `ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;`,
      description: 'Habilitando RLS para users'
    },
    {
      sql: `ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;`,
      description: 'Habilitando RLS para accounts'
    },
    {
      sql: `ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;`,
      description: 'Habilitando RLS para sessions'
    },
    {
      sql: `ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`,
      description: 'Habilitando RLS para user_roles'
    },
    {
      sql: `CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`,
      description: 'Criando função handle_new_user'
    },
    {
      sql: `DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`,
      description: 'Criando trigger para novos usuários'
    }
  ]

  let successCount = 0
  
  for (const schema of schemas) {
    const success = await executeSQL(supabase, schema.sql, schema.description)
    if (success) successCount++
    
    // Small delay between operations
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n🎉 Schema aplicado! ${successCount}/${schemas.length} comandos executados com sucesso.`)
  
  // Test the connection
  console.log('\n🔍 Testando conexão...')
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) {
      console.log('⚠ Erro na consulta:', error.message)
    } else {
      console.log('✅ Conexão com banco confirmada!')
    }
  } catch (err) {
    console.log('⚠ Erro testando conexão:', err.message)
  }
}

applySchemaSequentially()