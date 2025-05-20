import { createClient } from "@supabase/supabase-js"
import { config } from "@/lib/config"

// Criar cliente Supabase
export const supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey)
