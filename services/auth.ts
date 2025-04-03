import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// Types pour les fonctions d'authentification
type SignUpParams = {
  email: string;
  password: string;
  role?: "patient" | "medecin" | "admin";
  metadata?: Record<string, string | number | boolean>;
};

type SignInParams = {
  email: string;
  password: string;
};

export const AuthService = {
  // Inscription d'un nouvel utilisateur
  async signUp({ email, password, role = "patient", metadata = {} }: SignUpParams) {
    const supabase = createClient();
    
    // Inclure firstName et lastName dans les metadata si présents
    const userMetadata = {
      role,
      ...metadata
    };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: userMetadata,
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Connexion d'un utilisateur existant
  async signIn({ email, password }: SignInParams) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Déconnexion
  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  },

  // Demande de réinitialisation du mot de passe
  async resetPasswordRequest(email: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    return data;
  },

  // Mise à jour du mot de passe
  async updatePassword(newPassword: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return data;
  },

  // Récupération de la session utilisateur
  async getSession() {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    return data.session;
  },

  // Récupération des informations de l'utilisateur connecté
  async getUser() {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return data.user;
  },

  // Vérification si l'email est confirmé
  async isEmailConfirmed() {
    const user = await this.getUser();
    return user?.email_confirmed_at ? true : false;
  },
  
  // Récupérer le rôle utilisateur depuis les métadonnées
  getRoleFromUserMetadata(user: User | null) {
    if (!user) return null;
    return user.user_metadata?.role || null;
  }
}; 