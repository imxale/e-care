import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AuthService } from '../../services/auth';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Interface pour éviter les erreurs de typage
interface TestUser {
  id: string;
  email: string;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown>;
}

// Mock du client supabase
const mockSupabaseAuth = {
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  resetPasswordForEmail: jest.fn(),
  updateUser: jest.fn(),
  getSession: jest.fn(),
  getUser: jest.fn()
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: mockSupabaseAuth
  }))
}));

// Origin URL pour les tests
const ORIGIN_URL = 'https://ecare.example.com';

// Mock de location.origin utilisé dans le service
const mockLocation = { origin: ORIGIN_URL };
// Définition de window plus typée
global.window = { location: mockLocation } as Window & typeof globalThis;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('doit inscrire un nouvel utilisateur avec succès', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockResponse = { data: { user: mockUser }, error: null };
      
      mockSupabaseAuth.signUp.mockResolvedValue(mockResponse as never);
      
      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
        role: 'patient',
        metadata: { firstName: 'Jean', lastName: 'Dupont' }
      });
      
      expect(mockSupabaseAuth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: `${ORIGIN_URL}/auth/callback`,
          data: {
            role: 'patient',
            firstName: 'Jean',
            lastName: 'Dupont'
          }
        }
      });
      
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('signIn', () => {
    it('doit connecter un utilisateur existant', async () => {
      const mockSession = { user: { id: 'user123', email: 'test@example.com' } };
      const mockResponse = { data: mockSession, error: null };
      
      mockSupabaseAuth.signInWithPassword.mockResolvedValue(mockResponse as never);
      
      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(mockSupabaseAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(result).toEqual(mockSession);
    });
  });

  describe('signOut', () => {
    it('doit déconnecter un utilisateur', async () => {
      mockSupabaseAuth.signOut.mockResolvedValue({ error: null } as never);
      
      await AuthService.signOut();
      
      expect(mockSupabaseAuth.signOut).toHaveBeenCalled();
    });
  });

  describe('resetPasswordRequest', () => {
    it('doit envoyer une demande de réinitialisation de mot de passe', async () => {
      mockSupabaseAuth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null } as never);
      
      await AuthService.resetPasswordRequest('test@example.com');
      
      expect(mockSupabaseAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: 'https://ecare.example.com/reset-password'
        }
      );
    });
  });

  describe('updatePassword', () => {
    it('doit mettre à jour le mot de passe', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockResponse = { data: { user: mockUser }, error: null };
      
      mockSupabaseAuth.updateUser.mockResolvedValue(mockResponse as never);
      
      const result = await AuthService.updatePassword('newPassword123');
      
      expect(mockSupabaseAuth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123'
      });
      
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getSession', () => {
    it('doit récupérer la session utilisateur', async () => {
      const mockSession = { user: { id: 'user123' } };
      const mockResponse = { data: { session: mockSession }, error: null };
      
      mockSupabaseAuth.getSession.mockResolvedValue(mockResponse as never);
      
      const result = await AuthService.getSession();
      
      expect(mockSupabaseAuth.getSession).toHaveBeenCalled();
      expect(result).toEqual(mockSession);
    });
  });

  describe('getUser', () => {
    it('doit récupérer les informations de l\'utilisateur', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com' };
      const mockResponse = { data: { user: mockUser }, error: null };
      
      mockSupabaseAuth.getUser.mockResolvedValue(mockResponse as never);
      
      const result = await AuthService.getUser();
      
      expect(mockSupabaseAuth.getUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('isEmailConfirmed', () => {
    it('doit retourner true si l\'email est confirmé', async () => {
      const mockUser: TestUser = { 
        id: 'user123', 
        email: 'test@example.com', 
        email_confirmed_at: '2023-01-01T00:00:00.000Z' 
      };
      
      // Cast en SupabaseUser pour éviter les erreurs de types
      jest.spyOn(AuthService, 'getUser').mockResolvedValue(mockUser as unknown as SupabaseUser);
      
      const result = await AuthService.isEmailConfirmed();
      
      expect(AuthService.getUser).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('doit retourner false si l\'email n\'est pas confirmé', async () => {
      const mockUser: TestUser = { 
        id: 'user123', 
        email: 'test@example.com', 
        email_confirmed_at: null 
      };
      
      // Cast en SupabaseUser pour éviter les erreurs de types
      jest.spyOn(AuthService, 'getUser').mockResolvedValue(mockUser as unknown as SupabaseUser);
      
      const result = await AuthService.isEmailConfirmed();
      
      expect(AuthService.getUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });

  describe('getRoleFromUserMetadata', () => {
    it('doit extraire le rôle des métadonnées utilisateur', () => {
      const mockUser: TestUser = {
        id: 'user123',
        email: 'test@example.com',
        user_metadata: { role: 'patient' }
      };
      
      const result = AuthService.getRoleFromUserMetadata(mockUser as unknown as SupabaseUser);
      
      expect(result).toBe('patient');
    });

    it('doit retourner null si l\'utilisateur est null', () => {
      const result = AuthService.getRoleFromUserMetadata(null);
      
      expect(result).toBeNull();
    });

    it('doit retourner null si les métadonnées ne contiennent pas de rôle', () => {
      const mockUser: TestUser = {
        id: 'user123',
        email: 'test@example.com',
        user_metadata: { }
      };
      
      const result = AuthService.getRoleFromUserMetadata(mockUser as unknown as SupabaseUser);
      
      expect(result).toBeNull();
    });
  });
}); 