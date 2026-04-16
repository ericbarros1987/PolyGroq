'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MessageCircle, 
  Trophy, 
  Settings, 
  ChevronRight,
  Zap,
  Flame,
  Target,
  Mic,
  Headphones,
  Star,
  Play,
  Volume2,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  Mic2
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const LESSONS = [
  { id: '1', title: 'Apresentações', description: 'Aprenda a se apresentar', duration: 10, xpReward: 50, icon: '👋' },
  { id: '2', title: 'No Restaurante', description: 'Pedir comida e reservas', duration: 12, xpReward: 60, icon: '🍽️' },
  { id: '3', title: 'Direções', description: 'Perguntar e dar direções', duration: 10, xpReward: 50, icon: '🗺️' },
  { id: '4', title: 'Compras', description: 'Em lojas e mercados', duration: 15, xpReward: 75, icon: '🛍️' },
  { id: '5', title: 'Viagens', description: 'Aeroportos e hotéis', duration: 15, xpReward: 75, icon: '✈️' },
];

export default function AppPage() {
  const { userProgress, toggleImmersionMode } = useUserStore();
  const [showLanguages, setShowLanguages] = useState(false);

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
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

  const levelColors: Record<string, string> = {
    beginner: 'from-green-400 to-emerald-500',
    elementary: 'from-emerald-400 to-teal-500',
    intermediate: 'from-blue-400 to-cyan-500',
    upper_intermediate: 'from-purple-400 to-violet-500',
    advanced: 'from-orange-400 to-amber-500',
    fluent: 'from-pink-400 to-rose-500',
  };

  const levelEmojis: Record<string, string> = {
    beginner: '🌱',
    elementary: '📗',
    intermediate: '📘',
    upper_intermediate: '📙',
    advanced: '🏆',
    fluent: '👑',
  };

  const levelNames: Record<string, string> = {
    beginner: 'Iniciante',
    elementary: 'Elementar',
    intermediate: 'Intermediário',
    upper_intermediate: 'Upper Intermediário',
    advanced: 'Avançado',
    fluent: 'Fluente',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-white">PolyGrok</h1>
              <p className="text-xs text-purple-300">Professor IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <span className="text-xl">{languageFlags[userProgress.current_language]}</span>
              <span className="text-sm font-medium">{languageNames[userProgress.current_language]}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showLanguages ? 'rotate-90' : ''}`} />
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          {/* Level Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${levelColors[userProgress.level]} rounded-full border border-white/20 mb-4 shadow-lg`}>
            <span className="text-2xl">{levelEmojis[userProgress.level]}</span>
            <div className="text-left">
              <p className="text-xs text-white/80">Seu Nível</p>
              <p className="text-lg font-bold text-white">{levelNames[userProgress.level]}</p>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {userProgress.xp_points > 0 ? 'Continue sua jornada!' : 'Pronto para começar?'}
          </h2>
          <p className="text-purple-300">Mantenha sua streak viva! 🔥</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 text-center shadow-lg shadow-orange-500/30">
            <Flame className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{userProgress.streak_days}</p>
            <p className="text-xs text-orange-100">Dias</p>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-center shadow-lg shadow-amber-500/30">
            <Zap className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{userProgress.xp_points}</p>
            <p className="text-xs text-amber-100">XP Total</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/30">
            <Target className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{userProgress.total_lessons}</p>
            <p className="text-xs text-emerald-100">Lições</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${levelColors[userProgress.level]} p-0.5`}>
                <div className="w-full h-full bg-indigo-900 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <p className="text-purple-300 text-sm">Nível Atual</p>
                <p className="text-xl font-bold text-white capitalize">{userProgress.level.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{userProgress.xp_points}</p>
              <p className="text-xs text-purple-300">XP</p>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${levelColors[userProgress.level]} transition-all duration-500`}
              style={{ width: `${Math.min(100, (userProgress.xp_points % 500) / 5)}%` }}
            />
          </div>
          <p className="text-center text-sm text-purple-300 mt-2">Progresso para próximo nível</p>
        </div>

        {/* Quick Practice Button */}
        <Link
          href="/assessment"
          className="block w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-size-200 hover:bg-pos-100 transition-all duration-500 rounded-3xl p-1 shadow-2xl shadow-purple-500/30"
        >
          <div className="bg-indigo-900 rounded-[22px] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Mic2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Avaliação de Nível</h3>
                <p className="text-purple-300">Descubra seu nível em 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <Play className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Iniciar</span>
            </div>
          </div>
        </Link>

        {/* Free Practice */}
        <Link
          href="/chat"
          className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-1 shadow-xl shadow-cyan-500/30"
        >
          <div className="bg-indigo-900 rounded-[22px] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Conversa Livre</h3>
                <p className="text-cyan-300">Pratique com a IA</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Chat</span>
            </div>
          </div>
        </Link>

        {/* Lessons */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Lições do Dia
          </h3>
          <div className="grid gap-3">
            {LESSONS.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => window.location.href = `/chat?lesson=${lesson.id}`}
                className="w-full text-left bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{lesson.title}</h4>
                    <p className="text-purple-300 text-sm">{lesson.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-amber-400 font-bold">+{lesson.xpReward} XP</p>
                      <p className="text-purple-300 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {lesson.duration} min
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Immersion Mode */}
        {userProgress.level !== 'beginner' && (
          <button
            onClick={toggleImmersionMode}
            className={`w-full rounded-3xl p-1 shadow-xl transition-all ${
              userProgress.immersion_mode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <div className={`rounded-[22px] px-6 py-5 flex items-center justify-between ${
              userProgress.immersion_mode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-indigo-900'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  userProgress.immersion_mode ? 'bg-white/20' : 'bg-purple-500/30'
                }`}>
                  <Volume2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">Modo Imersão</h4>
                  <p className="text-purple-200 text-sm">
                    {userProgress.immersion_mode ? 'Ativado - IA só fala em inglês!' : 'Desativado'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-xl font-medium ${
                userProgress.immersion_mode ? 'bg-white/20 text-white' : 'bg-white/10 text-purple-200'
              }`}>
                {userProgress.immersion_mode ? 'Ativo' : 'Ativar'}
              </div>
            </div>
          </button>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl p-6 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Dica do Dia</h4>
              <p className="text-amber-100">
                Pratique por pelo menos 10 minutos todos os dias. A consistência é mais importante que a intensidade! 🚀
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
