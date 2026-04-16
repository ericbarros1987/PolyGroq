'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Volume2, Bell, Moon, LogOut, ChevronRight, Trash2 } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export default function SettingsPage() {
  const { userProgress, setLanguage, setLevel, toggleImmersionMode } = useUserStore();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  if (!userProgress) return null;

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

  const handleResetProgress = () => {
    if (confirm('Tem certeza que deseja apagar todo o seu progresso? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('poly_grok_user_id');
      window.location.href = '/onboarding';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/app"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Configurações</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500 px-4 py-3 bg-gray-50 dark:bg-gray-900">
            Idioma
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <span>Idioma de Aprendizado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{languageNames[userProgress.current_language]}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500 px-4 py-3 bg-gray-50 dark:bg-gray-900">
            Nível
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span>Seu Nível Atual</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 capitalize">{userProgress.level.replace('_', ' ')}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500 px-4 py-3 bg-gray-50 dark:bg-gray-900">
            Experiência
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              onClick={toggleImmersionMode}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <span>Modo Imersão</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                userProgress.immersion_mode
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {userProgress.immersion_mode ? 'Ativo' : 'Inativo'}
              </div>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-500" />
                <span>Modo Escuro</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors ${darkMode ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform m-1 ${darkMode ? 'translate-x-5' : ''}`} />
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500 px-4 py-3 bg-gray-50 dark:bg-gray-900">
            Notificações
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <span>Lembretes Diários</span>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform m-1 ${notifications ? 'translate-x-5' : ''}`} />
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <h2 className="text-sm font-semibold text-gray-500 px-4 py-3 bg-gray-50 dark:bg-gray-900">
            Dados
          </h2>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <button
              onClick={handleResetProgress}
              className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Apagar Progresso</span>
            </button>
          </div>
        </section>

        <div className="text-center text-sm text-gray-500">
          <p>PolyGrok v1.0.0</p>
          <p className="mt-1">Desenvolvido com Next.js e OpenRouter</p>
        </div>
      </main>
    </div>
  );
}
