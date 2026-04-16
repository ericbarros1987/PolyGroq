export interface AvatarCharacter {
  id: string;
  name: string;
  title: string;
  accent: string;
  personality: string;
  hairColor: string;
  eyeColor: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
  languageCode: string;
  nativeLanguage: boolean;
}

export const AVATAR_CHARACTERS: AvatarCharacter[] = [
  // English Teachers
  {
    id: 'alisha',
    name: 'Alisha',
    title: 'Conversational Coach',
    accent: 'American',
    personality: 'Friendly, motivating, Stanford grad',
    hairColor: '#4A3728',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#8B5CF6', secondary: '#A78BFA', background: 'from-violet-500 to-purple-600' },
    languageCode: 'en',
    nativeLanguage: true
  },
  {
    id: 'james',
    name: 'James',
    title: 'Business English Expert',
    accent: 'British',
    personality: 'Professional, articulate',
    hairColor: '#2C1810',
    eyeColor: '#2C1810',
    colorScheme: { primary: '#1E40AF', secondary: '#3B82F6', background: 'from-blue-600 to-blue-700' },
    languageCode: 'en',
    nativeLanguage: true
  },
  {
    id: 'emma',
    name: 'Emma',
    title: 'IELTS Specialist',
    accent: 'British',
    personality: 'Patient, methodical',
    hairColor: '#8B6914',
    eyeColor: '#2E5A1C',
    colorScheme: { primary: '#047857', secondary: '#10B981', background: 'from-emerald-600 to-teal-600' },
    languageCode: 'en',
    nativeLanguage: true
  },
  
  // Spanish Teachers
  {
    id: 'carlos',
    name: 'Carlos',
    title: 'Native Spanish Coach',
    accent: 'Madrid',
    personality: 'Warm, passionate',
    hairColor: '#1A1A1A',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#DC2626', secondary: '#EF4444', background: 'from-red-600 to-orange-600' },
    languageCode: 'es',
    nativeLanguage: true
  },
  {
    id: 'valentina',
    name: 'Valentina',
    title: 'Latin American Specialist',
    accent: 'Colombian',
    personality: 'Friendly, clear',
    hairColor: '#4A3728',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#7C3AED', secondary: '#A855F7', background: 'from-purple-600 to-pink-600' },
    languageCode: 'es',
    nativeLanguage: true
  },
  
  // French Teachers
  {
    id: 'marie',
    name: 'Marie',
    title: 'Native French Teacher',
    accent: 'Parisian',
    personality: 'Elegant, precise',
    hairColor: '#B8860B',
    eyeColor: '#4169E1',
    colorScheme: { primary: '#2563EB', secondary: '#60A5FA', background: 'from-blue-500 to-indigo-600' },
    languageCode: 'fr',
    nativeLanguage: true
  },
  
  // German Teachers
  {
    id: 'klaus',
    name: 'Klaus',
    title: 'German Master',
    accent: 'Bavarian',
    personality: 'Methodical, thorough',
    hairColor: '#C0C0C0',
    eyeColor: '#4169E1',
    colorScheme: { primary: '#991B1B', secondary: '#B91C1C', background: 'from-red-700 to-red-800' },
    languageCode: 'de',
    nativeLanguage: true
  },
  
  // Italian Teachers
  {
    id: 'giulia',
    name: 'Giulia',
    title: 'Native Italian Coach',
    accent: 'Tuscan',
    personality: 'Vibrant, artistic',
    hairColor: '#4A3728',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#16A34A', secondary: '#22C55E', background: 'from-green-600 to-emerald-600' },
    languageCode: 'it',
    nativeLanguage: true
  },
  
  // Japanese Teachers
  {
    id: 'yuki',
    name: 'Yuki',
    title: 'Japanese Language Expert',
    accent: 'Tokyo',
    personality: 'Methodical, respectful',
    hairColor: '#1A1A1A',
    eyeColor: '#1A1A1A',
    colorScheme: { primary: '#BE185D', secondary: '#EC4899', background: 'from-pink-600 to-rose-600' },
    languageCode: 'ja',
    nativeLanguage: true
  },
  
  // Korean Teachers
  {
    id: 'jimin',
    name: 'Ji-Min',
    title: 'Korean Culture Coach',
    accent: 'Seoul',
    personality: 'Energetic, encouraging',
    hairColor: '#1A1A1A',
    eyeColor: '#1A1A1A',
    colorScheme: { primary: '#0891B2', secondary: '#06B6D4', background: 'from-cyan-600 to-blue-600' },
    languageCode: 'ko',
    nativeLanguage: true
  },
  
  // Mandarin Teachers
  {
    id: 'wei',
    name: 'Wei',
    title: 'Mandarin Specialist',
    accent: 'Beijing',
    personality: 'Calm, systematic',
    hairColor: '#1A1A1A',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#CA8A04', secondary: '#EAB308', background: 'from-yellow-500 to-amber-600' },
    languageCode: 'zh',
    nativeLanguage: true
  },
  
  // Portuguese Teachers
  {
    id: 'fernanda',
    name: 'Fernanda',
    title: 'Brazilian Portuguese Coach',
    accent: 'Paulista',
    personality: 'Warm, musical',
    hairColor: '#4A3728',
    eyeColor: '#4A3728',
    colorScheme: { primary: '#059669', secondary: '#10B981', background: 'from-green-500 to-teal-600' },
    languageCode: 'pt',
    nativeLanguage: true
  },
  
  // Russian Teachers
  {
    id: 'natasha',
    name: 'Natasha',
    title: 'Russian Language Expert',
    accent: 'Moscow',
    personality: 'Determined, precise',
    hairColor: '#B8860B',
    eyeColor: '#4169E1',
    colorScheme: { primary: '#7C3AED', secondary: '#8B5CF6', background: 'from-violet-600 to-purple-700' },
    languageCode: 'ru',
    nativeLanguage: true
  }
];

export function getAvatarsByLanguage(languageCode: string): AvatarCharacter[] {
  return AVATAR_CHARACTERS.filter(a => a.languageCode === languageCode);
}

export function getAvatarById(id: string): AvatarCharacter | undefined {
  return AVATAR_CHARACTERS.find(a => a.id === id);
}
