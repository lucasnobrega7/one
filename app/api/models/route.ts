import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider')
    const category = searchParams.get('category')

    // Definição completa dos modelos disponíveis
    const allModels = [
      // OpenAI Models
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        category: 'chat',
        description: 'Modelo mais avançado da OpenAI para tarefas complexas',
        maxTokens: 8192,
        costPer1kTokens: 0.03,
        features: ['reasoning', 'coding', 'creative_writing', 'analysis'],
        inputTypes: ['text'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-03-14'
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        category: 'chat',
        description: 'Versão otimizada do GPT-4 com mais tokens e menor custo',
        maxTokens: 128000,
        costPer1kTokens: 0.01,
        features: ['reasoning', 'coding', 'creative_writing', 'analysis', 'long_context'],
        inputTypes: ['text', 'image'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-11-06'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        category: 'chat',
        description: 'Modelo rápido e eficiente para a maioria das tarefas',
        maxTokens: 4096,
        costPer1kTokens: 0.002,
        features: ['conversation', 'coding', 'summarization'],
        inputTypes: ['text'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-03-01'
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: 'openai',
        category: 'image',
        description: 'Geração de imagens de alta qualidade a partir de texto',
        maxTokens: 4000,
        costPer1kTokens: 0.04,
        features: ['image_generation', 'creative_art'],
        inputTypes: ['text'],
        outputTypes: ['image'],
        isAvailable: true,
        releaseDate: '2023-10-02'
      },
      // Anthropic Models
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        category: 'chat',
        description: 'Modelo mais poderoso da Anthropic para tarefas complexas',
        maxTokens: 200000,
        costPer1kTokens: 0.015,
        features: ['reasoning', 'analysis', 'coding', 'creative_writing', 'long_context'],
        inputTypes: ['text', 'image'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2024-02-29'
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        category: 'chat',
        description: 'Equilíbrio ideal entre performance e custo',
        maxTokens: 200000,
        costPer1kTokens: 0.003,
        features: ['reasoning', 'analysis', 'coding', 'long_context'],
        inputTypes: ['text', 'image'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2024-02-29'
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        category: 'chat',
        description: 'Modelo rápido e econômico para tarefas simples',
        maxTokens: 200000,
        costPer1kTokens: 0.00025,
        features: ['conversation', 'summarization', 'quick_responses'],
        inputTypes: ['text', 'image'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2024-02-29'
      },
      // Google Models
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'google',
        category: 'chat',
        description: 'Modelo multimodal avançado do Google',
        maxTokens: 32768,
        costPer1kTokens: 0.005,
        features: ['reasoning', 'multimodal', 'coding'],
        inputTypes: ['text', 'image'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-12-06'
      },
      {
        id: 'gemini-pro-vision',
        name: 'Gemini Pro Vision',
        provider: 'google',
        category: 'multimodal',
        description: 'Gemini Pro com capacidades avançadas de visão',
        maxTokens: 32768,
        costPer1kTokens: 0.005,
        features: ['vision', 'image_analysis', 'multimodal'],
        inputTypes: ['text', 'image', 'video'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-12-06'
      },
      // Local/Open Source Models
      {
        id: 'llama-2-70b',
        name: 'Llama 2 70B',
        provider: 'meta',
        category: 'chat',
        description: 'Modelo open source da Meta para auto-hospedagem',
        maxTokens: 4096,
        costPer1kTokens: 0.0, // Open source
        features: ['reasoning', 'coding', 'open_source'],
        inputTypes: ['text'],
        outputTypes: ['text'],
        isAvailable: false, // Requer configuração local
        releaseDate: '2023-07-18'
      },
      {
        id: 'mixtral-8x7b',
        name: 'Mixtral 8x7B',
        provider: 'mistral',
        category: 'chat',
        description: 'Modelo mixture-of-experts de alta performance',
        maxTokens: 32768,
        costPer1kTokens: 0.0007,
        features: ['reasoning', 'multilingual', 'coding'],
        inputTypes: ['text'],
        outputTypes: ['text'],
        isAvailable: true,
        releaseDate: '2023-12-11'
      }
    ]

    // Filtrar por provider se especificado
    let filteredModels = allModels
    if (provider) {
      filteredModels = filteredModels.filter(model => model.provider === provider)
    }

    // Filtrar por categoria se especificado
    if (category) {
      filteredModels = filteredModels.filter(model => model.category === category)
    }

    // Agrupar por provider
    const groupedModels = filteredModels.reduce((acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = []
      }
      acc[model.provider].push(model)
      return acc
    }, {} as Record<string, typeof allModels>)

    // Estatísticas
    const stats = {
      totalModels: filteredModels.length,
      availableModels: filteredModels.filter(m => m.isAvailable).length,
      providers: Array.from(new Set(filteredModels.map(m => m.provider))),
      categories: Array.from(new Set(filteredModels.map(m => m.category)))
    }

    return NextResponse.json({
      models: filteredModels,
      grouped: groupedModels,
      stats,
      lastUpdated: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("Erro ao buscar modelos:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { modelId, prompt, temperature = 0.7, maxTokens = 2048 } = await req.json()

    if (!modelId || !prompt) {
      return NextResponse.json({ 
        error: "ID do modelo e prompt são obrigatórios" 
      }, { status: 400 })
    }

    // Simular teste do modelo
    // Em produção, isso faria uma chamada real para a API do modelo
    
    const testResponse = {
      modelId,
      prompt,
      response: `Esta é uma resposta de teste do modelo ${modelId} para o prompt: "${prompt}"`,
      metadata: {
        temperature,
        maxTokens,
        tokensUsed: Math.floor(Math.random() * 1000) + 100,
        responseTime: Math.floor(Math.random() * 3000) + 500, // ms
        timestamp: new Date().toISOString()
      }
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(testResponse)

  } catch (error: any) {
    console.error("Erro ao testar modelo:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { modelId, settings } = await req.json()

    if (!modelId) {
      return NextResponse.json({ error: "ID do modelo não fornecido" }, { status: 400 })
    }

    // Simular configuração personalizada do modelo
    // Em produção, isso salvaria configurações específicas do usuário
    
    const customSettings = {
      modelId,
      userId: session.user.id,
      settings: {
        temperature: settings.temperature || 0.7,
        maxTokens: settings.maxTokens || 2048,
        topP: settings.topP || 1.0,
        frequencyPenalty: settings.frequencyPenalty || 0.0,
        presencePenalty: settings.presencePenalty || 0.0,
        stopSequences: settings.stopSequences || [],
        systemPrompt: settings.systemPrompt || '',
        customInstructions: settings.customInstructions || ''
      },
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: "Configurações do modelo atualizadas com sucesso",
      settings: customSettings
    })

  } catch (error: any) {
    console.error("Erro ao configurar modelo:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}