'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useUserStore } from '@/store/userStore';
import type { Language, LanguageLevel } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { setLanguage, setLevel, setUserProgress } = useUserStore();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel>('beginner');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    setLanguage(selectedLanguage);
    setLevel(selectedLevel);

    const userId = localStorage.getItem('poly_grok_user_id');
    if (userId) {
      const { supabase } = await import('@/lib/supabase');
      await supabase
        .from('user_progress')
        .update({
          current_language: selectedLanguage,
          level: selectedLevel,
        })
        .eq('user_id', userId);
    }

    setTimeout(() => {
      router.push('/app');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <header className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="font-bold text-xl">PolyGrok</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          selectedLevel={selectedLevel}
          onLanguageChange={setSelectedLanguage}
          onLevelChange={setSelectedLevel}
        />
      </main>

      <footer className="p-6">
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Preparando...' : 'Começar a Aprender'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Você pode mudar essas configurações depois nas configurações.
        </p>
      </footer>
    </div>
  );
}
