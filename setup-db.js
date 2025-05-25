const { createClient } = require("@supabase/supabase-js")
const fs = require('fs')

async function setupDatabase() {
  const supabaseUrl = "https://faccixlabriqwxkxqprw.supabase.co"
  const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2NpeGxhYnJpcXd4a3hxcHJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODAyNzEyMiwiZXhwIjoyMDYzNjAzMTIyfQ.ZTY8KZxF_B2Isx5P4OKqRnryDSIeXGH4GK5hEX6nC7E"

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log("Aplicando schema do banco...")
    
    // Ler e executar schema principal
    const schema = fs.readFileSync('./supabase/schema.sql', 'utf8')
    
    // Dividir em comandos individuais
    const commands = schema.split(';').filter(cmd => cmd.trim().length > 0)
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim() + ';'
      if (command.length > 5) { // Evitar comandos vazios
        console.log(`Executando comando ${i + 1}/${commands.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: command })
        if (error && !error.message.includes('already exists')) {
          console.log(`Erro no comando ${i + 1}:`, error.message)
        }
      }
    }

    // Aplicar migration adicional
    console.log("Aplicando migrations...")
    const migration = fs.readFileSync('./supabase/migrations/001_add_sync_fields.sql', 'utf8')
    const migrationCommands = migration.split(';').filter(cmd => cmd.trim().length > 0)
    
    for (let i = 0; i < migrationCommands.length; i++) {
      const command = migrationCommands[i].trim() + ';'
      if (command.length > 5) {
        console.log(`Executando migration ${i + 1}/${migrationCommands.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: command })
        if (error && !error.message.includes('already exists')) {
          console.log(`Erro na migration ${i + 1}:`, error.message)
        }
      }
    }

    console.log("✅ Schema aplicado com sucesso!")
    
  } catch (error) {
    console.error("Erro ao aplicar schema:", error)
  }
}

setupDatabase()