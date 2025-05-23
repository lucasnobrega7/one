import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/config/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()

    // Buscar configurações do usuário
    const { data: userSettings, error: settingsError } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    // Se não existir, criar configurações padrão
    if (settingsError && settingsError.code === 'PGRST116') {
      const defaultSettings = {
        user_id: session.user.id,
        theme: 'dark',
        language: 'pt-br',
        email_notifications: true,
        push_notifications: false,
        default_model: 'gpt-4',
        default_temperature: 0.7,
        max_tokens: 2048,
        auto_save_conversations: true,
        conversation_history_limit: 100,
        api_rate_limit: 1000,
        advanced_features: false
      }

      const { data: newSettings, error: createError } = await supabase
        .from("user_settings")
        .insert(defaultSettings)
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: "Erro ao criar configurações" }, { status: 500 })
      }

      return NextResponse.json(newSettings)
    }

    if (settingsError) {
      return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 })
    }

    // Buscar informações de uso e limites
    const { data: usage, error: usageError } = await supabase
      .from("usage_statistics")
      .select("*")
      .eq("user_id", session.user.id)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // últimos 30 dias

    const usageStats = {
      totalRequests: usage?.reduce((sum, stat) => sum + (stat.api_calls || 0), 0) || 0,
      totalTokens: usage?.reduce((sum, stat) => sum + (stat.tokens_used || 0), 0) || 0,
      remainingQuota: Math.max(0, (userSettings.api_rate_limit || 1000) - (usage?.length || 0))
    }

    return NextResponse.json({
      settings: userSettings,
      usage: usageStats,
      availableModels: [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
        { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' }
      ]
    })

  } catch (error: any) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const updates = await req.json()

    // Validar campos permitidos
    const allowedFields = [
      'theme',
      'language',
      'email_notifications',
      'push_notifications',
      'default_model',
      'default_temperature',
      'max_tokens',
      'auto_save_conversations',
      'conversation_history_limit',
      'advanced_features'
    ]

    const validUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(validUpdates).length === 0) {
      return NextResponse.json({ error: "Nenhum campo válido para atualizar" }, { status: 400 })
    }

    // Validações específicas
    if (validUpdates.default_temperature !== undefined) {
      if (validUpdates.default_temperature < 0 || validUpdates.default_temperature > 2) {
        return NextResponse.json({ 
          error: "Temperature deve estar entre 0 e 2" 
        }, { status: 400 })
      }
    }

    if (validUpdates.max_tokens !== undefined) {
      if (validUpdates.max_tokens < 1 || validUpdates.max_tokens > 8192) {
        return NextResponse.json({ 
          error: "Max tokens deve estar entre 1 e 8192" 
        }, { status: 400 })
      }
    }

    if (validUpdates.conversation_history_limit !== undefined) {
      if (validUpdates.conversation_history_limit < 10 || validUpdates.conversation_history_limit > 1000) {
        return NextResponse.json({ 
          error: "Limite de histórico deve estar entre 10 e 1000" 
        }, { status: 400 })
      }
    }

    // Atualizar configurações
    validUpdates.updated_at = new Date().toISOString()

    const { data: updatedSettings, error } = await supabase
      .from("user_settings")
      .update(validUpdates)
      .eq("user_id", session.user.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar configurações:", error)
      return NextResponse.json({ error: "Erro ao atualizar configurações" }, { status: 500 })
    }

    return NextResponse.json(updatedSettings)

  } catch (error: any) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')

    if (!action) {
      return NextResponse.json({ error: "Ação não especificada" }, { status: 400 })
    }

    switch (action) {
      case 'reset_settings':
        // Resetar configurações para padrão
        const defaultSettings = {
          theme: 'dark',
          language: 'pt-br',
          email_notifications: true,
          push_notifications: false,
          default_model: 'gpt-4',
          default_temperature: 0.7,
          max_tokens: 2048,
          auto_save_conversations: true,
          conversation_history_limit: 100,
          advanced_features: false,
          updated_at: new Date().toISOString()
        }

        const { data: resetSettings, error: resetError } = await supabase
          .from("user_settings")
          .update(defaultSettings)
          .eq("user_id", session.user.id)
          .select()
          .single()

        if (resetError) {
          return NextResponse.json({ error: "Erro ao resetar configurações" }, { status: 500 })
        }

        return NextResponse.json(resetSettings)

      case 'clear_history':
        // Limpar histórico de conversações
        const { error: clearError } = await supabase
          .from("conversations")
          .delete()
          .eq("user_id", session.user.id)

        if (clearError) {
          return NextResponse.json({ error: "Erro ao limpar histórico" }, { status: 500 })
        }

        return NextResponse.json({ message: "Histórico limpo com sucesso" })

      case 'clear_usage':
        // Limpar estatísticas de uso
        const { error: usageError } = await supabase
          .from("usage_statistics")
          .delete()
          .eq("user_id", session.user.id)

        if (usageError) {
          return NextResponse.json({ error: "Erro ao limpar estatísticas" }, { status: 500 })
        }

        return NextResponse.json({ message: "Estatísticas limpas com sucesso" })

      default:
        return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 })
    }

  } catch (error: any) {
    console.error("Erro na operação de configurações:", error)
    return NextResponse.json({ error: error.message || "Erro interno do servidor" }, { status: 500 })
  }
}