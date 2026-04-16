import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { UserProgress, Language, LanguageLevel, ChatMessage, ConversationContext, ConversationMemory, VocabularyItem, ConversationFeedback } from '@/types';

interface UserStore {
  userProgress: UserProgress | null;
  loading: boolean;
  conversationMemory: ConversationMemory;
  currentConversation: {
    messages: ChatMessage[];
    startTime: Date | null;
    topic: string | null;
    scenario: string | null;
    correctCount: number;
    errorCount: number;
    newVocabulary: VocabularyItem[];
    errors: string[];
  };
  setUserProgress: (progress: UserProgress | null) => void;
  setLoading: (loading: boolean) => void;
  updateStreak: () => void;
  addXP: (amount: number) => void;
  setLanguage: (language: Language) => void;
  setLevel: (level: LanguageLevel) => void;
  toggleImmersionMode: () => void;
  saveProgress: (progress: Partial<UserProgress>) => Promise<void>;
  
  // Memory functions
  trackError: (error: string, correction: string) => void;
  trackMasteredExpression: (expression: string) => void;
  updateConversationMemory: (memory: Partial<ConversationMemory>) => void;
  
  // Conversation functions
  startConversation: (topic?: string, scenario?: string) => void;
  addConversationMessage: (message: ChatMessage) => void;
  endConversation: () => ConversationFeedback;
}

const initialMemory: ConversationMemory = {
  recentTopics: [],
  masteredExpressions: [],
  strugglingWith: [],
  totalConversations: 0,
  averageAccuracy: 0,
};

export const useUserStore = create<UserStore>((set, get) => ({
  userProgress: null,
  loading: true,
  conversationMemory: initialMemory,
  currentConversation: {
    messages: [],
    startTime: null,
    topic: null,
    scenario: null,
    correctCount: 0,
    errorCount: 0,
    newVocabulary: [],
    errors: [],
  },

  setUserProgress: (progress) => set({ 
    userProgress: progress,
    conversationMemory: progress?.conversation_memory || initialMemory
  }),
  setLoading: (loading) => set({ loading }),

  saveProgress: async (progress) => {
    const { userProgress, conversationMemory } = get();
    if (!userProgress) return;

    const userId = localStorage.getItem('poly_grok_user_id');
    if (!userId) return;

    try {
      const fullProgress = {
        ...progress,
        user_id: userId,
        updated_at: new Date().toISOString(),
        conversation_memory: conversationMemory,
      };
      
      await supabase
        .from('user_progress')
        .upsert(fullProgress)
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  updateStreak: () => {
    const { userProgress, saveProgress } = get();
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

    const newProgress = {
      ...userProgress,
      streak_days: newStreak,
      last_lesson_date: new Date().toISOString(),
    };

    set({ userProgress: newProgress });
    saveProgress({ streak_days: newStreak, last_lesson_date: newProgress.last_lesson_date });
  },

  addXP: (amount) => {
    const { userProgress, saveProgress, currentConversation } = get();
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

    const newProgress = {
      ...userProgress,
      xp_points: newXP,
      level: newLevel,
    };

    set({ userProgress: newProgress });
    saveProgress({ xp_points: newXP, level: newLevel });
  },

  setLanguage: (language) => {
    const { userProgress, saveProgress } = get();
    if (!userProgress) return;
    const newProgress = { ...userProgress, current_language: language };
    set({ userProgress: newProgress });
    saveProgress({ current_language: language });
  },

  setLevel: (level) => {
    const { userProgress, saveProgress } = get();
    if (!userProgress) return;
    const newProgress = { ...userProgress, level };
    set({ userProgress: newProgress });
    saveProgress({ level });
  },

  toggleImmersionMode: () => {
    const { userProgress, saveProgress } = get();
    if (!userProgress) return;
    const newProgress = { ...userProgress, immersion_mode: !userProgress.immersion_mode };
    set({ userProgress: newProgress });
    saveProgress({ immersion_mode: newProgress.immersion_mode });
  },

  trackError: (error: string, correction: string) => {
    const { userProgress, conversationMemory, currentConversation } = get();
    
    if (!userProgress) return;

    const errorsFrequency = { ...(userProgress.errors_frequency || {}) };
    const errorKey = `${error} -> ${correction}`;
    errorsFrequency[errorKey] = (errorsFrequency[errorKey] || 0) + 1;

    const strugglingWith = [...(userProgress.areas_to_improve || [])];
    if (!strugglingWith.includes(error)) {
      strugglingWith.push(error);
    }

    const newProgress = {
      ...userProgress,
      errors_frequency: errorsFrequency,
      areas_to_improve: strugglingWith.slice(-10),
    };

    const newCurrentConversation = {
      ...currentConversation,
      errorCount: currentConversation.errorCount + 1,
      errors: [...currentConversation.errors, error],
    };

    set({ 
      userProgress: newProgress,
      currentConversation: newCurrentConversation,
    });
    
    get().saveProgress({ errors_frequency: errorsFrequency, areas_to_improve: strugglingWith.slice(-10) });
  },

  trackMasteredExpression: (expression: string) => {
    const { userProgress, conversationMemory } = get();
    
    if (!userProgress) return;

    const masteredExpressions = [...(userProgress.conversation_memory?.masteredExpressions || [])];
    if (!masteredExpressions.includes(expression)) {
      masteredExpressions.push(expression);
    }

    const newMemory = {
      ...conversationMemory,
      masteredExpressions: masteredExpressions.slice(-50),
    };

    set({ 
      conversationMemory: newMemory,
    });
  },

  updateConversationMemory: (memory: Partial<ConversationMemory>) => {
    const { conversationMemory } = get();
    const newMemory = { ...conversationMemory, ...memory };
    set({ conversationMemory: newMemory });
  },

  startConversation: (topic?: string, scenario?: string) => {
    set({
      currentConversation: {
        messages: [],
        startTime: new Date(),
        topic: topic || null,
        scenario: scenario || null,
        correctCount: 0,
        errorCount: 0,
        newVocabulary: [],
        errors: [],
      },
    });
  },

  addConversationMessage: (message: ChatMessage) => {
    const { currentConversation } = get();
    
    let newCorrectCount = currentConversation.correctCount;
    let newVocabulary = [...currentConversation.newVocabulary];
    
    if (message.vocabulary && message.vocabulary.length > 0) {
      newVocabulary = [...newVocabulary, ...message.vocabulary];
    }
    
    if (message.correction) {
      newCorrectCount = currentConversation.correctCount;
    } else if (message.role === 'user') {
      newCorrectCount = currentConversation.correctCount + 1;
    }

    set({
      currentConversation: {
        ...currentConversation,
        messages: [...currentConversation.messages, message],
        correctCount: newCorrectCount,
        newVocabulary: newVocabulary,
      },
    });
  },

  endConversation: (): ConversationFeedback => {
    const { currentConversation, conversationMemory, userProgress } = get();
    
    const totalAttempts = currentConversation.correctCount + currentConversation.errorCount;
    const accuracy = totalAttempts > 0 ? (currentConversation.correctCount / totalAttempts) * 100 : 0;
    
    const grammarErrors = currentConversation.errors.filter(e => 
      e.includes('grammar') || e.includes('verb') || e.includes('tense')
    );
    const vocabularyErrors = currentConversation.errors.filter(e =>
      e.includes('word') || e.includes('vocabulary') || e.includes('meaning')
    );
    const pronunciationErrors = currentConversation.errors.filter(e =>
      e.includes('pronounce') || e.includes('sound') || e.includes('accent')
    );

    const strengths: string[] = [];
    if (accuracy >= 80) strengths.push('Excelente fluência!');
    if (currentConversation.correctCount >= 5) strengths.push('Boa comunicação geral');
    if (grammarErrors.length < vocabularyErrors.length) strengths.push('Boa gramática');

    const areasToImprove: string[] = [];
    if (grammarErrors.length > 0) areasToImprove.push('Foque nos tempos verbais');
    if (vocabularyErrors.length > 0) areasToImprove.push('Amplie seu vocabulário');
    if (pronunciationErrors.length > 0) areasToImprove.push('Pratique a pronúncia');

    const encouragement = accuracy >= 80 
      ? 'Você está pronto para o próximo nível! Continue assim! 🚀'
      : accuracy >= 60 
        ? 'Bom progresso! Continue praticando para melhorar ainda mais! 💪'
        : 'Cada tentativa é um passo para a fluência. Não desista! 🌟';

    const newMemory: ConversationMemory = {
      ...conversationMemory,
      recentTopics: [
        currentConversation.topic || 'General Practice',
        ...conversationMemory.recentTopics.filter(t => t !== currentConversation.topic)
      ].slice(0, 10),
      lastConversationDate: new Date().toISOString(),
      totalConversations: conversationMemory.totalConversations + 1,
      averageAccuracy: (conversationMemory.averageAccuracy + accuracy) / 2,
    };

    set({
      conversationMemory: newMemory,
      currentConversation: {
        messages: [],
        startTime: null,
        topic: null,
        scenario: null,
        correctCount: 0,
        errorCount: 0,
        newVocabulary: [],
        errors: [],
      },
    });

    return {
      summary: `Você praticou ${currentConversation.messages.length} mensagens com ${Math.round(accuracy)}% de precisão.`,
      strengths,
      areasToImprove,
      newVocabulary: currentConversation.newVocabulary,
      grammarFocus: [...new Set(grammarErrors)],
      pronunciationTips: [...new Set(pronunciationErrors)],
      encouragement,
      accuracy,
    };
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

export const useChatStore = create<ChatStore>((set) => ({
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
