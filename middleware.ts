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

  // Routes protégées (nécessitent une authentification)
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
  const currentPath = request.nextUrl.pathname

  // Vérifier si l'utilisateur est sur une route protégée sans être authentifié
  if (!session && protectedRoutes.some(route => currentPath.startsWith(route))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', currentPath)
    return NextResponse.redirect(redirectUrl)
  }

  // Rediriger les utilisateurs déjà connectés qui tentent d'accéder aux pages d'auth
  if (session && authRoutes.some(route => currentPath === route)) {
    // Obtenir les métadonnées de l'utilisateur pour déterminer son rôle
    const { data: user } = await supabase.auth.getUser()
    const userRole = user?.user?.user_metadata?.role || 'patient'
    
    return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
  }

  // Si l'utilisateur est connecté et essaie d'accéder à un dashboard spécifique à un rôle
  if (session && currentPath.startsWith('/dashboard/')) {
    // Obtenir les métadonnées de l'utilisateur pour déterminer son rôle
    const { data: user } = await supabase.auth.getUser()
    const userRole = user?.user?.user_metadata?.role || 'patient'
    
    // Vérifier si l'utilisateur a le bon rôle pour accéder à cette page
    if (
      (currentPath.startsWith('/dashboard/patient') && userRole !== 'patient') ||
      (currentPath.startsWith('/dashboard/medecin') && userRole !== 'medecin') ||
      (currentPath.startsWith('/dashboard/admin') && userRole !== 'admin')
    ) {
      return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
    }
  }

  // Vérifier si l'email a été vérifié pour les routes protégées
  if (session && protectedRoutes.some(route => currentPath.startsWith(route))) {
    const { data: user } = await supabase.auth.getUser()
    const isEmailVerified = user?.user?.email_confirmed_at
    
    if (!isEmailVerified) {
      return NextResponse.redirect(new URL('/verify-email', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 