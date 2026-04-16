'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, Volume2, Bell, Moon, ChevronRight, Trash2, Check, Languages, GraduationCap } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const LANGUAGES = [
  { code: 'en', name: 'Inglês', flag: '🇬🇧', native: 'English' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'Francês', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'Alemão', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', native: 'Português' },
  { code: 'ja', name: 'Japonês', flag: '🇯🇵', native: '日本語' },
  { code: 'zh', name: 'Mandarim', flag: '🇨🇳', native: '中文' },
  { code: 'ko', name: 'Coreano', flag: '🇰🇷', native: '한국어' },
];

const LEVELS = [
  { code: 'beginner', name: 'Iniciante', cefr: 'A1-A2', emoji: '🌱', color: 'from-green-400 to-emerald-500', description: 'Você está começando do zero' },
  { code: 'elementary', name: 'Elementar', cefr: 'A2-B1', emoji: '📗', color: 'from-emerald-400 to-teal-500', description: 'Você conhece o básico' },
  { code: 'intermediate', name: 'Intermediário', cefr: 'B1-B2', emoji: '📘', color: 'from-blue-400 to-cyan-500', description: 'Você consegue se expressar' },
  { code: 'upper_intermediate', name: 'Upper-Intermediário', cefr: 'B2-C1', emoji: '📙', color: 'from-purple-400 to-violet-500', description: 'Você fala com confiança' },
  { code: 'advanced', name: 'Avançado', cefr: 'C1', emoji: '🏆', color: 'from-orange-400 to-amber-500', description: 'Quase fluente' },
  { code: 'fluent', name: 'Fluente', cefr: 'C2', emoji: '👑', color: 'from-pink-400 to-rose-500', description: 'Fluência completa' },
];

export default function SettingsPage() {
  const { userProgress, setLanguage, setLevel, toggleImmersionMode, saveProgress } = useUserStore();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentLanguage = LANGUAGES.find(l => l.code === userProgress.current_language);
  const currentLevel = LEVELS.find(l => l.code === userProgress.level);

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode as any);
    setShowLanguageModal(false);
  };

  const handleLevelChange = async (levelCode: string) => {
    await setLevel(levelCode as any);
    setShowLevelModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/app"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold">P</span>
            </div>
            <div>
              <h1 className="font-bold text-white">Configurações</h1>
              <p className="text-xs text-purple-300">Personalize seu aprendizado</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Language Selection */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <div className="px-4 py-3 bg-white/5">
            <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Idioma de Aprendizado
            </h2>
          </div>
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLanguage?.flag}</span>
              <div className="text-left">
                <p className="font-medium text-white">{currentLanguage?.name}</p>
                <p className="text-sm text-purple-300">{currentLanguage?.native}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400" />
          </button>
        </section>

        {/* Level Selection */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <div className="px-4 py-3 bg-white/5">
            <h2 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Seu Nível
            </h2>
          </div>
          <button
            onClick={() => setShowLevelModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLevel?.emoji}</span>
              <div className="text-left">
                <p className="font-medium text-white">{currentLevel?.name}</p>
                <p className="text-sm text-purple-300">CEFR {currentLevel?.cefr}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400" />
          </button>
        </section>

        {/* Experience Settings */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <div className="px-4 py-3 bg-white/5">
            <h2 className="text-sm font-semibold text-purple-300">Experiência</h2>
          </div>
          
          <button
            onClick={toggleImmersionMode}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userProgress.immersion_mode ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-white/10'}`}>
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Modo Imersão</p>
                <p className="text-sm text-purple-300">Professor fala só no idioma alvo</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              userProgress.immersion_mode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white/10 text-purple-300'
            }`}>
              {userProgress.immersion_mode ? 'Ativo' : 'Inativo'}
            </div>
          </button>
        </section>

        {/* Notifications */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
          <div className="px-4 py-3 bg-white/5">
            <h2 className="text-sm font-semibold text-purple-300">Notificações</h2>
          </div>
          
          <button
            onClick={() => setNotifications(!notifications)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <p className="font-medium text-white">Lembretes Diários</p>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors relative ${notifications ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications ? 'left-6' : 'left-1'}`} />
            </div>
          </button>
        </section>

        {/* Stats */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-purple-300 mb-4">Seu Progresso</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{userProgress.xp_points}</p>
              <p className="text-xs text-purple-300">XP Total</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{userProgress.streak_days}</p>
              <p className="text-xs text-purple-300">Dias de Streak</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{userProgress.total_lessons}</p>
              <p className="text-xs text-purple-300">Lições</p>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-red-500/20">
          <button
            onClick={() => {
              if (confirm('Tem certeza? Todo seu progresso será apagado.')) {
                localStorage.removeItem('poly_grok_user_id');
                window.location.href = '/onboarding';
              }
            }}
            className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span>Apagar Todo Progresso</span>
          </button>
        </section>

        <div className="text-center py-4">
          <p className="text-purple-300 text-sm">PolyGrok v1.0.0</p>
          <p className="text-purple-400/50 text-xs mt-1">Aprenda idiomas com IA</p>
        </div>
      </main>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowLanguageModal(false)}>
          <div 
            className="bg-gray-900 rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white">Escolha o Idioma</h3>
              <button onClick={() => setShowLanguageModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <span className="text-white">✕</span>
              </button>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto max-h-[60vh]">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    lang.code === userProgress.current_language
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-white">{lang.name}</p>
                    <p className="text-sm text-purple-300">{lang.native}</p>
                  </div>
                  {lang.code === userProgress.current_language && (
                    <Check className="w-6 h-6 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Level Modal */}
      {showLevelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowLevelModal(false)}>
          <div 
            className="bg-gray-900 rounded-t-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-white">Escolha seu Nível</h3>
              <button onClick={() => setShowLevelModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <span className="text-white">✕</span>
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
              {LEVELS.map(lvl => (
                <button
                  key={lvl.code}
                  onClick={() => handleLevelChange(lvl.code)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    lvl.code === userProgress.level
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lvl.color} flex items-center justify-center text-2xl`}>
                    {lvl.emoji}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-white">{lvl.name}</p>
                    <p className="text-sm text-purple-300">CEFR {lvl.cefr}</p>
                    <p className="text-xs text-purple-400/70 mt-1">{lvl.description}</p>
                  </div>
                  {lvl.code === userProgress.level && (
                    <Check className="w-6 h-6 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
