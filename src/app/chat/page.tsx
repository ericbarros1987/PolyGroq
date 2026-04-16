'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import ProfessorAI from '@/components/ProfessorAI';

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  elementary: 'from-emerald-400 to-teal-500',
  intermediate: 'from-blue-400 to-cyan-500',
  upper_intermediate: 'from-purple-400 to-violet-500',
  advanced: 'from-orange-400 to-amber-500',
  fluent: 'from-pink-400 to-rose-500',
};

export default function ChatPage() {
  const { userProgress, addXP } = useUserStore();

  const handleProgress = (data: { xp: number; correct: number; errors: string[] }) => {
    addXP(data.xp);
  };

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm">Aula com Professor</h1>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${LEVEL_COLORS[userProgress.level]} animate-pulse`} />
                  <span className="text-xs text-purple-300 capitalize">{userProgress.level.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userProgress.immersion_mode && (
              <div className="px-3 py-1 bg-purple-500/30 rounded-full border border-purple-500/50">
                <span className="text-xs text-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Imersão
                </span>
              </div>
            )}
            <div className="px-3 py-1 bg-amber-500/30 rounded-full border border-amber-500/50">
              <span className="text-xs text-amber-200 flex items-center gap-1">
                <Zap className="w-3 h-3" /> {userProgress.xp_points} XP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Professor AI Component */}
      <div className="flex-1 flex flex-col">
        <ProfessorAI
          level={userProgress.level}
          language={userProgress.current_language}
          onProgress={handleProgress}
        />
      </div>
    </div>
  );
}
