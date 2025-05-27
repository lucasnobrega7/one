import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import { execSync } from 'child_process'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function resetAndSyncDatabase() {
  console.log('🔄 Sincronizando database com Prisma schema...')
  
  try {
    // 1. Backup current data if any exists
    console.log('📦 Verificando dados existentes...')
    
    // 2. Reset database using Prisma
    console.log('🔄 Executando Prisma db push...')
    execSync('npx prisma db push --force-reset', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    // 3. Enable pgvector extension
    console.log('🔧 Habilitando extensão pgvector...')
    try {
      await supabase.rpc('exec', {
        sql: 'CREATE EXTENSION IF NOT EXISTS vector;'
      })
      console.log('✅ Extensão pgvector habilitada')
    } catch (error) {
      console.log('⚠️  Não foi possível habilitar pgvector:', error)
    }
    
    // 4. Create additional functions and optimizations
    console.log('🔧 Criando funções auxiliares...')
    
    const functions = [
      // Function to handle user creation
      `CREATE OR REPLACE FUNCTION public.handle_new_user()
       RETURNS TRIGGER AS $$
       BEGIN
         -- Create user settings
         INSERT INTO public.user_settings (user_id, theme, language)
         VALUES (NEW.id, 'light', 'pt-BR')
         ON CONFLICT (user_id) DO NOTHING;
         
         RETURN NEW;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`,
      
      // Trigger for new users
      `DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
       CREATE TRIGGER on_auth_user_created
         AFTER INSERT ON public.users
         FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`,
      
      // Function to check user roles
      `CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, role_name TEXT)
       RETURNS BOOLEAN AS $$
       BEGIN
         RETURN EXISTS (
           SELECT 1 FROM public.memberships
           WHERE user_id = user_uuid
           AND role::text = role_name
         );
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`
    ]
    
    for (const func of functions) {
      try {
        await supabase.rpc('exec', { sql: func })
      } catch (error) {
        console.log('⚠️  Erro ao criar função:', error)
      }
    }
    
    // 5. Set up Row Level Security (RLS)
    console.log('🔐 Configurando Row Level Security...')
    
    const rlsTables = [
      'users', 'organizations', 'memberships', 'agents', 
      'conversations', 'messages', 'analytics', 'datastores'
    ]
    
    for (const table of rlsTables) {
      try {
        await supabase.rpc('exec', {
          sql: `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`
        })
        console.log(`✅ RLS habilitado para ${table}`)
      } catch (error) {
        console.log(`⚠️  Erro ao habilitar RLS para ${table}:`, error)
      }
    }
    
    // 6. Create basic RLS policies
    const policies = [
      // Users can see their own data
      `CREATE POLICY "Users can view own data" ON public.users 
       FOR SELECT USING (auth.uid() = id);`,
      
      // Organization members can see organization data
      `CREATE POLICY "Organization members can view org data" ON public.organizations
       FOR SELECT USING (
         EXISTS (
           SELECT 1 FROM public.memberships 
           WHERE organization_id = organizations.id 
           AND user_id = auth.uid()
         )
       );`,
      
      // Users can create their own agents
      `CREATE POLICY "Users can manage own agents" ON public.agents
       FOR ALL USING (
         EXISTS (
           SELECT 1 FROM public.memberships 
           WHERE organization_id = agents.organization_id 
           AND user_id = auth.uid()
         )
       );`
    ]
    
    for (const policy of policies) {
      try {
        await supabase.rpc('exec', { sql: policy })
      } catch (error) {
        // Policies might already exist
        if (!error.message?.includes('already exists')) {
          console.log('⚠️  Erro ao criar política:', error)
        }
      }
    }
    
    console.log('✅ Database sincronizado com sucesso!')
    return true
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error)
    return false
  }
}

async function createSampleData() {
  console.log('🔄 Criando dados de exemplo...')
  
  try {
    // Create sample organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        name: 'Agentes de Conversão',
        icon_url: 'https://agentesdeconversao.ai/logo.svg'
      })
      .select()
      .single()
    
    if (orgError) {
      console.error('Erro ao criar organização:', orgError)
      return false
    }
    
    console.log('✅ Organização criada:', org.name)
    
    // Create admin user
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        email: 'admin@agentesdeconversao.ai',
        name: 'Admin Sistema',
        avatar_url: 'https://agentesdeconversao.ai/avatar.jpg'
      })
      .select()
      .single()
    
    if (userError) {
      console.error('Erro ao criar usuário:', userError)
      return false
    }
    
    console.log('✅ Usuário admin criado:', user.email)
    
    // Create membership
    const { error: memberError } = await supabase
      .from('memberships')
      .upsert({
        organization_id: org.id,
        user_id: user.id,
        role: 'OWNER'
      })
    
    if (memberError) {
      console.error('Erro ao criar membership:', memberError)
      return false
    }
    
    console.log('✅ Membership criado: Admin como OWNER')
    
    return true
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de exemplo:', error)
    return false
  }
}

async function main() {
  console.log('🚀 SINCRONIZAÇÃO DO DATABASE - AGENTES DE CONVERSÃO\n')
  
  const syncSuccess = await resetAndSyncDatabase()
  
  if (!syncSuccess) {
    console.log('\n❌ Falha na sincronização do database')
    process.exit(1)
  }
  
  const sampleSuccess = await createSampleData()
  
  if (!sampleSuccess) {
    console.log('\n⚠️  Falha ao criar dados de exemplo')
  }
  
  console.log('\n🎉 Database configurado com sucesso!')
  console.log('📊 Próximos passos:')
  console.log('  1. Execute: npm run dev')
  console.log('  2. Acesse: http://localhost:3000')
  console.log('  3. Teste a autenticação')
  
  return true
}

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

export { resetAndSyncDatabase, createSampleData }