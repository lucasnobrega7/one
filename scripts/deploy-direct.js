#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 Preparando deploy direto para Railway...')

// Criar um package.json simplificado para Railway
const railwayPackage = {
  "name": "agentes-de-conversao",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'Build concluído'",
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}

// Criar um servidor Express simples
const serverContent = `
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Agentes de Conversão API rodando',
    timestamp: new Date().toISOString(),
    supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL
  })
})

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: '🤖 Agentes de Conversão - API em funcionamento',
    version: '1.0.0',
    endpoints: ['/health', '/api/status'],
    supabase_connected: !!process.env.NEXT_PUBLIC_SUPABASE_URL
  })
})

// Rota de status da integração
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Agentes de Conversão',
    status: 'operational',
    integrations: {
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextauth: !!process.env.NEXTAUTH_SECRET,
      google_oauth: !!process.env.GOOGLE_CLIENT_ID
    },
    timestamp: new Date().toISOString()
  })
})

app.listen(port, () => {
  console.log(\`🚀 Servidor rodando na porta \${port}\`)
  console.log(\`🔗 Supabase: \${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Conectado' : 'Não configurado'}\`)
})
`

// Criar arquivos para deploy
fs.writeFileSync('package-railway.json', JSON.stringify(railwayPackage, null, 2))
fs.writeFileSync('server.js', serverContent)

console.log('✅ Arquivos de deploy criados')
console.log('📦 package-railway.json - configuração simplificada')
console.log('🚀 server.js - servidor Express')
console.log('')
console.log('🎯 Para fazer deploy:')
console.log('1. Copie package-railway.json para package.json')
console.log('2. railway up')
console.log('')
console.log('💡 Ou use: mv package-railway.json package.json && railway up')