import { NextRequest, NextResponse } from 'next/server'

// Mock data para demonstração
const mockAgents = [
  {
    id: '1',
    name: 'Agente de Vendas',
    status: 'online',
    conversations: 127,
    description: 'Especialista em conversão de leads para vendas',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Suporte Técnico',
    status: 'online', 
    conversations: 89,
    description: 'Assistente para questões técnicas e troubleshooting',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Agente Marketing',
    status: 'offline',
    conversations: 43,
    description: 'Especialista em campanhas e estratégias de marketing',
    createdAt: '2024-02-01T09:15:00Z'
  }
]

export async function GET() {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json(mockAgents)
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch agents'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newAgent = {
      id: Date.now().toString(),
      name: body.name || 'Novo Agente',
      status: 'offline',
      conversations: 0,
      description: body.description || '',
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json(newAgent)
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to create agent'
    }, { status: 500 })
  }
}