'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function HomePage() {
  const router = useRouter();
  const { userProgress, loading } = useUserStore();

  useEffect(() => {
    if (!loading) {
      if (userProgress) {
        router.replace('/app');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [userProgress, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-3xl">P</span>
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        <p className="text-gray-500 mt-4">Carregando...</p>
      </div>
    </div>
  );
}
