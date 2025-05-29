import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/error?error=missing_authorization_code', requestUrl.origin)
    )
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://cloud.digitalocean.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.DIGITALOCEAN_CLIENT_ID,
        client_secret: process.env.DIGITALOCEAN_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${requestUrl.origin}/auth/callback/digitalocean`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for token')
    }

    const tokenData = await tokenResponse.json()
    const { access_token, token_type, scope } = tokenData

    // Store the token securely (in this case, we'll use Supabase session)
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.redirect(
        new URL('/auth/login?error=no_session', requestUrl.origin)
      )
    }

    // Store DigitalOcean token in user metadata or a separate table
    const { error: updateError } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: session.user.id,
        provider: 'digitalocean',
        access_token,
        token_type,
        scope,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (updateError) {
      console.error('Error storing DigitalOcean token:', updateError)
      return NextResponse.redirect(
        new URL('/auth/error?error=token_storage_failed', requestUrl.origin)
      )
    }

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      new URL('/dashboard/integrations?digitalocean=connected', requestUrl.origin)
    )

  } catch (error) {
    console.error('DigitalOcean OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/auth/error?error=oauth_callback_failed', requestUrl.origin)
    )
  }
}