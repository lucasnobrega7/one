import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function setupPrismaUser() {
  console.log('🔧 Configurando usuário Prisma conforme documentação Supabase...')
  
  try {
    // Generate a secure password for Prisma user
    const prismaPassword = 'Ag3nt3sC0nv3rs40_2025!'
    
    console.log('📝 Criando usuário "prisma" com privilégios necessários...')
    
    // Create Prisma user following Supabase official docs
    const createUserSQL = `
      -- Create Prisma user with bypassing RLS and createdb privileges
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'prisma') THEN
          CREATE USER "prisma" WITH PASSWORD '${prismaPassword}' BYPASSRLS CREATEDB;
        END IF;
      END
      $$;
      
      -- Grant prisma to postgres (required for elevated privileges)
      GRANT "prisma" TO "postgres";
      
      -- Grant usage and create on public schema
      GRANT USAGE, CREATE ON SCHEMA public TO prisma;
      
      -- Grant all privileges on all tables in public schema
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prisma;
      
      -- Grant all privileges on all sequences in public schema
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prisma;
      
      -- Set default privileges for future tables
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO prisma;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;
    `
    
    // Execute the SQL commands
    const { data, error } = await supabase.rpc('exec', {
      sql: createUserSQL
    })
    
    if (error) {
      // Try individual commands if batch fails
      console.log('⚠️  Tentando comandos individuais...')
      
      const commands = [
        `CREATE USER IF NOT EXISTS "prisma" WITH PASSWORD '${prismaPassword}' BYPASSRLS CREATEDB;`,
        `GRANT "prisma" TO "postgres";`,
        `GRANT USAGE, CREATE ON SCHEMA public TO prisma;`,
        `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prisma;`,
        `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prisma;`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO prisma;`,
        `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;`
      ]
      
      for (const command of commands) {
        try {
          await supabase.rpc('exec', { sql: command })
          console.log(`✅ Executado: ${command.split(' ').slice(0, 3).join(' ')}...`)
        } catch (cmdError) {
          console.log(`⚠️  Aviso: ${command.split(' ').slice(0, 3).join(' ')}:`, cmdError)
        }
      }
    } else {
      console.log('✅ Usuário Prisma configurado com sucesso!')
    }
    
    // Get project reference for connection string
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const projectRef = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1]
    
    if (!projectRef) {
      throw new Error('Não foi possível extrair referência do projeto do URL do Supabase')
    }
    
    // Construct the Prisma connection string following Supabase docs
    const prismaConnectionString = `postgres://prisma.${projectRef}:${encodeURIComponent(prismaPassword)}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
    
    console.log('\n📋 CONFIGURAÇÃO NECESSÁRIA:')
    console.log('1. Adicione as seguintes variáveis ao seu .env.local:')
    console.log('\n# PRISMA DATABASE CONNECTION (Usuário específico)')
    console.log(`PRISMA_DATABASE_URL="${prismaConnectionString}"`)
    console.log(`PRISMA_DIRECT_URL="postgresql://prisma.${projectRef}:${encodeURIComponent(prismaPassword)}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"`)
    
    console.log('\n2. Atualize seu prisma/schema.prisma:')
    console.log('```prisma')
    console.log('datasource db {')
    console.log('  provider  = "postgresql"')
    console.log('  url       = env("PRISMA_DATABASE_URL")')
    console.log('  directUrl = env("PRISMA_DIRECT_URL")')
    console.log('}')
    console.log('```')
    
    console.log('\n3. Execute os comandos:')
    console.log('   npx prisma db push')
    console.log('   npx prisma generate')
    
    return {
      success: true,
      connectionString: prismaConnectionString,
      directUrl: `postgresql://prisma.${projectRef}:${encodeURIComponent(prismaPassword)}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`
    }
    
  } catch (error) {
    console.error('❌ Erro ao configurar usuário Prisma:', error)
    return { success: false, error }
  }
}

async function main() {
  console.log('🚀 CONFIGURAÇÃO PRISMA + SUPABASE (Documentação Oficial)\n')
  
  const result = await setupPrismaUser()
  
  if (result.success) {
    console.log('\n🎉 Configuração concluída com sucesso!')
    console.log('📌 Próximos passos: Atualize as variáveis de ambiente e teste a conexão')
  } else {
    console.log('\n❌ Falha na configuração')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('💥 Erro fatal:', error)
      process.exit(1)
    })
}

export { setupPrismaUser }