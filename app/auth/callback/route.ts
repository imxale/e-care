import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createUser } from '@/services/userService';

// Cette route est appelée par Supabase Auth après une action comme la confirmation d'email
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/login';
  
  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Erreur lors de l\'échange du code :', error);
      return NextResponse.redirect(new URL('/auth/auth-error', requestUrl.origin));
    }
    
    // Utiliser la session récupérée si disponible
    if (data?.session) {
      const user = data.session.user;
      const userRole = user.user_metadata?.role || 'patient';
      
      if (user.email_confirmed_at) {
        // Si l'email est vérifié, créer l'utilisateur dans la base de données
        try {
          const { firstName, lastName } = user.user_metadata || {};
          
          // Vérifier que les données nécessaires sont présentes
          if (firstName && lastName) {
            // Utiliser directement le service pour créer l'utilisateur
            await createUser(user.id, firstName, lastName, userRole);
          }
        } catch (error) {
          // Si l'erreur est que l'utilisateur existe déjà, ce n'est pas grave
          if (!(error instanceof Error && error.message.includes('existe déjà'))) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
          }
        }
        
        // Rediriger vers le tableau de bord correspondant au rôle
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