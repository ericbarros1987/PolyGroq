export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  difficulty: 'easy' | 'medium' | 'hard';
  teachers: TeacherProfile[];
  availableLevels: LanguageLevel[];
  learningObjectives: string[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  title: string;
  accent: string;
  personality: string;
  bio: string;
  specialties: string[];
  languages: string[];
  avatarStyle: 'professional' | 'casual' | 'academic';
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

export type LanguageLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'fluent';

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    region: 'United States / United Kingdom',
    difficulty: 'medium',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'],
    learningObjectives: [
      'Conversational fluency',
      'Business English',
      'Academic writing',
      'Pronunciation mastery',
      'Cultural understanding'
    ],
    teachers: [
      {
        id: 'alisha',
        name: 'Alisha',
        title: 'Conversational Coach',
        accent: 'American',
        personality: 'Friendly, motivating, Stanford grad',
        bio: 'Masters in Applied Linguistics. 8+ years teaching conversational English to non-native speakers.',
        specialties: ['Conversational fluency', 'Pronunciation', 'American culture'],
        languages: ['en', 'pt'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#8B5CF6', secondary: '#A78BFA', background: 'from-violet-500 to-purple-600' }
      },
      {
        id: 'james',
        name: 'James',
        title: 'Business English Expert',
        accent: 'British',
        personality: 'Professional, articulate, corporate background',
        bio: 'Former Fortune 500 executive. Specializes in professional communication and business vocabulary.',
        specialties: ['Business English', 'Presentations', 'Negotiations', 'Formal writing'],
        languages: ['en', 'de'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#1E40AF', secondary: '#3B82F6', background: 'from-blue-600 to-blue-700' }
      },
      {
        id: 'emma',
        name: 'Emma',
        title: 'IELTS/TOEFL Specialist',
        accent: 'British',
        personality: 'Patient, methodical, results-oriented',
        bio: 'Certified IELTS examiner with 95% student success rate. Expert in exam strategies.',
        specialties: ['Exam preparation', 'Academic English', 'Test strategies', 'Writing correction'],
        languages: ['en', 'zh'],
        avatarStyle: 'academic',
        colorScheme: { primary: '#047857', secondary: '#10B981', background: 'from-emerald-600 to-teal-600' }
      }
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'Spain / Latin America',
    difficulty: 'easy',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'],
    learningObjectives: [
      'Conversational Spanish',
      'Latin American culture',
      'Business Spanish',
      'Travel communication'
    ],
    teachers: [
      {
        id: 'carlos',
        name: 'Carlos',
        title: 'Native Spanish Coach',
        accent: 'Madrid',
        personality: 'Warm, passionate about language',
        bio: 'Madrid native with experience teaching students from 40+ countries. Makes learning fun and natural.',
        specialties: ['Conversational fluency', 'Castilian accent', 'Cultural immersion'],
        languages: ['es', 'en', 'pt'],
        avatarStyle: 'casual',
        colorScheme: { primary: '#DC2626', secondary: '#EF4444', background: 'from-red-600 to-orange-600' }
      },
      {
        id: 'valentina',
        name: 'Valentina',
        title: 'Latin American Specialist',
        accent: 'Colombian',
        personality: 'Friendly, clear, encouraging',
        bio: 'Born in Bogotá. Specializes in neutral Latin American Spanish for international communication.',
        specialties: ['Neutral Spanish', 'Latin American culture', 'Pronunciation clarity'],
        languages: ['es', 'en'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#7C3AED', secondary: '#A855F7', background: 'from-purple-600 to-pink-600' }
      }
    ]
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'France',
    difficulty: 'medium',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'],
    learningObjectives: [
      'French conversation',
      'French culture and art',
      'Business French',
      'Academic French'
    ],
    teachers: [
      {
        id: 'marie',
        name: 'Marie',
        title: 'Native French Teacher',
        accent: 'Parisian',
        personality: 'Elegant, precise, cultured',
        bio: 'Parisian with PhD in French Literature. Teaches the beauty and nuance of the French language.',
        specialties: ['Grammar precision', 'French culture', 'Literature appreciation', 'Parisian accent'],
        languages: ['fr', 'en'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#2563EB', secondary: '#60A5FA', background: 'from-blue-500 to-indigo-600' }
      }
    ]
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Germany',
    difficulty: 'hard',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'],
    learningObjectives: [
      'German grammar mastery',
      'Technical German',
      'Business German',
      'Academic German'
    ],
    teachers: [
      {
        id: 'klaus',
        name: 'Klaus',
        title: 'German Master',
        accent: 'Bavarian',
        personality: 'Methodical, thorough, patient',
        bio: 'Munich native. 12 years teaching German to international students and executives.',
        specialties: ['Grammar mastery', 'Technical vocabulary', 'Business German', 'Pronunciation'],
        languages: ['de', 'en'],
        avatarStyle: 'academic',
        colorScheme: { primary: '#991B1B', secondary: '#B91C1C', background: 'from-red-700 to-red-800' }
      }
    ]
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    region: 'Italy',
    difficulty: 'medium',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'],
    learningObjectives: [
      'Conversational Italian',
      'Italian cuisine culture',
      'Travel Italian',
      'Opera and art appreciation'
    ],
    teachers: [
      {
        id: 'giulia',
        name: 'Giulia',
        title: 'Native Italian Coach',
        accent: 'Tuscan',
        personality: 'Vibrant, passionate, artistic',
        bio: 'Florence native. Connects language learning with Italian art, food, and passion for life.',
        specialties: ['Conversational fluency', 'Italian culture', 'Pronunciation', 'Food vocabulary'],
        languages: ['it', 'en', 'es'],
        avatarStyle: 'casual',
        colorScheme: { primary: '#16A34A', secondary: '#22C55E', background: 'from-green-600 to-emerald-600' }
      }
    ]
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: 'Japan',
    difficulty: 'hard',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'],
    learningObjectives: [
      'Hiragana & Katakana',
      'Basic conversation',
      'JLPT preparation',
      'Japanese culture'
    ],
    teachers: [
      {
        id: 'yuki',
        name: 'Yuki',
        title: 'Japanese Language Expert',
        accent: 'Tokyo',
        personality: 'Methodical, respectful, detailed',
        bio: 'Tokyo native with teaching certification. Specializes in making Japanese accessible to beginners.',
        specialties: ['Writing systems', 'Politeness levels', 'Cultural context', 'JLPT prep'],
        languages: ['ja', 'en'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#BE185D', secondary: '#EC4899', background: 'from-pink-600 to-rose-600' }
      }
    ]
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: 'South Korea',
    difficulty: 'hard',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate'],
    learningObjectives: [
      'Hangul mastery',
      'K-drama Korean',
      'K-pop vocabulary',
      'Business Korean'
    ],
    teachers: [
      {
        id: 'jimin',
        name: 'Ji-Min',
        title: 'Korean Culture Coach',
        accent: 'Seoul',
        personality: 'Energetic, pop-culture savvy, encouraging',
        bio: 'Seoul native. Makes learning Korean fun through K-pop, dramas, and modern culture.',
        specialties: ['Modern Korean', 'K-culture vocabulary', 'Casual speech', 'Pronunciation'],
        languages: ['ko', 'en'],
        avatarStyle: 'casual',
        colorScheme: { primary: '#0891B2', secondary: '#06B6D4', background: 'from-cyan-600 to-blue-600' }
      }
    ]
  },
  {
    code: 'zh',
    name: 'Mandarin Chinese',
    nativeName: '普通话',
    flag: '🇨🇳',
    region: 'China',
    difficulty: 'hard',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate'],
    learningObjectives: [
      'Pinyin mastery',
      'Basic Hanzi',
      'Business Chinese',
      'Cultural understanding'
    ],
    teachers: [
      {
        id: 'wei',
        name: 'Wei',
        title: 'Mandarin Specialist',
        accent: 'Beijing',
        personality: 'Calm, systematic, culturally rich',
        bio: 'Beijing native with 10+ years teaching Mandarin. Expert in making tones and characters approachable.',
        specialties: ['Tone practice', 'Character writing', 'Business Chinese', 'Cultural context'],
        languages: ['zh', 'en'],
        avatarStyle: 'professional',
        colorScheme: { primary: '#CA8A04', secondary: '#EAB308', background: 'from-yellow-500 to-amber-600' }
      }
    ]
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    region: 'Brazil',
    difficulty: 'easy',
    availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced'],
    learningObjectives: [
      'Brazilian Portuguese',
      'Conversational fluency',
      'Brazilian culture',
      'Travel communication'
    ],
    teachers: [
      {
        id: 'fernanda',
        name: 'Fernanda',
        title: 'Brazilian Portuguese Coach',
        accent: 'Paulista',
        personality: 'Warm, musical, patient',
        bio: 'São Paulo native. Makes learning Brazilian Portuguese fun with music, culture, and real conversations.',
        specialties: ['Conversational fluency', 'Brazilian music', 'Slang and casual speech', 'Cultural immersion'],
        languages: ['pt', 'en', 'es'],
        avatarStyle: 'casual',
        colorScheme: { primary: '#059669', secondary: '#10B981', background: 'from-green-500 to-teal-600' }
      }
    ]
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    region: 'Russia',
    difficulty: 'hard',
    availableLevels: ['beginner', 'elementary', 'intermediate'],
    learningObjectives: [
      'Cyrillic mastery',
      'Basic conversation',
      'Russian literature',
      'Cultural understanding'
    ],
    teachers: [
      {
        id: 'natasha',
        name: 'Natasha',
        title: 'Russian Language Expert',
        accent: 'Moscow',
        personality: 'Determined, precise, encouraging',
        bio: 'Moscow native with linguistics degree. Helps students conquer the challenges of Russian.',
        specialties: ['Cyrillic writing', 'Grammar structure', 'Pronunciation', 'Cultural context'],
        languages: ['ru', 'en'],
        avatarStyle: 'academic',
        colorScheme: { primary: '#7C3AED', secondary: '#8B5CF6', background: 'from-violet-600 to-purple-700' }
      }
    ]
  }
];

export const LEVEL_CONFIG: Record<LanguageLevel, {
  cefr: string;
  namePt: string;
  nameEn: string;
  description: string;
  targetLanguageRatio: number;
}> = {
  beginner: {
    cefr: 'A1-A2',
    namePt: 'Iniciante',
    nameEn: 'Beginner',
    description: 'Professor explica em seu idioma nativo. Vocabulário básico e frases simples.',
    targetLanguageRatio: 0.1,
  },
  elementary: {
    cefr: 'A2-B1',
    namePt: 'Elementar',
    nameEn: 'Elementary',
    description: 'Mistura de nativo e idioma-alvo. Gramática básica e conversação simples.',
    targetLanguageRatio: 0.3,
  },
  intermediate: {
    cefr: 'B1-B2',
    namePt: 'Intermediário',
    nameEn: 'Intermediate',
    description: 'Maioria no idioma-alvo. Tópicos do dia a dia e situações práticas.',
    targetLanguageRatio: 0.5,
  },
  upper_intermediate: {
    cefr: 'B2-C1',
    namePt: 'Upper-Intermediário',
    nameEn: 'Upper-Intermediate',
    description: 'Quase imersão completa. Discussões complexas e nuances culturais.',
    targetLanguageRatio: 0.75,
  },
  advanced: {
    cefr: 'C1',
    namePt: 'Avançado',
    nameEn: 'Advanced',
    description: 'Imersão total com suporte mínimo. Nível acadêmico e profissional.',
    targetLanguageRatio: 0.9,
  },
  fluent: {
    cefr: 'C2',
    namePt: 'Fluente',
    nameEn: 'Fluent',
    description: 'Domínio completo. Como um falante nativo educado.',
    targetLanguageRatio: 1.0,
  }
};

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find(l => l.code === code);
}

export function getTeacherById(teacherId: string): TeacherProfile | undefined {
  for (const lang of LANGUAGES) {
    const teacher = lang.teachers.find(t => t.id === teacherId);
    if (teacher) return teacher;
  }
  return undefined;
}
