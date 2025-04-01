'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, userRole, isLoading, signOut } = useAuth();

  useEffect(() => {
    // Vérifier l'authentification et le rôle
    if (!isLoading && (!user || userRole !== 'admin')) {
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
          <h1 className="text-2xl font-bold">Tableau de bord Administrateur</h1>
          <Button onClick={handleLogout} variant="outline">Déconnexion</Button>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <p className="text-purple-800">
            Bienvenue, <span className="font-medium">{user?.email}</span>!
          </p>
          <p className="text-purple-700 text-sm mt-1">
            Votre rôle : <span className="font-medium">Administrateur</span>
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Gestion des utilisateurs</h2>
            <p className="text-gray-500 text-sm">Aucun utilisateur enregistré pour le moment.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Statistiques</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Patients</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Médecins</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Rendez-vous</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Journaux d&apos;activité</h2>
            <p className="text-gray-500 text-sm">Aucune activité enregistrée.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 