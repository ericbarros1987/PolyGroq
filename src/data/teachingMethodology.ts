export type TeachingPhase = 
  | 'vocabulary'      // Fase 1: Ensinar palavras isoladas
  | 'phrases'         // Fase 2: Ensinar frases básicas
  | 'dialogues'       // Fase 3: Diálogos curtos
  | 'conversation'     // Fase 4: Conversação livre
  | 'mastery';       // Fase 5: Domínio do idioma

export interface TeachingStep {
  id: string;
  phase: TeachingPhase;
  order: number;
  instruction: string;           // O que o professor diz
  instructionNative: string;     // Versão em português
  expectedResponse?: string;     // O que o aluno deve responder
  vocabulary?: string[];        // Palavras novas
  grammarTip?: string;         // Dica gramatical
  correction?: {
    common: string;            // Erro comum
    correct: string;            // Correção
    explanation: string;       // Explicação
  };
  encouragement?: string;       // Incentivo
  nextPhase?: TeachingPhase;    // Próxima fase quando completar
}

export interface Lesson {
  id: string;
  title: string;
  titleNative: string;         // Título no idioma nativo
  description: string;
  language: string;
  targetPhase: TeachingPhase;
  steps: TeachingStep[];
  xpReward: number;
  estimatedMinutes: number;
}

export const LESSON_TEMPLATES: Record<string, Lesson[]> = {
  en: [
    // Lesson 1: Greetings (Vocabulary Phase)
    {
      id: 'en-greetings-1',
      title: 'Greetings - Hello & Goodbye',
      titleNative: 'Saudações - Olá e Adeus',
      description: 'Learn basic greetings',
      language: 'en',
      targetPhase: 'vocabulary',
      xpReward: 50,
      estimatedMinutes: 5,
      steps: [
        {
          id: 'en-g1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: 'Hello! Today we will learn our first words in English. Say "Hello" after me.',
          instructionNative: 'Olá! Hoje vamos aprender nossas primeiras palavras em inglês. Repita "Hello" depois de mim.',
          expectedResponse: 'hello',
          vocabulary: ['Hello', 'Hi', 'Hey'],
          grammarTip: 'In English, we use "Hello" in formal and informal situations.',
          encouragement: 'Excellent! "Hello" is the most common greeting in English.',
        },
        {
          id: 'en-g1-s2',
          phase: 'vocabulary',
          order: 2,
          instruction: 'Now let\'s learn "Goodbye". Say it after me.',
          instructionNative: 'Agora vamos aprender "Goodbye". Repita depois de mim.',
          expectedResponse: 'goodbye',
          vocabulary: ['Goodbye', 'Bye', 'See you later'],
          grammarTip: '"Bye" is informal, "Goodbye" is more formal.',
          encouragement: 'Perfect! You just learned two greetings!',
        },
        {
          id: 'en-g1-s3',
          phase: 'phrases',
          order: 3,
          instruction: 'Now let\'s put them together. Say "Hello, how are you?" after me.',
          instructionNative: 'Agora vamos juntar as palavras. Diga "Hello, how are you?" depois de mim.',
          expectedResponse: 'hello how are you',
          vocabulary: ['How are you?', 'I am fine'],
          grammarTip: 'In English, we ask "How are you?" as a greeting.',
          encouragement: 'Amazing! You can already greet someone in English!',
        },
      ],
    },
    // Lesson 2: Introductions
    {
      id: 'en-intro-1',
      title: 'Introductions - My name is...',
      titleNative: 'Apresentações - Meu nome é...',
      description: 'Learn to introduce yourself',
      language: 'en',
      targetPhase: 'phrases',
      xpReward: 75,
      estimatedMinutes: 8,
      steps: [
        {
          id: 'en-i1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: 'Let\'s learn how to say your name. "My name is..." followed by your name.',
          instructionNative: 'Vamos aprender como dizer seu nome. "My name is..." seguido do seu nome.',
          expectedResponse: 'my name is',
          vocabulary: ['My name is', 'I am', 'Call me'],
          grammarTip: '"My name is" is the most common way to introduce yourself.',
          encouragement: 'Great! Now you can tell people your name!',
        },
        {
          id: 'en-i1-s2',
          phase: 'phrases',
          order: 2,
          instruction: 'Try saying: "Hello, my name is [your name]. Nice to meet you."',
          instructionNative: 'Tente dizer: "Hello, my name is [seu nome]. Nice to meet you."',
          expectedResponse: 'nice to meet you',
          vocabulary: ['Nice to meet you', 'Pleased to meet you', 'How do you do'],
          grammarTip: '"Nice to meet you" is used when meeting someone for the first time.',
        },
        {
          id: 'en-i1-s3',
          phase: 'dialogues',
          order: 3,
          instruction: 'Now let\'s practice a dialogue. I will be Person A, you be Person B.',
          instructionNative: 'Agora vamos praticar um diálogo. Eu serei a Pessoa A, você será a Pessoa B.',
          expectedResponse: 'hello',
          vocabulary: ['Person A', 'Person B'],
          grammarTip: 'Practice this dialogue until it feels natural.',
          encouragement: 'Fantastic! You can introduce yourself in English now!',
        },
      ],
    },
  ],
  es: [
    // Lesson 1: Saludos
    {
      id: 'es-saludos-1',
      title: 'Saludos - Hola y Adiós',
      titleNative: 'Saudações - Olá e Adeus',
      description: 'Aprende saludos básicos',
      language: 'es',
      targetPhase: 'vocabulary',
      xpReward: 50,
      estimatedMinutes: 5,
      steps: [
        {
          id: 'es-s1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: '¡Hola! Hoy aprenderemos nuestras primeras palabras en español. Repite "Hola" después de mí.',
          instructionNative: 'Olá! Hoje vamos aprender nossas primeiras palavras em espanhol. Repita "Hola" depois de mim.',
          expectedResponse: 'hola',
          vocabulary: ['Hola', 'Buenos días', 'Buenas tardes', 'Buenas noches'],
          grammarTip: '"Hola" se puede usar en cualquier momento del día.',
          encouragement: '¡Excelente! "Hola" es el saludo más común en español.',
        },
        {
          id: 'es-s1-s2',
          phase: 'vocabulary',
          order: 2,
          instruction: 'Ahora aprendamos "Adiós". Repite después de mí.',
          instructionNative: 'Agora vamos aprender "Adiós". Repita depois de mim.',
          expectedResponse: 'adies',
          vocabulary: ['Adiós', 'Hasta luego', 'Nos vemos'],
          grammarTip: '"Hasta luego" significa "See you later" y es muy común.',
          encouragement: '¡Perfecto! Has aprendido dos saludos.',
        },
        {
          id: 'es-s1-s3',
          phase: 'phrases',
          order: 3,
          instruction: 'Ahora digamos: "Hola, ¿cómo estás?"',
          instructionNative: 'Agora vamos dizer: "Hola, ¿cómo estás?"',
          expectedResponse: 'como estas',
          vocabulary: ['¿Cómo estás?', '¿Cómo te va?', 'Bien, gracias'],
          grammarTip: 'En español, usamos "¿Cómo estás?" para preguntar cómo está alguien.',
          encouragement: '¡Increíble! Ya sabes saludar en español.',
        },
      ],
    },
  ],
  fr: [
    // Lesson 1: Salutations
    {
      id: 'fr-salutations-1',
      title: 'Salutations - Bonjour et Au revoir',
      titleNative: 'Saudações - Olá e Adeus',
      description: 'Apprenez les salutations de base',
      language: 'fr',
      targetPhase: 'vocabulary',
      xpReward: 50,
      estimatedMinutes: 5,
      steps: [
        {
          id: 'fr-sal1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: 'Bonjour! Aujourd\'hui, nous allons apprendre nos premiers mots en français. Répétez "Bonjour" après moi.',
          instructionNative: 'Olá! Hoje vamos aprender nossas primeiras palavras em francês. Repita "Bonjour" depois de mim.',
          expectedResponse: 'bonjour',
          vocabulary: ['Bonjour', 'Bonsoir', 'Salut'],
          grammarTip: '"Bonjour" est utilisé le jour, "Bonsoir" le soir.',
          encouragement: 'Excellent! "Bonjour" est la salutation la plus courante en français.',
        },
        {
          id: 'fr-sal1-s2',
          phase: 'vocabulary',
          order: 2,
          instruction: 'Maintenant, apprenons "Au revoir". Répétez après moi.',
          instructionNative: 'Agora vamos aprender "Au revoir". Repita depois de mim.',
          expectedResponse: 'au revoir',
          vocabulary: ['Au revoir', 'À bientôt', 'Salut'],
          grammarTip: '"Salut" est informel, "Au revoir" est formel.',
          encouragement: 'Parfait! Vous avez appris deux salutations!',
        },
      ],
    },
  ],
  de: [
    // Lesson 1: Begrüßungen
    {
      id: 'de-begrüssung-1',
      title: 'Begrüßungen - Hallo und Auf Wiedersehen',
      titleNative: 'Saudações - Olá e Adeus',
      description: 'Lerne grundlegende Begrüßungen',
      language: 'de',
      targetPhase: 'vocabulary',
      xpReward: 50,
      estimatedMinutes: 5,
      steps: [
        {
          id: 'de-b1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: 'Hallo! Heute lernen wir unsere ersten Wörter auf Deutsch. Wiederholen Sie "Hallo" nach mir.',
          instructionNative: 'Olá! Hoje vamos aprender nossas primeiras palavras em alemão. Repita "Hallo" depois de mim.',
          expectedResponse: 'hallo',
          vocabulary: ['Hallo', 'Guten Morgen', 'Guten Tag', 'Guten Abend'],
          grammarTip: '"Hallo" ist informell, "Guten Tag" ist formell.',
          encouragement: 'Ausgezeichnet! "Hallo" ist die häufigste Begrüßung in Deutsch.',
        },
        {
          id: 'de-b1-s2',
          phase: 'vocabulary',
          order: 2,
          instruction: 'Jetzt lernen wir "Auf Wiedersehen". Wiederholen Sie nach mir.',
          instructionNative: 'Agora vamos aprender "Auf Wiedersehen". Repita depois de mim.',
          expectedResponse: 'auf wiedersehen',
          vocabulary: ['Auf Wiedersehen', 'Tschüss', 'Bis später'],
          grammarTip: '"Tschüss" ist informell, "Auf Wiedersehen" ist formell.',
          encouragement: 'Perfekt! Sie haben zwei Begrüßungen gelernt!',
        },
      ],
    },
  ],
  ja: [
    // Lesson 1: 挨拶 (AISATSU)
    {
      id: 'ja-greetings-1',
      title: '挨拶 - こんにちはとさようなら',
      titleNative: 'Saudações - Olá e Adeus',
      description: 'Learn basic Japanese greetings',
      language: 'ja',
      targetPhase: 'vocabulary',
      xpReward: 50,
      estimatedMinutes: 5,
      steps: [
        {
          id: 'ja-g1-s1',
          phase: 'vocabulary',
          order: 1,
          instruction: 'こんにちは! 오늘 우리는 일본어로 처음 단어를 배울 것입니다.「こんにちは」の後、我紧随其后。',
          instructionNative: 'Olá! Hoje vamos aprender nossas primeiras palavras em japonês. Repita "Konnichiwa" depois de mim.',
          expectedResponse: 'konnichiwa',
          vocabulary: ['こんにちは (Konnichiwa)', 'おはよう (Ohayou)', 'こんばんは (Konbanwa)'],
          grammarTip: 'こんにちはは昼間の挨拶です。',
          encouragement: '素晴らしい! こんにちはは日本の最も一般的な挨拶です。',
        },
        {
          id: 'ja-g1-s2',
          phase: 'vocabulary',
          order: 2,
          instruction: 'では、「さようなら」を学びましょう。繰り返しなさい。',
          instructionNative: 'Agora vamos aprender "Sayounara". Repita depois de mim.',
          expectedResponse: 'sayounara',
          vocabulary: ['さようなら (Sayounara)', 'またね (Matane)', '失礼します (Shitsurei shimasu)'],
          grammarTip: 'さようならは正式別れの挨拶です。',
          encouragement: '完璧! あなたは既に日本語で挨拶ができます!',
        },
      ],
    },
  ],
};

export function getLessonsByLanguage(languageCode: string): Lesson[] {
  return LESSON_TEMPLATES[languageCode] || LESSON_TEMPLATES['en'] || [];
}

export function getLessonById(languageCode: string, lessonId: string): Lesson | undefined {
  const lessons = getLessonsByLanguage(languageCode);
  return lessons.find(l => l.id === lessonId);
}

export function getTeachingProgress(
  level: string,
  currentPhase: TeachingPhase
): { nativeRatio: number; targetRatio: number; description: string } {
  switch (currentPhase) {
    case 'vocabulary':
      return { nativeRatio: 0.9, targetRatio: 0.1, description: 'Fase 1: Aprendendo palavras' };
    case 'phrases':
      return { nativeRatio: 0.7, targetRatio: 0.3, description: 'Fase 2: Formando frases' };
    case 'dialogues':
      return { nativeRatio: 0.5, targetRatio: 0.5, description: 'Fase 3: Diálogos curtos' };
    case 'conversation':
      return { nativeRatio: 0.2, targetRatio: 0.8, description: 'Fase 4: Conversação' };
    case 'mastery':
      return { nativeRatio: 0, targetRatio: 1.0, description: 'Fase 5: Domínio total' };
    default:
      return { nativeRatio: 1.0, targetRatio: 0, description: 'Começando...' };
  }
}
