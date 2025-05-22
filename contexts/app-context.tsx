"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Session } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

// Tipos
type AppContextType = {
  session: Session | null
  loading: boolean
  user: any | null
  userSettings: any | null
  refreshSession: () => Promise<void>
  refreshUserSettings: () => Promise<void>
}

// Contexto
const AppContext = createContext<AppContextType | undefined>(undefined)

// Hook para usar o contexto
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext deve ser usado dentro de um AppContextProvider")
  }
  return context
}

// Provedor do contexto
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)
  const [userSettings, setUserSettings] = useState<any | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  // Carregar sessão inicial
  useEffect(() => {
    const loadInitialSession = async () => {
      try {
        setLoading(true)

        // Obter sessão atual
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        setSession(currentSession)

        if (currentSession?.user) {
          setUser(currentSession.user)
          await refreshUserSettings()
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialSession()

    // Configurar listener para mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)

      if (newSession?.user) {
        await refreshUserSettings()
      } else {
        setUserSettings(null)
      }

      // Redirecionar com base no evento
      if (event === "SIGNED_IN") {
        router.refresh()
      } else if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    // Limpar subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  // Atualizar sessão
  const refreshSession = async () => {
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user || null)
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error)
    }
  }

  // Atualizar configurações do usuário
  const refreshUserSettings = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single()

      if (error) throw error
      setUserSettings(data)
    } catch (error) {
      console.error("Erro ao carregar configurações do usuário:", error)
    }
  }

  const value = {
    session,
    loading,
    user,
    userSettings,
    refreshSession,
    refreshUserSettings,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
