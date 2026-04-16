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
  conversation_memory?: ConversationMemory;
  strengths?: string[];
  areas_to_improve?: string[];
}

export interface ConversationMemory {
  recentTopics: string[];
  masteredExpressions: string[];
  strugglingWith: string[];
  lastConversationDate?: string;
  totalConversations: number;
  averageAccuracy: number;
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
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioUrl?: string;
  correction?: Correction;
  translation?: string;
  vocabulary?: VocabularyItem[];
  grammarTip?: string;
  encouragement?: string;
  scenarioContext?: ScenarioContext;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  example?: string;
  pronunciation?: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'pronunciation' | 'vocabulary' | 'style';
}

export interface ScenarioContext {
  id: string;
  name: string;
  description: string;
  location: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ConversationFeedback {
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  newVocabulary: VocabularyItem[];
  grammarFocus: string[];
  pronunciationTips: string[];
  encouragement: string;
  accuracy: number;
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
  scenario?: ScenarioContext;
}

export interface AIAudioResponse {
  text: string;
  audioUrl?: string;
  correction?: Correction;
  encouragement?: string;
}

export interface ProfessorPersonality {
  name: string;
  avatar: string;
  style: 'friendly' | 'professional' | 'playful' | 'strict';
  specialties: string[];
  nativeLanguage: string;
  teachingLanguages: string[];
}

export interface LevelConfig {
  cefr: string;
  namePt: string;
  nameEn: string;
  targetLanguageRatio: number;
  nativeLanguageRatio: number;
  description: string;
  keyFeatures: string[];
}

export const LEVEL_CONFIGS: Record<LanguageLevel, LevelConfig> = {
  beginner: {
    cefr: 'A1-A2',
    namePt: 'Iniciante',
    nameEn: 'Beginner',
    targetLanguageRatio: 0.1,
    nativeLanguageRatio: 0.9,
    description: 'Professor fala EM PORTUGUÊS e ensina palavras básicas em inglês.',
    keyFeatures: ['100% português nas explicações', 'Vocabulário essencial', 'Falas curtas e simples', 'Traduções sempre disponíveis']
  },
  elementary: {
    cefr: 'A2-B1',
    namePt: 'Elementar',
    nameEn: 'Elementary',
    targetLanguageRatio: 0.3,
    nativeLanguageRatio: 0.7,
    description: 'Mistura - professor explica em português mas usa mais inglês.',
    keyFeatures: ['70% português / 30% inglês', 'Frases simples', 'Gramática básica', 'Exemplos práticos']
  },
  intermediate: {
    cefr: 'B1-B2',
    namePt: 'Intermediário',
    nameEn: 'Intermediate',
    targetLanguageRatio: 0.5,
    nativeLanguageRatio: 0.5,
    description: 'Maioria em inglês, com traduções quando necessário.',
    keyFeatures: ['50% português / 50% inglês', 'Diálogos mais complexos', 'Expressões idiomáticas', 'Contexto cultural']
  },
  upper_intermediate: {
    cefr: 'B2-C1',
    namePt: 'Upper-Intermediário',
    nameEn: 'Upper-Intermediate',
    targetLanguageRatio: 0.75,
    nativeLanguageRatio: 0.25,
    description: 'Quase imersão - professor usa mais inglês.',
    keyFeatures: ['75% inglês / 25% português', 'Temas sofisticados', 'Nuances culturais', 'Fluência em desenvolvimento']
  },
  advanced: {
    cefr: 'C1',
    namePt: 'Avançado',
    nameEn: 'Advanced',
    targetLanguageRatio: 0.9,
    nativeLanguageRatio: 0.1,
    description: 'Quase imersão total - mínimo suporte em português.',
    keyFeatures: ['90% inglês / 10% português', 'Discussões complexas', 'Autocorreção', 'Precisão nativa']
  },
  fluent: {
    cefr: 'C2',
    namePt: 'Fluente',
    nameEn: 'Fluent',
    targetLanguageRatio: 1.0,
    nativeLanguageRatio: 0.0,
    description: 'Imersão total - conversamos 100% em inglês.',
    keyFeatures: ['100% inglês', 'Tópicos avançados', 'Sotaque e entonação', 'Nível nativo']
  }
};

export const SCENARIOS: ScenarioContext[] = [
  {
    id: 'cafe',
    name: 'Café & Restaurant',
    description: 'Order food and drinks, make reservations',
    location: 'Local Café',
    difficulty: 'easy'
  },
  {
    id: 'airport',
    name: 'Airport & Travel',
    description: 'Navigate airports, book flights, customs',
    location: 'International Airport',
    difficulty: 'medium'
  },
  {
    id: 'shopping',
    name: 'Shopping Mall',
    description: 'Buy clothes, negotiate prices, returns',
    location: 'Shopping Center',
    difficulty: 'easy'
  },
  {
    id: 'hotel',
    name: 'Hotel & Accommodation',
    description: 'Check-in, room service, complaints',
    location: 'Grand Hotel',
    difficulty: 'medium'
  },
  {
    id: 'business',
    name: 'Business Meeting',
    description: 'Presentations, negotiations, small talk',
    location: 'Corporate Office',
    difficulty: 'hard'
  },
  {
    id: 'medical',
    name: 'Medical Appointment',
    description: 'Explain symptoms, understand prescriptions',
    location: 'Medical Clinic',
    difficulty: 'medium'
  },
  {
    id: 'directions',
    name: 'Asking for Directions',
    description: 'Navigate cities, public transport',
    location: 'City Center',
    difficulty: 'easy'
  },
  {
    id: 'social',
    name: 'Social Gathering',
    description: 'Meet people, make friends, small talk',
    location: 'Community Event',
    difficulty: 'medium'
  }
];
