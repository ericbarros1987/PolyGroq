'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Trophy, Star, Flame, Target, Zap,
  Clock, Award, TrendingUp, BookOpen, Mic, MessageCircle,
  Calendar, CheckCircle, Lock, Gift
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'streak' | 'lessons' | 'vocabulary' | 'speaking' | 'chat' | 'special';
  requirement: string;
}

export default function AchievementsPage() {
  const { userProgress, conversationMemory } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const achievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'streak-1',
      title: 'Primeiro Dia',
      description: 'Complete sua primeira lição',
      icon: <Flame className="w-6 h-6" />,
      xpReward: 50,
      unlocked: userProgress.streak_days >= 1,
      category: 'streak',
      requirement: '1 dia de streak',
    },
    {
      id: 'streak-7',
      title: 'Semana de Fogo',
      description: 'Mantenha uma streak de 7 dias',
      icon: <Flame className="w-6 h-6" />,
      xpReward: 200,
      unlocked: userProgress.streak_days >= 7,
      category: 'streak',
      requirement: '7 dias de streak',
    },
    {
      id: 'streak-30',
      title: 'Mês de Dedicação',
      description: 'Mantenha uma streak de 30 dias',
      icon: <Flame className="w-6 h-6" />,
      xpReward: 1000,
      unlocked: userProgress.streak_days >= 30,
      category: 'streak',
      requirement: '30 dias de streak',
    },
    {
      id: 'streak-100',
      title: 'Mestre da Disciplina',
      description: 'Mantenha uma streak de 100 dias',
      icon: <Trophy className="w-6 h-6" />,
      xpReward: 5000,
      unlocked: userProgress.streak_days >= 100,
      category: 'streak',
      requirement: '100 dias de streak',
    },
    
    // Lessons Achievements
    {
      id: 'lessons-1',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira lição',
      icon: <BookOpen className="w-6 h-6" />,
      xpReward: 50,
      unlocked: userProgress.total_lessons >= 1,
      category: 'lessons',
      requirement: '1 lição',
    },
    {
      id: 'lessons-10',
      title: 'Estudante Dedicado',
      description: 'Complete 10 lições',
      icon: <BookOpen className="w-6 h-6" />,
      xpReward: 200,
      unlocked: userProgress.total_lessons >= 10,
      category: 'lessons',
      requirement: '10 lições',
    },
    {
      id: 'lessons-50',
      title: 'Aprendiz Ávido',
      description: 'Complete 50 lições',
      icon: <Award className="w-6 h-6" />,
      xpReward: 500,
      unlocked: userProgress.total_lessons >= 50,
      category: 'lessons',
      requirement: '50 lições',
    },
    {
      id: 'lessons-100',
      title: 'Mestre do Conhecimento',
      description: 'Complete 100 lições',
      icon: <Trophy className="w-6 h-6" />,
      xpReward: 1000,
      unlocked: userProgress.total_lessons >= 100,
      category: 'lessons',
      requirement: '100 lições',
    },

    // XP Achievements
    {
      id: 'xp-100',
      title: 'Iniciante',
      description: 'Ganhe 100 XP',
      icon: <Zap className="w-6 h-6" />,
      xpReward: 25,
      unlocked: userProgress.xp_points >= 100,
      category: 'special',
      requirement: '100 XP',
    },
    {
      id: 'xp-1000',
      title: 'XP Collector',
      description: 'Ganhe 1000 XP',
      icon: <TrendingUp className="w-6 h-6" />,
      xpReward: 100,
      unlocked: userProgress.xp_points >= 1000,
      category: 'special',
      requirement: '1000 XP',
    },
    {
      id: 'xp-5000',
      title: 'Lenda do XP',
      description: 'Ganhe 5000 XP',
      icon: <Star className="w-6 h-6" />,
      xpReward: 500,
      unlocked: userProgress.xp_points >= 5000,
      category: 'special',
      requirement: '5000 XP',
    },

    // Speaking Achievements
    {
      id: 'speaking-1',
      title: 'Primeira Fala',
      description: 'Pratique pronúncia pela primeira vez',
      icon: <Mic className="w-6 h-6" />,
      xpReward: 50,
      unlocked: (conversationMemory?.totalConversations || 0) >= 1,
      category: 'speaking',
      requirement: '1 prática de fala',
    },
    {
      id: 'speaking-10',
      title: 'Voz Confiante',
      description: 'Pratique pronúncia 10 vezes',
      icon: <Mic className="w-6 h-6" />,
      xpReward: 200,
      unlocked: (conversationMemory?.totalConversations || 0) >= 10,
      category: 'speaking',
      requirement: '10 práticas de fala',
    },

    // Chat Achievements
    {
      id: 'chat-1',
      title: 'Conversador',
      description: 'Tenha sua primeira conversa',
      icon: <MessageCircle className="w-6 h-6" />,
      xpReward: 50,
      unlocked: (conversationMemory?.totalConversations || 0) >= 1,
      category: 'chat',
      requirement: '1 conversa',
    },
    {
      id: 'chat-50',
      title: 'Mestre da Conversa',
      description: 'Tenha 50 conversas',
      icon: <MessageCircle className="w-6 h-6" />,
      xpReward: 500,
      unlocked: (conversationMemory?.totalConversations || 0) >= 50,
      category: 'chat',
      requirement: '50 conversas',
    },

    // Vocabulary Achievements
    {
      id: 'vocab-mastered',
      title: 'Acumulador de Palavras',
      description: 'Aprenda 50 palavras novas',
      icon: <BookOpen className="w-6 h-6" />,
      xpReward: 200,
      unlocked: (conversationMemory?.masteredExpressions?.length || 0) >= 50,
      category: 'vocabulary',
      requirement: '50 palavras dominadas',
    },
  ];

  const categories = [
    { id: null, label: 'Todas', icon: <Trophy className="w-4 h-4" /> },
    { id: 'streak', label: 'Streaks', icon: <Flame className="w-4 h-4" /> },
    { id: 'lessons', label: 'Lições', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'speaking', label: 'Fala', icon: <Mic className="w-4 h-4" /> },
    { id: 'chat', label: 'Conversas', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'special', label: 'Especiais', icon: <Star className="w-4 h-4" /> },
  ];

  const filteredAchievements = selectedCategory 
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPFromAchievements = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white">Conquistas</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 mb-6 shadow-xl shadow-amber-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-amber-100 text-sm">Conquistas Desbloqueadas</p>
              <p className="text-4xl font-bold text-white">{unlockedCount}/{achievements.length}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white font-medium">+{totalXPFromAchievements} XP de conquistas</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id || 'all'}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              {cat.icon}
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-2xl p-4 border transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30'
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-white/10'
                }`}>
                  {achievement.unlocked ? (
                    <div className="text-white">
                      {achievement.icon}
                    </div>
                  ) : (
                    <Lock className="w-6 h-6 text-purple-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-purple-300'}`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-purple-200/70 text-sm">{achievement.description}</p>
                  <p className="text-purple-300/50 text-xs mt-1">Requisito: {achievement.requirement}</p>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    achievement.unlocked
                      ? 'bg-green-500/30 text-green-300'
                      : 'bg-white/10 text-purple-300'
                  }`}>
                    +{achievement.xpReward} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            Em Breve
          </h3>
          <div className="grid gap-3">
            {[
              { title: 'Bônus de Fim de Semana', desc: 'Ganhe XP extra aos sábados e domingos', locked: true },
              { title: 'Desafio Diário', desc: 'Complete tarefas diárias para bônus', locked: true },
              { title: 'Liga de Estudantes', desc: 'Compita com outros estudantes', locked: true },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-purple-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
