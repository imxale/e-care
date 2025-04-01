'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function AuthErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-red-600">Erreur d&apos;authentification</CardTitle>
          <CardDescription>
            Une erreur s&apos;est produite lors de votre authentification. Cela peut être dû à un lien expiré
            ou déjà utilisé.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-800 text-sm">
              Nous n&apos;avons pas pu traiter votre demande d&apos;authentification. Veuillez réessayer ou
              contacter l&apos;assistance si le problème persiste.
            </p>
          </div>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/forgot-password">Réinitialiser mon mot de passe</Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Si vous continuez à rencontrer des problèmes, veuillez contacter notre support technique.
        </CardFooter>
      </Card>
    </div>
  );
} 