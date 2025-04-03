'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isEmailVerified, userRole } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      if (!isEmailVerified) {
        router.push('/verify-email');
      } else {
        router.push(`/dashboard/${userRole}`);
      }
    } else {
      router.push('/login');
    }
  }, [router, user, isLoading, isEmailVerified, userRole]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Chargement...</h1>
        <p className="text-gray-500">Redirection en cours</p>
        </div>
    </div>
  );
}
