import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => name.startsWith('sb-'))
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtectedRoute =
    pathname.startsWith('/dashboard') && !pathname.startsWith('/stocks')
  const hasSessionCookie = hasSupabaseSessionCookie(request)

  // Unauthenticated visitors to login/signup: skip Supabase network call.
  // Proxy redirects break RSC client navigation ("Failed to fetch RSC payload").
  if (isAuthPage && !hasSessionCookie) {
    return NextResponse.next({ request })
  }

  // Protected routes without a session cookie: redirect without Supabase round-trip.
  if (isProtectedRoute && !hasSessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Public marketing/stock pages without a session: no auth work needed.
  if (!hasSessionCookie && !isProtectedRoute && !isAuthPage) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
