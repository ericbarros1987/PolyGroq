'use client';

import { Trophy, Flame, Zap, Star, Globe, Settings } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const LEVEL_THRESHOLDS = {
  beginner: 0,
  elementary: 500,
  intermediate: 1500,
  upper_intermediate: 3000,
  advanced: 5000,
  fluent: 8000,
};

const LEVEL_COLORS = {
  beginner: 'bg-green-500',
  elementary: 'bg-emerald-500',
  intermediate: 'bg-blue-500',
  upper_intermediate: 'bg-purple-500',
  advanced: 'bg-orange-500',
  fluent: 'bg-red-500',
};

const LANGUAGE_NAMES: Record<string, string> = {
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

export function ProgressCard() {
  const { userProgress } = useUserStore();

  if (!userProgress) return null;

  const currentLevelIndex = Object.keys(LEVEL_THRESHOLDS).indexOf(userProgress.level);
  const nextLevel = Object.keys(LEVEL_THRESHOLDS)[currentLevelIndex + 1];
  const currentThreshold = LEVEL_THRESHOLDS[userProgress.level as keyof typeof LEVEL_THRESHOLDS];
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel as keyof typeof LEVEL_THRESHOLDS] || userProgress.xp_points;
  const progressInLevel = userProgress.xp_points - currentThreshold;
  const levelRange = nextThreshold - currentThreshold;
  const progressPercent = Math.min(100, Math.round((progressInLevel / levelRange) * 100));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${LEVEL_COLORS[userProgress.level]} bg-opacity-20`}>
            <Trophy className={`w-6 h-6 ${LEVEL_COLORS[userProgress.level].replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Nível Atual</p>
            <p className="font-bold text-lg capitalize">{userProgress.level.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">XP Total</p>
          <p className="font-bold text-lg flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            {userProgress.xp_points.toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">
            {LANGUAGE_NAMES[userProgress.current_language] || userProgress.current_language}
          </span>
          <span className="text-gray-500">
            {nextLevel ? `${progressInLevel} / ${levelRange} XP` : 'Nível Máximo'}
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${LEVEL_COLORS[userProgress.level]}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-2xl font-bold">{userProgress.streak_days}</p>
            <p className="text-xs text-gray-500">Dias seguidos</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Star className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold">{userProgress.total_lessons}</p>
            <p className="text-xs text-gray-500">Lições</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  xpReward: number;
  completed: boolean;
  onClick: () => void;
}

export function LessonCard({ title, description, duration, xpReward, completed, onClick }: LessonCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
        completed
          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {completed && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            Concluído
          </span>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-gray-500">
          <Globe className="w-4 h-4" />
          {duration} min
        </span>
        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
          <Zap className="w-4 h-4" />
          +{xpReward} XP
        </span>
      </div>
    </button>
  );
}
