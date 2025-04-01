import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Cette route est appelée par Supabase Auth après une action comme la confirmation d'email
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/login';
  
  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Erreur lors de l\'échange du code :', error);
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }
    
    // Vérifier si l'utilisateur est connecté pour déterminer la redirection
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Si l'email a été vérifié, rediriger vers le tableau de bord
      const user = session.user;
      const userRole = user.user_metadata?.role || 'patient';
      
      if (user.email_confirmed_at) {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, requestUrl.origin));
      } else {
        // Si l'email n'est pas encore vérifié, rediriger vers la page de vérification
        return NextResponse.redirect(new URL('/verify-email', requestUrl.origin));
      }
    }
  }
  
  // Par défaut, rediriger vers la page de connexion
  return NextResponse.redirect(new URL(next, requestUrl.origin));
} 