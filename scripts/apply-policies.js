const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function executeSQL(sql, description) {
  try {
    console.log(`Executando: ${description}`)
    
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

async function applyPolicies() {
  console.log('🛡️ Aplicando políticas de segurança...')
  
  const policies = [
    {
      sql: `CREATE POLICY IF NOT EXISTS "Users can view own data" 
        ON public.users FOR SELECT 
        USING (auth.uid() = id);`,
      description: 'Política de visualização de usuários'
    },
    {
      sql: `CREATE POLICY IF NOT EXISTS "Users can update own data" 
        ON public.users FOR UPDATE 
        USING (auth.uid() = id);`,
      description: 'Política de atualização de usuários'
    },
    {
      sql: `CREATE POLICY IF NOT EXISTS "Users can view own accounts" 
        ON public.accounts FOR SELECT 
        USING (auth.uid() = user_id);`,
      description: 'Política de visualização de contas'
    },
    {
      sql: `CREATE POLICY IF NOT EXISTS "Users can view own sessions" 
        ON public.sessions FOR SELECT 
        USING (auth.uid() = user_id);`,
      description: 'Política de visualização de sessões'
    },
    {
      sql: `CREATE POLICY IF NOT EXISTS "Users can view own roles" 
        ON public.user_roles FOR SELECT 
        USING (auth.uid() = user_id);`,
      description: 'Política de visualização de roles'
    }
  ]

  let successCount = 0
  
  for (const policy of policies) {
    const success = await executeSQL(policy.sql, policy.description)
    if (success) successCount++
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Create additional tables for the app
  console.log('\n📊 Criando tabelas adicionais...')
  
  const additionalTables = [
    {
      sql: `CREATE TABLE IF NOT EXISTS public.knowledge_bases (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        index_name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      description: 'Criando tabela knowledge_bases'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.agents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        description TEXT,
        system_prompt TEXT,
        model_id TEXT,
        temperature DOUBLE PRECISION,
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        knowledge_base_id UUID REFERENCES public.knowledge_bases(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      description: 'Criando tabela agents'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.conversations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      description: 'Criando tabela conversations'
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS public.messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );`,
      description: 'Criando tabela messages'
    }
  ]

  for (const table of additionalTables) {
    const success = await executeSQL(table.sql, table.description)
    if (success) successCount++
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n🎉 Aplicação concluída! ${successCount}/${policies.length + additionalTables.length} comandos executados com sucesso.`)
}

applyPolicies()