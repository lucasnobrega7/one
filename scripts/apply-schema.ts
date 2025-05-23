import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function applySchema() {
  try {
    console.log('Conectando ao Supabase...')
    
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
    
    // Dividir o SQL em comandos individuais
    const commands = schemaSql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

    for (const command of commands) {
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { 
            sql: command + ';' 
          })
          
          if (error) {
            console.error(`Erro executando comando: ${command.substring(0, 50)}...`)
            console.error(error)
          } else {
            console.log(`✓ Comando executado: ${command.substring(0, 50)}...`)
          }
        } catch (err) {
          console.error(`Erro no comando: ${command.substring(0, 50)}...`, err)
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