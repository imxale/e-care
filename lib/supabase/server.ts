import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (error) {
            // Gérer l'erreur si nécessaire
            console.error("Error setting cookies in Server Action:", error);
            // Note: Le set() dans les Server Actions génère une erreur en lecture seule
            // car le store est en lecture seule. Nous le mettons dans un bloc try/catch pour
            // éviter une erreur non gérée. Le middleware gérera la mise à jour.
          }
        },
      },
    }
  )
} 