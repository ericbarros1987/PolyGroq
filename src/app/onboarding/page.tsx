'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Check, Flame, Target, Zap, GraduationCap, 
  Mic, Headphones, MessageCircle, Play, Volume2, Clock, TrendingUp, Award
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import PremiumAvatar from '@/components/PremiumAvatar';
import { getLanguageByCode, getTeacherById } from '@/data/languages';

const LEVEL_OPTIONS = [
  { id: 'beginner', label: 'Iniciante', description: 'Nunca estudei ou sei poucas palavras', color: 'from-green-400 to-emerald-500', icon: '🌱' },
  { id: 'elementary', label: 'Elementar', description: 'Sei frases básicas e simples', color: 'from-emerald-400 to-teal-500', icon: '📗' },
  { id: 'intermediate', label: 'Intermediário', description: 'Tenho conversas básicas', color: 'from-blue-400 to-cyan-500', icon: '📘' },
  { id: 'upper_intermediate', label: 'Upper-Intermediário', description: 'Falo com confiança em temas familiares', color: 'from-purple-400 to-violet-500', icon: '📙' },
  { id: 'advanced', label: 'Avançado', description: 'Falo bem, mas quero perfeição', color: 'from-orange-400 to-amber-500', icon: '🏆' },
  { id: 'fluent', label: 'Fluente', description: 'Quero manter e expandir meu nível', color: 'from-pink-400 to-rose-500', icon: '👑' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { userProgress, setLanguage, setLevel, setUserProgress } = useUserStore();
  const [selectedLevel, setSelectedLevel] = useState<string>(userProgress?.level || 'beginner');
  const [isLoading, setIsLoading] = useState(false);

  const languageCode = typeof window !== 'undefined' 
    ? localStorage.getItem('poly_grok_selected_language') || userProgress?.current_language || 'en'
    : 'en';
  
  const avatarId = typeof window !== 'undefined'
    ? localStorage.getItem('poly_grok_selected_avatar')
    : null;

  const language = getLanguageByCode(languageCode);
  const teacher = avatarId ? getTeacherById(avatarId) : language?.teachers[0];

  useEffect(() => {
    if (!languageCode || languageCode === 'en') {
      router.push('/languages');
    }
  }, [languageCode, router]);

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      setLanguage(languageCode as any);
      setLevel(selectedLevel as any);

      const userId = localStorage.getItem('poly_grok_user_id');
      if (userId) {
        const { supabase } = await import('@/lib/supabase');
        await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            current_language: languageCode,
            level: selectedLevel,
            streak_days: 0,
            total_lessons: 0,
            xp_points: 0,
            immersion_mode: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      }

      localStorage.removeItem('poly_grok_selected_language');
      localStorage.removeItem('poly_grok_selected_avatar');

      setTimeout(() => {
        router.push('/app');
      }, 500);
    } catch (error) {
      console.error('Error saving progress:', error);
      setIsLoading(false);
    }
  };

  if (!language) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/languages" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{language.flag}</span>
            <h1 className="font-bold text-white">Configuração</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Language & Teacher Preview */}
        <div className="bg-white/10 rounded-3xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <PremiumAvatar 
              characterId={teacher?.id || avatarId || language.teachers[0]?.id || 'alisha'}
              expression="happy"
              isSpeaking={false}
              size="lg"
              showName
              showTitle
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white mb-1">
                Aprendendo {language.name}
              </h2>
              <p className="text-purple-300 mb-2">{language.nativeName}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`px-3 py-1 bg-gradient-to-r ${teacher ? `from-purple-500 to-pink-500` : 'from-purple-500 to-pink-500'} rounded-full text-sm text-white`}>
                  {teacher?.name || language.teachers[0]?.name} - Seu Tutor
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-purple-200">
                  {teacher?.accent || 'Native'} accent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Qual é seu nível em {language.name}?
          </h3>
          
          <div className="space-y-3">
            {LEVEL_OPTIONS.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  selectedLevel === level.id
                    ? `bg-gradient-to-r ${level.color} border-white`
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{level.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-white text-lg">{level.label}</p>
                    <p className={`text-sm ${selectedLevel === level.id ? 'text-white/80' : 'text-purple-300'}`}>
                      {level.description}
                    </p>
                  </div>
                  {selectedLevel === level.id && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-purple-500" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white font-medium">Conversas</span>
            </div>
            <p className="text-purple-300 text-sm">Pratique com seu tutor nativo IA</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-500/30 rounded-full flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-white font-medium">Pronúncia</span>
            </div>
            <p className="text-purple-300 text-sm">Feedback em tempo real</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500/30 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-white font-medium">XP & Streaks</span>
            </div>
            <p className="text-purple-300 text-sm">Acompanhe seu progresso</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-white font-medium">CEFR</span>
            </div>
            <p className="text-purple-300 text-sm">Metodologia A1-C2</p>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleComplete}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Configurando...</span>
            </div>
          ) : (
            'Começar a Aprender'
          )}
        </button>

        {/* Change Language */}
        <button
          onClick={() => router.push('/languages')}
          className="w-full mt-4 text-purple-300 hover:text-purple-200 text-sm py-2"
        >
          Escolher outro idioma
        </button>
      </main>
    </div>
  );
}
