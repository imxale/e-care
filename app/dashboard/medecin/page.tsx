'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function MedecinDashboardPage() {
  const router = useRouter();
  const { user, userRole, isLoading, signOut } = useAuth();

  useEffect(() => {
    // Vérifier l'authentification et le rôle
    if (!isLoading && (!user || userRole !== 'medecin')) {
      router.push('/login');
    }
  }, [user, userRole, isLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord Médecin</h1>
          <Button onClick={handleLogout} variant="outline">Déconnexion</Button>
        </div>
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <p className="text-green-800">
            Bienvenue, <span className="font-medium">{user?.email}</span>!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Votre rôle : <span className="font-medium">Médecin</span>
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Rendez-vous du jour</h2>
            <p className="text-gray-500 text-sm">Aucun rendez-vous programmé pour aujourd&apos;hui.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Mes patients</h2>
            <p className="text-gray-500 text-sm">Vous n&apos;avez pas encore de patients enregistrés.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Notifications</h2>
            <p className="text-gray-500 text-sm">Aucune notification à afficher.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 