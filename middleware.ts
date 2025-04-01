import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si l'utilisateur est connecté, vérifier son rôle
  if (session) {
    const user = session.user
    const userRole = user.user_metadata.role || 'patient' // Par défaut, utiliser patient
    
    // Redirection selon le rôle si l'utilisateur essaie d'accéder à un dashboard qui n'est pas le sien
    if (request.nextUrl.pathname.startsWith('/dashboard/')) {
      const urlPath = request.nextUrl.pathname
      
      if (urlPath.startsWith('/dashboard/patient') && userRole !== 'patient') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
      
      if (urlPath.startsWith('/dashboard/medecin') && userRole !== 'medecin') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
      
      if (urlPath.startsWith('/dashboard/administrateur') && userRole !== 'administrateur') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
} 