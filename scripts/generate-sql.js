const fs = require('fs')
const path = require('path')

// Read the schema file
const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
const schemaSql = fs.readFileSync(schemaPath, 'utf8')

console.log('=== EXECUTE THIS SQL IN SUPABASE SQL EDITOR ===')
console.log('')
console.log(schemaSql)
console.log('')
console.log('=== END OF SQL ===')

// Also write to a file for easy copy-paste
const outputPath = path.join(process.cwd(), 'supabase', 'complete-schema.sql')
fs.writeFileSync(outputPath, schemaSql)
console.log(`SQL também salvo em: ${outputPath}`)
console.log('Acesse: https://supabase.com/dashboard/project/jiasbwazaicmcckmehtn/sql')
console.log('Cole o SQL acima no editor e execute!')