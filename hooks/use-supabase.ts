"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import type { Database } from "@/types/supabase"

export function useSupabase() {
  const { data: session } = useSession()
  const [isReady, setIsReady] = useState(false)
  const supabase = createClientComponentClient<Database>()

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
