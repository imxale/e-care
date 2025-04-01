'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isValidLinkCheck, setIsValidLinkCheck] = useState(true);

  useEffect(() => {
    // Vérifie que l'utilisateur a bien un hash de réinitialisation dans l'URL
    const supabase = createClient();
    
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        setIsValidLinkCheck(false);
        toast.error("Lien de réinitialisation invalide ou expiré");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };
    
    checkSession();
  }, [router]);

  useEffect(() => {
    // Validation des mots de passe
    if (password.length >= 8 && password === confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Double vérification de la sécurité du mot de passe
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      await updatePassword(password);
      toast.success('Mot de passe mis à jour avec succès');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe :', error);
    }
  };

  if (!isValidLinkCheck) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Lien invalide</CardTitle>
            <CardDescription>
              Ce lien de réinitialisation est invalide ou a expiré. Vous allez être redirigé vers la page de connexion.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Définir un nouveau mot de passe</CardTitle>
          <CardDescription>
            Veuillez créer un nouveau mot de passe sécurisé pour votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
              {password && password.length < 8 && (
                <p className="text-xs text-red-500">Le mot de passe doit contenir au moins 8 caractères</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour le mot de passe'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-500 w-full">
            Votre mot de passe doit contenir au moins 8 caractères pour assurer la sécurité de votre compte.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 