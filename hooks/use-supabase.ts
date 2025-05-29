"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useEffect, useState } from "react"
import type { Database } from "@/types/supabase"

export function useSupabase() {
  const { data: session } = // TODO: Replace with Supabase auth()
  const [isReady, setIsReady] = useState(false)
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const setupSupabase = async () => {
      if (session?.user) {
        // Verificar se já existe uma sessão no Supabase
        const { data } = await supabase.auth.getSession()

        if (!data.session) {
          // Se não houver sessão, sincronizar com o servidor
          await fetch("/api/auth/sync-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
        }

        setIsReady(true)
      }
    }

    setupSupabase()
  }, [session, supabase])

  return { supabase, isReady }
}
