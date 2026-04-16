import { create } from 'zustand';
import type { UserProgress, Language, LanguageLevel, ChatMessage, ConversationContext } from '@/types';

interface UserStore {
  userProgress: UserProgress | null;
  loading: boolean;
  setUserProgress: (progress: UserProgress | null) => void;
  setLoading: (loading: boolean) => void;
  updateStreak: () => void;
  addXP: (amount: number) => void;
  setLanguage: (language: Language) => void;
  setLevel: (level: LanguageLevel) => void;
  toggleImmersionMode: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userProgress: null,
  loading: true,

  setUserProgress: (progress) => set({ userProgress: progress }),
  setLoading: (loading) => set({ loading }),

  updateStreak: () => {
    const { userProgress } = get();
    if (!userProgress) return;

    const today = new Date().toDateString();
    const lastLesson = userProgress.last_lesson_date
      ? new Date(userProgress.last_lesson_date).toDateString()
      : null;

    let newStreak = userProgress.streak_days;
    if (!lastLesson || lastLesson !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLesson === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastLesson !== today) {
        newStreak = 1;
      }
    }

    set({
      userProgress: {
        ...userProgress,
        streak_days: newStreak,
        last_lesson_date: new Date().toISOString(),
      },
    });
  },

  addXP: (amount) => {
    const { userProgress } = get();
    if (!userProgress) return;

    const newXP = userProgress.xp_points + amount;
    let newLevel = userProgress.level;

    const levelThresholds: Record<LanguageLevel, number> = {
      beginner: 0,
      elementary: 500,
      intermediate: 1500,
      upper_intermediate: 3000,
      advanced: 5000,
      fluent: 8000,
    };

    const levels: LanguageLevel[] = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'];
    for (let i = levels.length - 1; i >= 0; i--) {
      if (newXP >= levelThresholds[levels[i]]) {
        newLevel = levels[i];
        break;
      }
    }

    set({
      userProgress: {
        ...userProgress,
        xp_points: newXP,
        level: newLevel,
      },
    });
  },

  setLanguage: (language) => {
    const { userProgress } = get();
    if (!userProgress) return;
    set({ userProgress: { ...userProgress, current_language: language } });
  },

  setLevel: (level) => {
    const { userProgress } = get();
    if (!userProgress) return;
    set({ userProgress: { ...userProgress, level } });
  },

  toggleImmersionMode: () => {
    const { userProgress } = get();
    if (!userProgress) return;
    set({
      userProgress: {
        ...userProgress,
        immersion_mode: !userProgress.immersion_mode,
      },
    });
  },
}));

interface ChatStore {
  messages: ChatMessage[];
  isRecording: boolean;
  isProcessing: boolean;
  conversationContext: ConversationContext;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setContext: (context: Partial<ConversationContext>) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isRecording: false,
  isProcessing: false,
  conversationContext: {
    difficulty: 'beginner',
    immersionMode: false,
    lastErrors: [],
  },

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearMessages: () => set({ messages: [] }),

  setRecording: (recording) => set({ isRecording: recording }),

  setProcessing: (processing) => set({ isProcessing: processing }),

  setContext: (context) =>
    set((state) => ({
      conversationContext: { ...state.conversationContext, ...context },
    })),
}));
