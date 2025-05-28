import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Handle domain redirects first
  const hostname = request.headers.get('host') || ''
  const url = new URL(request.url)
  
  // Redirect Vercel preview URLs to landing page  
  if (hostname.includes('vercel.app') && !hostname.includes('localhost')) {
    const redirectUrl = new URL('https://lp.agentesdeconversao.ai' + url.pathname + url.search)
    return NextResponse.redirect(redirectUrl, 301)
  }
  
  // Subdomain routing logic
  if (hostname === 'lp.agentesdeconversao.ai') {
    // Landing page - serve home page content
    return NextResponse.next()
  }
  
  if (hostname === 'login.agentesdeconversao.ai') {
    // Auth subdomain - rewrite to auth routes
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/auth/signup'
      return NextResponse.rewrite(url)
    }
    if (!url.pathname.startsWith('/auth/')) {
      url.pathname = `/auth${url.pathname}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }
  
  if (hostname === 'dash.agentesdeconversao.ai') {
    // Dashboard subdomain - rewrite to dashboard routes
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/dashboard'
      return NextResponse.rewrite(url)
    }
    if (!url.pathname.startsWith('/dashboard/')) {
      url.pathname = `/dashboard${url.pathname}`
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }
  
  // Redirect main domain to landing page
  if (hostname === 'agentesdeconversao.ai' || hostname === 'www.agentesdeconversao.ai') {
    const redirectUrl = new URL('https://lp.agentesdeconversao.ai' + url.pathname + url.search)
    return NextResponse.redirect(redirectUrl, 301)
  }
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect dashboard routes - redirect to login subdomain
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/dashboard') ||
     request.nextUrl.pathname.startsWith('/onboarding') ||
     hostname === 'dash.agentesdeconversao.ai')
  ) {
    const redirectUrl = new URL('https://login.agentesdeconversao.ai/signup')
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect authenticated users to dashboard subdomain
  if (
    user &&
    (request.nextUrl.pathname.startsWith('/auth/login') ||
     request.nextUrl.pathname.startsWith('/auth/signup') ||
     hostname === 'login.agentesdeconversao.ai')
  ) {
    const redirectUrl = new URL('https://dash.agentesdeconversao.ai/')
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - static assets (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}