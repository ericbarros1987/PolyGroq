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
  Sparkles,
  Mic2,
  BookOpen,
  Award,
  Globe,
  Languages
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getLanguageByCode } from '@/data/languages';
import PremiumAvatar from '@/components/PremiumAvatar';

const LESSONS = [
  { id: '1', title: 'Apresentações', description: 'Aprenda a se apresentar', duration: 10, xpReward: 50, icon: '👋' },
  { id: '2', title: 'No Restaurante', description: 'Pedir comida e reservas', duration: 12, xpReward: 60, icon: '🍽️' },
  { id: '3', title: 'Direções', description: 'Perguntar e dar direções', duration: 10, xpReward: 50, icon: '🗺️' },
  { id: '4', title: 'Compras', description: 'Em lojas e mercados', duration: 15, xpReward: 75, icon: '🛍️' },
  { id: '5', title: 'Viagens', description: 'Aeroportos e hotéis', duration: 15, xpReward: 75, icon: '✈️' },
];

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  elementary: 'from-emerald-400 to-teal-500',
  intermediate: 'from-blue-400 to-cyan-500',
  upper_intermediate: 'from-purple-400 to-violet-500',
  advanced: 'from-orange-400 to-amber-500',
  fluent: 'from-pink-400 to-rose-500',
};

const LEVEL_EMOJIS: Record<string, string> = {
  beginner: '🌱',
  elementary: '📗',
  intermediate: '📘',
  upper_intermediate: '📙',
  advanced: '🏆',
  fluent: '👑',
};

const LEVEL_NAMES: Record<string, string> = {
  beginner: 'Iniciante',
  elementary: 'Elementar',
  intermediate: 'Intermediário',
  upper_intermediate: 'Upper Intermediário',
  advanced: 'Avançado',
  fluent: 'Fluente',
};

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

  const currentLanguage = getLanguageByCode(userProgress.current_language);
  const teacher = currentLanguage?.teachers[0];

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
              <p className="text-xs text-purple-300">Ferramenta de Poliglotismo</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <span className="text-xl">{currentLanguage?.flag || '🌐'}</span>
              <span className="text-sm font-medium">{currentLanguage?.name || 'Selecionar'}</span>
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
        
        {/* Language Dropdown */}
        {showLanguages && (
          <div className="absolute top-full left-0 right-0 bg-indigo-900 border-b border-white/10 p-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Mudar idioma</span>
              </div>
              <Link
                href="/languages"
                onClick={() => setShowLanguages(false)}
                className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
              >
                <Languages className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Escolher novo idioma</p>
                  <p className="text-purple-300 text-sm">Selecione outro idioma para aprender</p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400 ml-auto" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section with Teacher */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <PremiumAvatar 
              characterId={teacher?.id || 'alisha'}
              expression="happy"
              isSpeaking={false}
              size="lg"
              showName
              showTitle
            />
            <div className="flex-1 text-center md:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${LEVEL_COLORS[userProgress.level]} rounded-full border border-white/20 mb-2`}>
                <span className="text-xl">{LEVEL_EMOJIS[userProgress.level]}</span>
                <span className="text-white font-bold">{LEVEL_NAMES[userProgress.level]}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {userProgress.xp_points > 0 ? 'Continue sua jornada!' : 'Pronto para começar?'}
              </h2>
              <p className="text-purple-300">
                Aprendendo <span className="font-bold text-white">{currentLanguage?.name || 'Inglês'}</span> com {teacher?.name || 'seu tutor'}
              </p>
            </div>
          </div>
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Chat with Teacher */}
          <Link
            href="/chat"
            className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 shadow-xl shadow-cyan-500/30 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Conversar com Tutor</h3>
                <p className="text-cyan-100 text-sm">Pratique com {teacher?.name || 'seu professor'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-100 text-sm">
                <Mic className="w-4 h-4" />
                <span>Speech Recognition</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </Link>

          {/* Speaking Practice */}
          <Link
            href="/speaking"
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl shadow-green-500/30 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Mic2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Prática de Pronúncia</h3>
                <p className="text-green-100 text-sm">Melhore sua fala</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-100 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Feedback em tempo real</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        {/* Lessons */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            Lições do Dia
          </h3>
          <div className="grid gap-3">
            {LESSONS.map((lesson) => (
              <Link
                key={lesson.id}
                href="/chat"
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
                        <span>{lesson.duration} min</span>
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Vocabulary & Achievements */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/vocabulary"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">Vocabulário</h4>
                <p className="text-purple-300 text-sm">Suas palavras aprendidas</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          
          <Link
            href="/achievements"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">Conquistas</h4>
                <p className="text-purple-300 text-sm">Suas medalhas</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Immersion Mode */}
        {userProgress.level !== 'beginner' && (
          <button
            onClick={toggleImmersionMode}
            className={`w-full p-4 rounded-2xl border-2 transition-all ${
              userProgress.immersion_mode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className={`w-6 h-6 ${userProgress.immersion_mode ? 'text-white' : 'text-purple-400'}`} />
                <div className="text-left">
                  <p className={`font-bold ${userProgress.immersion_mode ? 'text-white' : 'text-white'}`}>
                    Modo Imersão
                  </p>
                  <p className={`text-sm ${userProgress.immersion_mode ? 'text-purple-200' : 'text-purple-300'}`}>
                    {userProgress.immersion_mode ? 'Ativado - Falando 100% em inglês' : 'Desativado - Com suporte em português'}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${
                userProgress.immersion_mode ? 'bg-white' : 'bg-white/30'
              }`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                  userProgress.immersion_mode 
                    ? 'translate-x-7 bg-purple-500' 
                    : 'translate-x-1 bg-white'
                }`} />
              </div>
            </div>
          </button>
        )}
      </main>
    </div>
  );
}
