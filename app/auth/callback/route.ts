import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Erro ao trocar código por sessão:", error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=OAuthCallback`)
    }

    // Redirecionar para o dashboard após autenticação bem-sucedida
    return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
  }

  // Se não houver código, redirecionar para a página de erro
  return NextResponse.redirect(`${requestUrl.origin}/auth/error?error=Callback`)
}
