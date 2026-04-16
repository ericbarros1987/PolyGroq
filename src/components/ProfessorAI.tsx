'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, User, AlertCircle, Loader2, Volume2, BookOpen, 
  GraduationCap, Lightbulb, MapPin, Clock,
  Trophy, Target, TrendingUp, Sparkles, CheckCircle, Star, Mic, MicOff, Settings
} from 'lucide-react';
import useNaturalTTS from '@/hooks/useNaturalTTS';
import { useUserStore } from '@/store/userStore';
import PremiumAvatar from './PremiumAvatar';
import { conversationService } from '@/lib/conversationService';
import type { LanguageLevel, ChatMessage, VocabularyItem, ScenarioContext, ConversationFeedback } from '@/types';

const LEVEL_CONFIG: Record<LanguageLevel, {
  cefr: string;
  namePt: string;
  nameEn: string;
  targetLanguageRatio: number;
  nativeLanguageRatio: number;
  emoji: string;
  color: string;
}> = {
  beginner: {
    cefr: 'A1-A2',
    namePt: 'Iniciante',
    nameEn: 'Beginner',
    targetLanguageRatio: 0.1,
    nativeLanguageRatio: 0.9,
    emoji: '🌱',
    color: 'from-green-400 to-emerald-500',
  },
  elementary: {
    cefr: 'A2-B1',
    namePt: 'Elementar',
    nameEn: 'Elementary',
    targetLanguageRatio: 0.3,
    nativeLanguageRatio: 0.7,
    emoji: '📗',
    color: 'from-emerald-400 to-teal-500',
  },
  intermediate: {
    cefr: 'B1-B2',
    namePt: 'Intermediário',
    nameEn: 'Intermediate',
    targetLanguageRatio: 0.5,
    nativeLanguageRatio: 0.5,
    emoji: '📘',
    color: 'from-blue-400 to-cyan-500',
  },
  upper_intermediate: {
    cefr: 'B2-C1',
    namePt: 'Upper-Intermediário',
    nameEn: 'Upper-Intermediate',
    targetLanguageRatio: 0.75,
    nativeLanguageRatio: 0.25,
    emoji: '📙',
    color: 'from-purple-400 to-violet-500',
  },
  advanced: {
    cefr: 'C1',
    namePt: 'Avançado',
    nameEn: 'Advanced',
    targetLanguageRatio: 0.9,
    nativeLanguageRatio: 0.1,
    emoji: '🏆',
    color: 'from-orange-400 to-amber-500',
  },
  fluent: {
    cefr: 'C2',
    namePt: 'Fluente',
    nameEn: 'Fluent',
    targetLanguageRatio: 1.0,
    nativeLanguageRatio: 0.0,
    emoji: '👑',
    color: 'from-pink-400 to-rose-500',
  },
};

const SCENARIOS: ScenarioContext[] = [
  { id: 'cafe', name: 'Café & Restaurant', description: 'Order food and drinks', location: 'Local Café', difficulty: 'easy' },
  { id: 'airport', name: 'Airport & Travel', description: 'Navigate airports, flights', location: 'Airport', difficulty: 'medium' },
  { id: 'shopping', name: 'Shopping Mall', description: 'Buy clothes, prices', location: 'Shopping Center', difficulty: 'easy' },
  { id: 'hotel', name: 'Hotel & Accommodation', description: 'Check-in, room service', location: 'Grand Hotel', difficulty: 'medium' },
  { id: 'business', name: 'Business Meeting', description: 'Presentations, negotiations', location: 'Office', difficulty: 'hard' },
  { id: 'directions', name: 'Asking Directions', description: 'Navigate cities', location: 'City Center', difficulty: 'easy' },
  { id: 'social', name: 'Social Gathering', description: 'Meet people, small talk', location: 'Community Event', difficulty: 'medium' },
];

const GREETINGS: Record<string, Record<LanguageLevel, { main: string; translation?: string; vocabulary: VocabularyItem[] }>> = {
  en: {
    beginner: {
      main: 'Olá! Que bom ter você aqui! Eu sou o Poly, seu professor de inglês. 🌟 Vou falar em português e te ensinar palavras em inglês aos poucos. Vamos começar?',
      translation: 'Hello! Great to have you here! I am Poly, your English teacher.',
      vocabulary: [
        { word: 'Hello', translation: 'Olá', example: 'Hello! How are you?' },
        { word: 'Teacher', translation: 'Professor', example: 'You are my teacher.' },
        { word: 'Student', translation: 'Estudante', example: 'I am a student.' },
      ],
    },
    elementary: {
      main: 'Olá! Bem-vindo à sua aula de inglês! 🇬🇧 Vou ser seu professor e vamos aprender juntos, devagar e com calma. Vamos praticar palavras novas?',
      translation: 'Welcome to your English lesson! I will be your teacher.',
      vocabulary: [
        { word: 'Welcome', translation: 'Bem-vindo', example: 'Welcome to our class!' },
        { word: 'Lesson', translation: 'Lição', example: 'This is a great lesson.' },
      ],
    },
    intermediate: {
      main: "Hey! Ready for some English practice? Let's have a conversation and I'll help you improve!",
      vocabulary: [
        { word: 'Practice', translation: 'Prática', example: 'Practice makes perfect!' },
      ],
    },
    upper_intermediate: {
      main: "Welcome back! Today we'll engage in more sophisticated conversations. Let's challenge ourselves!",
      vocabulary: [],
    },
    advanced: {
      main: "Excellent to see your progress! Let's dive into an engaging conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Welcome to your advanced English session. Let's discuss complex topics with nuance.",
      vocabulary: [],
    },
  },
  es: {
    beginner: {
      main: '¡Hola! ¡Qué bueno tenerte aquí! Soy Poly, tu profesor de español. 🌟 Voy a hablar en portugués y enseñarte palabras en español poco a poco. ¿Empezamos?',
      translation: 'Hello! Great to have you here! I am Poly, your Spanish teacher.',
      vocabulary: [
        { word: 'Hola', translation: 'Olá', example: '¡Hola! ¿Cómo estás?' },
        { word: 'Profesor', translation: 'Professor', example: 'Soy tu profesor.' },
      ],
    },
    elementary: {
      main: '¡Hola! Bienvenido a tu clase de español. 🇪🇸 Voy a ser tu profesor y aprenderemos juntos, despacio y con calma. ¿Practicas palabras nuevas?',
      translation: 'Welcome to your Spanish lesson!',
      vocabulary: [
        { word: 'Bienvenido', translation: 'Bem-vindo', example: '¡Bienvenido a nuestra clase!' },
      ],
    },
    intermediate: {
      main: "¡Hola! ¿Listo para practicar español? Let's have a conversation and I'll help you improve!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "¡Bienvenido de nuevo! Today we'll engage in more sophisticated conversations in Spanish.",
      vocabulary: [],
    },
    advanced: {
      main: "Excelente verte progress! Let's dive into an engaging Spanish conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Bienvenido a tu sesión avanzada de español. Let's discuss complex topics with nuance.",
      vocabulary: [],
    },
  },
  fr: {
    beginner: {
      main: 'Bonjour! Je suis ravi de vous avoir ici! Je suis Poly, votre professeur de français. 🌟 Je vais parler en portugais et vous enseigner des mots en français. Commençons?',
      translation: 'Hello! I am Poly, your French teacher.',
      vocabulary: [
        { word: 'Bonjour', translation: 'Olá', example: 'Bonjour! Comment allez-vous?' },
        { word: 'Professeur', translation: 'Professor', example: 'Je suis votre professeur.' },
      ],
    },
    elementary: {
      main: 'Bonjour! Bienvenue à votre cours de français. 🇫🇷 Je serai votre professeur et nous apprendrons ensemble. Prêt à pratiquer?',
      translation: 'Welcome to your French lesson!',
      vocabulary: [
        { word: 'Bienvenue', translation: 'Bem-vindo', example: 'Bienvenue à notre cours!' },
      ],
    },
    intermediate: {
      main: "Bonjour! Ready for some French practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "Bon retour! Today we'll practice more sophisticated French conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "Excellent de vous voir! Let's dive into an engaging French conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Bienvenue à votre session de français avancée. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  de: {
    beginner: {
      main: 'Hallo! Ich freue mich, Sie hier zu haben! Ich bin Poly, Ihr Deutschlehrer. 🌟 Ich werde Portugiesisch sprechen und Ihnen Deutsch beibringen. Fangen wir an?',
      translation: 'Hello! I am Poly, your German teacher.',
      vocabulary: [
        { word: 'Hallo', translation: 'Olá', example: 'Hallo! Wie geht es Ihnen?' },
        { word: 'Lehrer', translation: 'Professor', example: 'Ich bin Ihr Lehrer.' },
      ],
    },
    elementary: {
      main: 'Hallo! Willkommen zu Ihrem Deutschkurs! 🇩🇪 Ich werde Ihr Lehrer sein. Bereit zum Üben?',
      translation: 'Welcome to your German lesson!',
      vocabulary: [
        { word: 'Willkommen', translation: 'Bem-vindo', example: 'Willkommen zu unserem Kurs!' },
      ],
    },
    intermediate: {
      main: "Hallo! Ready for some German practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "Willkommen zurück! Today we'll practice more sophisticated German conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "Ausgezeichnet Sie zu sehen! Let's dive into an engaging German conversation.",
      vocabulary: [],
    },
    fluent: {
      main: "Willkommen zu Ihrer fortgeschrittenenDeutschsprechstunde. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  pt: {
    beginner: {
      main: 'Olá! Que bom ter você aqui! Eu sou Poly, seu professor de português. 🇧🇷 Vou falar em português e te ensinar gramática e vocabulário. Vamos começar?',
      translation: 'Hello! Great to have you here! I am Poly, your Portuguese teacher.',
      vocabulary: [
        { word: 'Olá', translation: 'Hello', example: 'Olá! Como vai?' },
        { word: 'Professor', translation: 'Teacher', example: 'Sou seu professor.' },
      ],
    },
    elementary: {
      main: 'Olá! Bem-vindo à sua aula de português! 🇧🇷 Vou ser seu professor e vamos aprender juntos, devagar e com calma.',
      translation: 'Welcome to your Portuguese lesson!',
      vocabulary: [
        { word: 'Bem-vindo', translation: 'Welcome', example: 'Bem-vindo à nossa aula!' },
      ],
    },
    intermediate: {
      main: "Olá! Ready for some Portuguese practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "Bem-vindo de volta! Today we'll practice more sophisticated Portuguese conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "Excelente vê-lo! Let's dive into an engaging Portuguese conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Bem-vindo à sua sessão avançada de português. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  ja: {
    beginner: {
      main: 'こんにちは!来到这里我很高兴!我是Poly,你的日语老师。🌟 我会说葡萄牙语,慢慢教你日语。我们开始吧?',
      translation: 'Hello! I am Poly, your Japanese teacher.',
      vocabulary: [
        { word: 'こんにちは', translation: 'Olá', example: 'こんにちは！お元気ですか？' },
        { word: '先生', translation: 'Professor', example: '先生です。' },
      ],
    },
    elementary: {
      main: 'こんにちは!日本語レッスンへようこそ！🇯🇵 先生的日本語先生です。一緒に学びましょう！',
      translation: 'Welcome to your Japanese lesson!',
      vocabulary: [
        { word: 'ようこそ', translation: 'Welcome', example: 'ようこそ!' },
      ],
    },
    intermediate: {
      main: "こんにちは! Ready for some Japanese practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "おかえりなさい! Today we'll practice more sophisticated Japanese conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "素晴らしい! Let's dive into an engaging Japanese conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "高度な日本語の会話をしましょう. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  ko: {
    beginner: {
      main: '안녕하세요!来到这里我很高兴!나는 Poly, 한국어 선생님입니다. 🌟 나는 포르투갈어를 하고 한국어를 가르칠게요. 시작할까요?',
      translation: 'Hello! I am Poly, your Korean teacher.',
      vocabulary: [
        { word: '안녕하세요', translation: 'Olá', example: '안녕하세요! 잘 지내세요?' },
        { word: '선생님', translation: 'Professor', example: '선생님입니다.' },
      ],
    },
    elementary: {
      main: '안녕하세요! 한국어 수업에 오신 것을 환영합니다! 🇰🇷 선생님이 한국어 선생님입니다. 같이 배워요!',
      translation: 'Welcome to your Korean lesson!',
      vocabulary: [
        { word: '환영', translation: 'Welcome', example: '환영합니다!' },
      ],
    },
    intermediate: {
      main: "안녕하세요! Ready for some Korean practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "다시 오신 것을 환영합니다! Today we'll practice more sophisticated Korean conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "훌륭합니다! Let's dive into an engaging Korean conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "고급 한국어 회화를 시작합시다. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  zh: {
    beginner: {
      main: '你好!很高兴见到你!我是Poly,你的中文老师。🌟 我会说葡萄牙语,慢慢教你中文。我们开始吧?',
      translation: 'Hello! I am Poly, your Chinese teacher.',
      vocabulary: [
        { word: '你好', translation: 'Olá', example: '你好！你好吗？' },
        { word: '老师', translation: 'Professor', example: '我是老师。' },
      ],
    },
    elementary: {
      main: '你好!欢迎来到你的中文课！🇨🇳 我是你的老师。我们一起学习！',
      translation: 'Welcome to your Chinese lesson!',
      vocabulary: [
        { word: '欢迎', translation: 'Welcome', example: '欢迎!' },
      ],
    },
    intermediate: {
      main: "你好! Ready for some Chinese practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "欢迎回来! Today we'll practice more sophisticated Chinese conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "太好了! Let's dive into an engaging Chinese conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "欢迎参加高级中文会话. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  it: {
    beginner: {
      main: 'Ciao! Sono felice di averti qui! Sono Poly, il tuo insegnante di italiano. 🌟 Parlerò in portoghese e ti insegnerò parole in italiano. Iniziamo?',
      translation: 'Hello! I am Poly, your Italian teacher.',
      vocabulary: [
        { word: 'Ciao', translation: 'Olá', example: 'Ciao! Come stai?' },
        { word: 'Insegnante', translation: 'Professor', example: 'Sono il tuo insegnante.' },
      ],
    },
    elementary: {
      main: 'Ciao! Benvenuto alla tua lezione di italiano! 🇮🇹 Sarò il tuo insegnante. Pronti a praticare?',
      translation: 'Welcome to your Italian lesson!',
      vocabulary: [
        { word: 'Benvenuto', translation: 'Welcome', example: 'Benvenuto alla nostra lezione!' },
      ],
    },
    intermediate: {
      main: "Ciao! Ready for some Italian practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "Bentornato! Today we'll practice more sophisticated Italian conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "Eccellente vederti! Let's dive into an engaging Italian conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Benvenuto alla tua sessione avanzata di italiano. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
  ru: {
    beginner: {
      main: 'Привет! Я рад видеть тебя здесь! Я Poly, твой учитель русского языка. 🌟 Я буду говорить по-португальски и учить тебя русскому. Начнём?',
      translation: 'Hello! I am Poly, your Russian teacher.',
      vocabulary: [
        { word: 'Привет', translation: 'Olá', example: 'Привет! Как дела?' },
        { word: 'Учитель', translation: 'Professor', example: 'Я твой учитель.' },
      ],
    },
    elementary: {
      main: 'Привет! Добро пожаловать на урок русского языка! 🇷🇺 Я буду твоим учителем. Готовы практиковаться?',
      translation: 'Welcome to your Russian lesson!',
      vocabulary: [
        { word: 'Добро пожаловать', translation: 'Welcome', example: 'Добро пожаловать!' },
      ],
    },
    intermediate: {
      main: "Привет! Ready for some Russian practice? Let's have a conversation!",
      vocabulary: [],
    },
    upper_intermediate: {
      main: "С возвращением! Today we'll practice more sophisticated Russian conversations.",
      vocabulary: [],
    },
    advanced: {
      main: "Отлично видеть тебя! Let's dive into an engaging Russian conversation today.",
      vocabulary: [],
    },
    fluent: {
      main: "Добро пожаловать на продвинутый курс русского языка. Let's discuss complex topics.",
      vocabulary: [],
    },
  },
};

const getSpeechLanguage = (lang: string): string => {
  const langMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-BR',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    ru: 'ru-RU',
  };
  return langMap[lang] || 'en-US';
};

interface ProfessorAIProps {
  level: LanguageLevel;
  language: string;
  onProgress?: (data: { xp: number; correct: number; errors: string[] }) => void;
}

export default function ProfessorAI({ level, language, onProgress }: ProfessorAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showScenarioSelector, setShowScenarioSelector] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<ScenarioContext | null>(null);
  const [conversationFeedback, setConversationFeedback] = useState<ConversationFeedback | null>(null);
  const [conversationStats, setConversationStats] = useState({ correct: 0, errors: 0, messages: 0 });
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [avatarExpression, setAvatarExpression] = useState<'neutral' | 'happy' | 'thinking' | 'listening' | 'speaking' | 'excited' | 'concerned'>('happy');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('alisha');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const config = LEVEL_CONFIG[level];
  const isBeginner = level === 'beginner' || level === 'elementary';

  const { speak, stop: stopSpeaking } = useNaturalTTS({
    language: getSpeechLanguage(language),
    onEnd: () => setIsSpeaking(false),
    useNaturalVoice: true,
  });

  const { 
    trackError, 
    trackMasteredExpression, 
    startConversation, 
    addConversationMessage, 
    endConversation,
    addXP,
  } = useUserStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScenarioSelect = (scenario: ScenarioContext) => {
    setCurrentScenario(scenario);
    setShowScenarioSelector(false);
    startConversation(scenario.name, scenario.id);
    setConversationStartTime(new Date());
    setConversationStats({ correct: 0, errors: 0, messages: 0 });
    
    const greeting: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Vamos praticar: ${scenario.name}! 📍 ${scenario.description}`,
      timestamp: new Date(),
      scenarioContext: scenario,
      vocabulary: [
        { word: scenario.name.split(' ')[0], translation: scenario.description },
      ],
    };
    
    setMessages([greeting]);
    speak(greeting.content);
  };

  const handleStartFreePractice = () => {
    setShowScenarioSelector(false);
    setCurrentScenario(null);
    startConversation('Free Practice', 'free');
    setConversationStartTime(new Date());
    setConversationStats({ correct: 0, errors: 0, messages: 0 });
    
    const greeting = GREETINGS[language]?.[level] || GREETINGS['en']?.[level];
    const greetingMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: greeting.main,
      translation: greeting.translation,
      vocabulary: greeting.vocabulary,
      timestamp: new Date(),
    };
    
    setMessages([greetingMsg]);
    if (greeting.translation) speak(greeting.main);
    else speak(greeting.main);
  };

  const handleSendMessage = async () => {
    if (!studentInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: studentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addConversationMessage(userMessage);
    setStudentInput('');
    setIsLoading(true);
    setConversationStats(prev => ({ ...prev, messages: prev.messages + 1 }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: studentInput,
          language: language,
          level: level,
          immersionMode: level === 'fluent',
          chatHistory: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        translation: data.translation,
        vocabulary: data.vocabulary,
        grammarTip: data.grammarTip,
        correction: data.correction,
        encouragement: data.encouragement,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      addConversationMessage(assistantMessage);

      if (data.correction) {
        trackError(data.correction.original, data.correction.corrected);
        setConversationStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        addXP(5);
      } else {
        trackMasteredExpression(studentInput);
        setConversationStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        addXP(10);
      }

      if (data.translation) speak(data.response);
      else speak(data.response);

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, tive um problema. Pode tentar novamente? 😊',
        translation: 'Sorry, I had a problem. Can you try again?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndConversation = async () => {
    const feedback = endConversation();
    setConversationFeedback(feedback);
    setShowFeedback(true);
    
    const duration = conversationStartTime 
      ? Math.round((new Date().getTime() - conversationStartTime.getTime()) / 60000)
      : 0;
    
    const feedbackMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `📊 Conversa finalizada! Duração: ${duration} minutos. Precisão: ${Math.round(feedback.accuracy)}%`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, feedbackMsg]);
    
    const allMessages = [...messages, feedbackMsg];
    
    conversationService.saveConversation({
      user_id: '',
      language,
      level,
      scenario: currentScenario?.id,
      messages: allMessages,
      started_at: conversationStartTime?.toISOString() || new Date().toISOString(),
      ended_at: new Date().toISOString(),
      xp_earned: Math.round(feedback.accuracy / 10),
      accuracy: feedback.accuracy,
    }).catch(console.error);
    
    onProgress?.({ 
      xp: Math.round(feedback.accuracy / 10), 
      correct: conversationStats.correct, 
      errors: conversationStats.errors.toString().split(',') 
    });
  };

  const handleStartNewConversation = () => {
    setMessages([]);
    setShowFeedback(false);
    setShowScenarioSelector(true);
    setCurrentScenario(null);
    setConversationFeedback(null);
  };

  const handleSpeak = (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    speak(text);
  };

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = level === 'beginner' || level === 'elementary' ? 'pt-BR' : 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        setStudentInput(finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        handleSendMessageWithTranscript(transcript);
        setTranscript('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setAvatarExpression('listening');
  }, [level, transcript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setAvatarExpression('thinking');
  }, []);

  const handleSendMessageWithTranscript = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    addConversationMessage(userMessage);
    setStudentInput('');
    setIsLoading(true);
    setConversationStats(prev => ({ ...prev, messages: prev.messages + 1 }));
    setAvatarExpression('thinking');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: language,
          level: level,
          immersionMode: level === 'fluent',
          chatHistory: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        translation: data.translation,
        vocabulary: data.vocabulary,
        grammarTip: data.grammarTip,
        correction: data.correction,
        encouragement: data.encouragement,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      addConversationMessage(assistantMessage);

      if (data.correction) {
        trackError(data.correction.original, data.correction.corrected);
        setConversationStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        addXP(5);
        setAvatarExpression('concerned');
      } else {
        trackMasteredExpression(text);
        setConversationStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        addXP(10);
        setAvatarExpression('happy');
      }

      if (data.translation) speak(data.response);
      else speak(data.response);

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, tive um problema. Pode tentar novamente? 😊',
        translation: 'Sorry, I had a problem. Can you try again?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setAvatarExpression('happy');
    } finally {
      setIsLoading(false);
    }
  };

  const levelColor = `bg-gradient-to-r ${config.color}`;

  if (showScenarioSelector) {
    return (
      <div className="flex-1 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 mx-auto ${levelColor} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Olá, vamos praticar!</h2>
            <p className="text-purple-300">
              {config.namePt} · CEFR {config.cefr} · {Math.round(config.targetLanguageRatio * 100)}% inglês
            </p>
          </div>

          {/* Level Progress */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-300">Nível de Imersão</span>
              <span className="text-white font-medium">{Math.round(config.targetLanguageRatio * 100)}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${levelColor} transition-all duration-500`}
                style={{ width: `${config.targetLanguageRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              Escolha um cenário
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario)}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {scenario.id === 'cafe' && '☕'}
                      {scenario.id === 'airport' && '✈️'}
                      {scenario.id === 'shopping' && '🛍️'}
                      {scenario.id === 'hotel' && '🏨'}
                      {scenario.id === 'business' && '💼'}
                      {scenario.id === 'directions' && '🗺️'}
                      {scenario.id === 'social' && '🎉'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{scenario.name}</h4>
                      <p className="text-xs text-purple-300">{scenario.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scenario.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' :
                      scenario.difficulty === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                      'bg-red-500/30 text-red-300'
                    }`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-purple-200">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Free Practice */}
          <button
            onClick={handleStartFreePractice}
            className={`w-full ${levelColor} text-white font-medium py-4 rounded-xl transition-all hover:opacity-90 flex items-center justify-center gap-2`}
          >
            <Sparkles className="w-5 h-5" />
            Conversa Livre
          </button>
        </div>
      </div>
    );
  }

  if (showFeedback && conversationFeedback) {
    return (
      <div className="flex-1 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Feedback Card */}
          <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto ${levelColor} rounded-full flex items-center justify-center mb-4`}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Conversa Finalizada!</h2>
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{Math.round(conversationFeedback.accuracy)}%</p>
                  <p className="text-xs text-purple-300">Precisão</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">{conversationStats.messages}</p>
                  <p className="text-xs text-purple-300">Mensagens</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Encouragement */}
              <div className={`${levelColor} bg-opacity-20 rounded-xl p-4`}>
                <p className="text-white text-center">{conversationFeedback.encouragement}</p>
              </div>

              {/* Strengths */}
              {conversationFeedback.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Pontos Fortes
                  </h4>
                  <ul className="space-y-1">
                    {conversationFeedback.strengths.map((s, i) => (
                      <li key={i} className="text-purple-200 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas to Improve */}
              {conversationFeedback.areasToImprove.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" /> Áreas para Melhorar
                  </h4>
                  <ul className="space-y-1">
                    {conversationFeedback.areasToImprove.map((a, i) => (
                      <li key={i} className="text-purple-200 text-sm">• {a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* New Vocabulary */}
              {conversationFeedback.newVocabulary.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Novo Vocabulário
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {conversationFeedback.newVocabulary.slice(0, 6).map((v, i) => (
                      <div key={i} className="bg-white/5 rounded-lg px-3 py-2">
                        <p className="font-medium text-white text-sm">{v.word}</p>
                        <p className="text-xs text-purple-300">{v.translation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleStartNewConversation}
                className={`flex-1 ${levelColor} text-white font-medium py-3 rounded-xl transition-all hover:opacity-90`}
              >
                Nova Conversa
              </button>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  const greeting = GREETINGS[language]?.[level] || GREETINGS['en']?.[level];
                  setMessages([{
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: greeting.main,
                    translation: greeting.translation,
                    vocabulary: greeting.vocabulary,
                    timestamp: new Date(),
                  }]);
                  startConversation('Free Practice', 'free');
                  setConversationStartTime(new Date());
                  setConversationStats({ correct: 0, errors: 0, messages: 0 });
                }}
                className="flex-1 bg-white/10 text-white font-medium py-3 rounded-xl transition-all hover:bg-white/20"
              >
                Continuar Praticando
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header with scenario info */}
      <div className="bg-white/10 border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <PremiumAvatar 
              characterId={selectedAvatar}
              expression={avatarExpression} 
              isSpeaking={isSpeaking}
              size="sm"
            />
            <div>
              <h2 className="font-bold text-white">Poly Professor</h2>
              <p className="text-xs text-purple-300">{config.cefr} · {config.namePt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentScenario && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-purple-200">
                📍 {currentScenario.name}
              </span>
            )}
            <button
              onClick={handleEndConversation}
              className="text-xs bg-red-500/30 px-3 py-1 rounded-full text-red-200 hover:bg-red-500/40 transition-colors"
            >
              Finalizar
            </button>
          </div>
        </div>
        
        {/* Stats bar */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-1 text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span>{conversationStats.correct}</span>
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{conversationStats.errors}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <TrendingUp className="w-3 h-3" />
            <span>{conversationStats.messages}</span>
          </div>
        </div>
      </div>

      {/* Chat Area with Avatar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Avatar on the side */}
        <div className="hidden lg:flex flex-col items-center justify-center p-4 bg-white/5 border-r border-white/10">
          <PremiumAvatar 
            characterId={selectedAvatar}
            expression={isLoading ? 'thinking' : avatarExpression} 
            isSpeaking={isSpeaking}
            size="lg"
          />
          <div className="mt-4 text-center">
            <p className="text-white font-medium">Poly</p>
            <p className="text-purple-300 text-xs">{config.namePt}</p>
          </div>
          
          {/* Mic button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`mt-4 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50 animate-pulse'
                : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isBeginner={isBeginner}
              showTranslation={showTranslation}
              onSpeak={handleSpeak}
              levelColor={config.color}
            />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <PremiumAvatar 
                characterId={selectedAvatar}
                expression="thinking" 
                isSpeaking={true}
                size="sm"
              />
              <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
              </div>
            </div>
          )}

          {transcript && isListening && (
            <div className="bg-cyan-500/20 rounded-xl p-3 border border-cyan-500/30">
              <p className="text-sm text-cyan-200 flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                Ouvindo: &quot;{transcript}&quot;
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isBeginner ? "Digite em português..." : "Type in English or Portuguese..."}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !studentInput.trim()}
            className={`px-6 py-3 ${levelColor} text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Enviar
          </button>
        </div>
        
        <div className="mt-2 flex justify-center">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-xs text-purple-300 hover:text-purple-200"
          >
            {showTranslation ? 'Ocultar traduções' : 'Mostrar traduções'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  isBeginner: boolean;
  showTranslation: boolean;
  onSpeak: (text: string) => void;
  levelColor: string;
}

function MessageBubble({ message, isBeginner, showTranslation, onSpeak, levelColor }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 text-center">
        <p className="text-amber-200 font-medium">{message.content}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 ${
        isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : `bg-gradient-to-br ${levelColor}`
      } p-0.5`}>
        <div className="w-full h-full bg-indigo-900 rounded-full flex items-center justify-center">
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <GraduationCap className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-cyan-500 text-white rounded-tr-none'
            : 'bg-white/10 text-white rounded-tl-none'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {message.translation && showTranslation && (
            <p className="mt-2 pt-2 border-t border-white/20 text-sm text-white/70 italic">
              {message.translation}
            </p>
          )}
        </div>

        {message.vocabulary && message.vocabulary.length > 0 && (
          <div className="mt-2 bg-white/5 rounded-xl p-3 max-w-full">
            <div className="flex items-center gap-2 mb-2 text-sm text-purple-300">
              <BookOpen className="w-4 h-4" />
              <span>Vocabulário</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {message.vocabulary.map((v, i) => (
                <div key={i} className="bg-white/5 rounded-lg px-3 py-2">
                  <p className="font-medium text-white text-sm">{v.word}</p>
                  <p className="text-xs text-purple-300">{v.translation}</p>
                  {v.example && (
                    <p className="text-xs text-purple-400 mt-1 italic">{v.example}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {message.grammarTip && (
          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5" />
            <p className="text-sm text-amber-200">{message.grammarTip}</p>
          </div>
        )}

        {message.correction && (
          <div className="mt-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Correção</span>
            </div>
            <p className="text-sm text-white/60 line-through">{message.correction.original}</p>
            <p className="text-sm text-green-400 font-medium">{message.correction.corrected}</p>
            <p className="text-xs text-purple-300 mt-1">{message.correction.explanation}</p>
          </div>
        )}

        {message.encouragement && (
          <p className="mt-1 text-sm text-green-400">{message.encouragement}</p>
        )}

        <div className="mt-1 flex gap-2 items-center">
          <button
            onClick={() => onSpeak(message.content)}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Ouvir"
          >
            <Volume2 className="w-4 h-4 text-purple-300" />
          </button>
          <span className="text-xs text-white/40">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
