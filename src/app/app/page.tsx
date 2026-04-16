'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Trophy, 
  Settings, 
  Plus, 
  ChevronRight,
  Globe,
  Zap,
  Flame,
  BookOpen,
  Volume2
} from 'lucide-react';
import { ProgressCard, LessonCard } from '@/components/ProgressCard';
import { useUserStore } from '@/store/userStore';

const LESSONS = [
  { id: '1', title: 'Apresentações', description: 'Aprenda a se apresentar e conhecer pessoas', duration: 10, xpReward: 50 },
  { id: '2', title: 'No Restaurante', description: 'Pedir comida e fazer reservas', duration: 12, xpReward: 60 },
  { id: '3', title: 'Direções', description: 'Como perguntar e dar direções', duration: 10, xpReward: 50 },
  { id: '4', title: 'Compras', description: 'Em lojas e mercados', duration: 15, xpReward: 75 },
  { id: '5', title: 'Viagens', description: 'Aeroportos, hotéis e transporte', duration: 15, xpReward: 75 },
];

export default function AppPage() {
  const router = useRouter();
  const { userProgress, toggleImmersionMode } = useUserStore();
  const [showLanguages, setShowLanguages] = useState(false);

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const languageFlags: Record<string, string> = {
    en: '🇬🇧',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    it: '🇮🇹',
    ja: '🇯🇵',
    pt: '🇧🇷',
    zh: '🇨🇳',
    ko: '🇰🇷',
  };

  const languageNames: Record<string, string> = {
    en: 'Inglês',
    es: 'Espanhol',
    fr: 'Francês',
    de: 'Alemão',
    it: 'Italiano',
    ja: 'Japonês',
    pt: 'Português',
    zh: 'Mandarim',
    ko: 'Coreano',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">PolyGrok</h1>
              <p className="text-xs text-gray-500">Professor IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">{languageFlags[userProgress.current_language]}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </Link>
          </div>
        </div>

        {showLanguages && (
          <div className="absolute left-4 right-4 top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-20">
            <p className="text-sm text-gray-500 mb-3">Selecione o idioma de aprendizado</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(languageFlags).map(([code, flag]) => (
                <button
                  key={code}
                  onClick={() => {
                    useUserStore.getState().setLanguage(code as any);
                    setShowLanguages(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    userProgress.current_language === code
                      ? 'bg-primary-100 dark:bg-primary-900/30'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{flag}</span>
                  <span className="font-medium">{languageNames[code]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Olá! 👋
            </h2>
            <p className="text-gray-500">
              Pronto para praticar {languageNames[userProgress.current_language]} hoje?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold">{userProgress.streak_days} dias</span>
          </div>
        </div>

        <ProgressCard />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lições do Dia
          </h3>
          <span className="text-sm text-gray-500">10-15 min cada</span>
        </div>

        <div className="grid gap-4">
          {LESSONS.map((lesson) => (
            <LessonCard
              key={lesson.id}
              {...lesson}
              completed={userProgress.completed_topics?.includes(lesson.id) || false}
              onClick={() => router.push(`/chat?lesson=${lesson.id}`)}
            />
          ))}
        </div>

        <Link
          href="/chat"
          className="flex items-center justify-center gap-3 w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          Conversa Livre
        </Link>

        {userProgress.level !== 'beginner' && (
          <button
            onClick={toggleImmersionMode}
            className={`w-full flex items-center justify-center gap-3 py-4 font-semibold rounded-xl transition-colors ${
              userProgress.immersion_mode
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
            }`}
          >
            <Volume2 className="w-6 h-6" />
            {userProgress.immersion_mode ? 'Sair do Modo Imersão' : 'Ativar Modo Imersão'}
          </button>
        )}

        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8" />
            <h3 className="text-xl font-bold">Dica do Dia</h3>
          </div>
          <p className="text-white/90">
            Pratique por pelo menos 10 minutos todos os dias para construir o hábito. 
            A consistência é mais importante que a intensidade!
          </p>
        </div>
      </main>
    </div>
  );
}
