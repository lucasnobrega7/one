const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function setupMinimalSchema() {
  try {
    console.log('Conectando ao Supabase...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Enable UUID extension first
    console.log('Habilitando extensão UUID...')
    const { error: extError } = await supabase.rpc('exec', {
      query: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    })
    
    if (extError) {
      console.log('Tentando método alternativo para UUID...')
    }

    // Create users table (compatible with NextAuth)
    console.log('Criando tabela users...')
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text,
        email text UNIQUE,
        email_verified timestamptz,
        image text,
        password text,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );
    `
    
    // Create accounts table (NextAuth OAuth)
    console.log('Criando tabela accounts...')
    const accountsTable = `
      CREATE TABLE IF NOT EXISTS accounts (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type text NOT NULL,
        provider text NOT NULL,
        provider_account_id text NOT NULL,
        refresh_token text,
        access_token text,
        expires_at bigint,
        token_type text,
        scope text,
        id_token text,
        session_state text,
        UNIQUE(provider, provider_account_id)
      );
    `

    // Create sessions table (NextAuth)
    console.log('Criando tabela sessions...')
    const sessionsTable = `
      CREATE TABLE IF NOT EXISTS sessions (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        session_token text NOT NULL UNIQUE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires timestamptz NOT NULL
      );
    `

    // Create verification_tokens table (NextAuth)
    console.log('Criando tabela verification_tokens...')
    const verificationTokensTable = `
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier text NOT NULL,
        token text NOT NULL UNIQUE,
        expires timestamptz NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `

    // Execute tables creation
    const tables = [
      { name: 'users', sql: usersTable },
      { name: 'accounts', sql: accountsTable },
      { name: 'sessions', sql: sessionsTable },
      { name: 'verification_tokens', sql: verificationTokensTable }
    ]

    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec', { query: table.sql })
        if (error) {
          console.error(`Erro criando tabela ${table.name}:`, error)
          // Try direct approach
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ query: table.sql })
          })
          
          if (response.ok) {
            console.log(`✓ Tabela ${table.name} criada via método alternativo`)
          } else {
            console.error(`Falha na criação da tabela ${table.name}`)
          }
        } else {
          console.log(`✓ Tabela ${table.name} criada com sucesso`)
        }
      } catch (err) {
        console.error(`Erro executando SQL para ${table.name}:`, err.message)
      }
    }

    console.log('Schema mínimo aplicado!')
    
  } catch (error) {
    console.error('Erro geral:', error)
  }
}

setupMinimalSchema()