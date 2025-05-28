import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? 'https://dash.agentesdeconversao.ai/'

  if (code) {
    const supabase = createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      // Small delay to ensure session is properly established
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Always redirect to dashboard subdomain after successful auth
      if (next.startsWith('http')) {
        return NextResponse.redirect(next)
      } else {
        return NextResponse.redirect(`https://dash.agentesdeconversao.ai${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
