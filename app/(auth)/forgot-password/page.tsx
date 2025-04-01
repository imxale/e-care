'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const { resetPasswordRequest, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await resetPasswordRequest(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription>
            {isSubmitted 
              ? "Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception." 
              : "Entrez votre adresse email pour recevoir un lien de réinitialisation."}
          </CardDescription>
        </CardHeader>
        {!isSubmitted ? (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <div className="bg-green-50 p-4 rounded-md mb-4">
              <p className="text-green-800">
                Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </CardContent>
        )}
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            Vous vous souvenez de votre mot de passe ?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 