export interface UserProgress {
  user_id: string;
  current_language: string;
  level: LanguageLevel;
  streak_days: number;
  total_lessons: number;
  xp_points: number;
  immersion_mode: boolean;
  created_at: string;
  updated_at: string;
  last_lesson_date?: string;
  errors_frequency?: Record<string, number>;
  completed_topics?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: LanguageLevel;
  duration_minutes: number;
  topics: string[];
  xp_reward: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  correction?: Correction;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'style';
}

export type LanguageLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'fluent';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'pt' | 'zh' | 'ko';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  availableLevels: LanguageLevel[];
}

export interface ConversationContext {
  topic?: string;
  difficulty: LanguageLevel;
  immersionMode: boolean;
  lastErrors: string[];
}

export interface AIAudioResponse {
  text: string;
  audioUrl?: string;
  correction?: Correction;
  encouragement?: string;
}
