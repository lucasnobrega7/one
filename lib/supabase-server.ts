import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerSupabaseClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get: (name) => cookies().get(name)?.value,
      set: (name, value, options) => {
        cookies().set(name, value, options)
      },
      remove: (name, options) => {
        cookies().set(name, "", { ...options, maxAge: 0 })
      },
    },
  })
}

export async function getServerSupabaseClient() {
  const supabase = createServerSupabaseClient()
  return supabase
}
