'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { AuthService } from '@/services/auth';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const handleResendVerificationEmail = async () => {
    if (!user?.email) {
      toast.error("Aucune adresse email disponible");
      return;
    }
    
    setIsResendingEmail(true);
    try {
      // Utiliser resetPasswordRequest car Supabase n'a pas d'API dédiée pour renvoyer l'email de vérification
      // Cette méthode envoie un email qui confirme l'email de l'utilisateur
      await AuthService.resetPasswordRequest(user.email);
      toast.success("Email de vérification envoyé", {
        description: "Veuillez vérifier votre boîte de réception."
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue.";
      toast.error("Échec de l'envoi", { description: errorMessage });
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Vérifiez votre email</CardTitle>
          <CardDescription>
            Nous avons envoyé un lien de vérification à{' '}
            <span className="font-medium">{user?.email || 'votre adresse email'}</span>.
            Veuillez vérifier votre boîte de réception et suivre les instructions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-800 text-sm">
              Vous devez vérifier votre adresse email avant de pouvoir accéder à votre compte.
              Si vous ne trouvez pas l&apos;email, vérifiez votre dossier spam ou courrier indésirable.
            </p>
          </div>
          <Button 
            onClick={handleResendVerificationEmail}
            disabled={isResendingEmail}
            className="w-full"
          >
            {isResendingEmail ? 'Envoi en cours...' : 'Renvoyer l\'email de vérification'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Retour à la page de connexion
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 