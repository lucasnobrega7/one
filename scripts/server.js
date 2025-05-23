
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
  console.log(`🚀 Servidor rodando na porta ${port}`)
  console.log(`🔗 Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Conectado' : 'Não configurado'}`)
})
