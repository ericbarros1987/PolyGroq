import { NextRequest, NextResponse } from 'next/server';
import type { LanguageLevel, Correction, VocabularyItem } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROK_API_KEY = process.env.GROK_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationMemory {
  recentTopics: string[];
  masteredExpressions: string[];
  strugglingWith: string[];
  totalConversations: number;
}

interface LevelConfig {
  cefr: string;
  targetLanguageRatio: number;
  nativeLanguageRatio: number;
  description: string;
}

const LEVEL_CONFIGS: Record<LanguageLevel, LevelConfig> = {
  beginner: {
    cefr: 'A1-A2',
    targetLanguageRatio: 0.1,
    nativeLanguageRatio: 0.9,
    description: 'Professor fala EM PORTUGUÊS e ensina palavras básicas em inglês. Explicações completas em português. Vocabulário essencial.',
  },
  elementary: {
    cefr: 'A2-B1',
    targetLanguageRatio: 0.3,
    nativeLanguageRatio: 0.7,
    description: 'Mistura - professor explica em português mas usa mais inglês. Frases simples. Gramática básica.',
  },
  intermediate: {
    cefr: 'B1-B2',
    targetLanguageRatio: 0.5,
    nativeLanguageRatio: 0.5,
    description: 'Maioria em inglês, com traduções quando necessário. Diálogos mais complexos. Expressões idiomáticas.',
  },
  upper_intermediate: {
    cefr: 'B2-C1',
    targetLanguageRatio: 0.75,
    nativeLanguageRatio: 0.25,
    description: 'Quase imersão - professor usa mais inglês. Temas sofisticados. Nuances culturais.',
  },
  advanced: {
    cefr: 'C1',
    targetLanguageRatio: 0.9,
    nativeLanguageRatio: 0.1,
    description: 'Quase imersão total - mínimo suporte em português. Discussões complexas. Precisão nativa.',
  },
  fluent: {
    cefr: 'C2',
    targetLanguageRatio: 1.0,
    nativeLanguageRatio: 0.0,
    description: 'Imersão total - conversamos 100% em inglês. Tópicos avançados. Nível nativo.',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      language, 
      level, 
      immersionMode, 
      chatHistory = [], 
      lastErrors = [],
      conversationMemory,
      userNativeLanguage = 'pt',
      topic,
      scenario,
    } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const levelConfig = LEVEL_CONFIGS[level as LanguageLevel] || LEVEL_CONFIGS.beginner;
    const systemPrompt = buildAdaptivePrompt(
      language, 
      level, 
      levelConfig,
      immersionMode,
      lastErrors,
      conversationMemory,
      userNativeLanguage,
      topic,
      scenario
    );

    // Try Gemini first (free)
    if (GEMINI_API_KEY) {
      try {
        const response = await callGemini(GEMINI_API_KEY, systemPrompt, message, chatHistory);
        if (response) {
          const parsed = parseAIResponse(response, level);
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.error('Gemini failed:', e);
      }
    }

    // Try Grok
    if (GROK_API_KEY) {
      try {
        const response = await callGrok(GROK_API_KEY, systemPrompt, message, chatHistory);
        if (response) {
          const parsed = parseAIResponse(response, level);
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.error('Grok failed:', e);
      }
    }

    // Try OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        const response = await callOpenRouter(OPENROUTER_API_KEY, systemPrompt, message, chatHistory);
        if (response) {
          const parsed = parseAIResponse(response, level);
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.error('OpenRouter failed:', e);
      }
    }

    // Fallback to smart mock response
    const mockResponse = generateSmartMockResponse(message, level, levelConfig, lastErrors);
    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: 'Desculpe, tive um problema. Pode tentar novamente? 😊',
      correction: null,
      translation: 'Sorry, I had a problem. Can you try again?',
      vocabulary: [],
      grammarTip: null,
      encouragement: 'Não se preocupe, erros fazem parte do aprendizado!',
    }, { status: 200 });
  }
}

function buildAdaptivePrompt(
  language: string,
  level: string,
  levelConfig: LevelConfig,
  immersionMode: boolean,
  lastErrors: string[],
  conversationMemory: ConversationMemory | undefined,
  userNativeLanguage: string,
  topic?: string,
  scenario?: string
): string {
  const targetLang = getLanguageName(language);
  const nativeLang = getLanguageName(userNativeLanguage);
  
  let prompt = `You are Poly, an expert ${targetLang} teacher with a warm, encouraging personality. `;
  prompt += `You specialize in teaching ${targetLang} to ${nativeLang} speakers using the CEFR method.\n\n`;
  
  prompt += `## STUDENT PROFILE\n`;
  prompt += `- CEFR Level: ${levelConfig.cefr}\n`;
  prompt += `- Target Language Ratio: ${Math.round(levelConfig.targetLanguageRatio * 100)}% ${targetLang}\n`;
  prompt += `- Native Language Support: ${Math.round(levelConfig.nativeLanguageRatio * 100)}% ${nativeLang}\n\n`;
  
  prompt += `## YOUR TEACHING METHOD\n`;
  prompt += `${levelConfig.description}\n\n`;
  
  prompt += `## CONVERSATION SETTINGS\n`;
  if (topic) prompt += `- Topic: ${topic}\n`;
  if (scenario) prompt += `- Scenario: ${scenario}\n`;
  if (immersionMode) prompt += `- IMMERSION MODE: Only speak in ${targetLang}!\n\n`;
  
  if (lastErrors && lastErrors.length > 0) {
    prompt += `## PREVIOUS ERRORS TO ADDRESS\n`;
    prompt += `The student has made these mistakes recently. Be gentle but helpful:\n`;
    lastErrors.slice(0, 3).forEach(err => {
      prompt += `- ${err}\n`;
    });
    prompt += `\n`;
  }
  
  if (conversationMemory && conversationMemory.masteredExpressions?.length > 0) {
    prompt += `## MASTERED EXPRESSIONS\n`;
    prompt += `The student already knows these - build on them:\n`;
    conversationMemory.masteredExpressions.slice(-5).forEach(expr => {
      prompt += `- ${expr}\n`;
    });
    prompt += `\n`;
  }
  
  prompt += `## RESPONSE FORMAT\n`;
  prompt += `When responding, use this EXACT format (follow it carefully!):\n\n`;
  
  prompt += `MAIN:[Your main response in the appropriate language mix]\n`;
  prompt += `TRANSLATION:[Translation if needed, or "NONE" if in immersion mode]\n`;
  prompt += `VOCABULARY:[New words with meanings, or "NONE"]\n`;
  prompt += `GRAMMAR:[Grammar tip or "NONE"]\n`;
  prompt += `CORRECTION:[If error found: "original|corrected|explanation|type", or "NONE"]\n`;
  prompt += `ENCOURAGEMENT:[Motivational message]\n\n`;
  
  prompt += `## IMPORTANT RULES\n`;
  prompt += `1. Keep responses 2-4 sentences max\n`;
  prompt += `2. Use ${Math.round(levelConfig.nativeLanguageRatio * 100)}% ${nativeLang} and ${Math.round(levelConfig.targetLanguageRatio * 100)}% ${targetLang}\n`;
  prompt += `3. Always be encouraging - this is a safe space to make mistakes\n`;
  prompt += `4. If immersion mode is ON, do NOT provide translations\n`;
  prompt += `5. Ask follow-up questions to keep conversation going\n`;
  prompt += `6. Introduce relevant vocabulary naturally\n`;
  
  return prompt;
}

function parseAIResponse(response: string, level: string): {
  response: string;
  correction: Correction | null;
  translation: string | null;
  vocabulary: VocabularyItem[];
  grammarTip: string | null;
  encouragement: string;
} {
  const lines = response.split('\n');
  
  let mainResponse = response;
  let translation: string | null = null;
  let vocabulary: VocabularyItem[] = [];
  let grammarTip: string | null = null;
  let correction: Correction | null = null;
  let encouragement = 'Continue practicing! You\'re doing great! 🌟';
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    const value = valueParts.join(':').trim();
    
    switch (key.toUpperCase().trim()) {
      case 'MAIN':
        mainResponse = value;
        break;
      case 'TRANSLATION':
        if (value !== 'NONE') translation = value;
        break;
      case 'VOCABULARY':
        if (value !== 'NONE') {
          const words = value.split(',').map(w => w.trim());
          vocabulary = words.map(w => {
            const [word, meaning] = w.split('-').map(s => s.trim());
            return { word: word || w, translation: meaning || '' };
          });
        }
        break;
      case 'GRAMMAR':
        if (value !== 'NONE') grammarTip = value;
        break;
      case 'CORRECTION':
        if (value !== 'NONE') {
          const parts = value.split('|');
          if (parts.length >= 3) {
            correction = {
              original: parts[0],
              corrected: parts[1],
              explanation: parts[2],
              type: (parts[3] as Correction['type']) || 'grammar',
            };
          }
        }
        break;
      case 'ENCOURAGEMENT':
        if (value) encouragement = value;
        break;
    }
  }
  
  return {
    response: mainResponse,
    correction,
    translation,
    vocabulary,
    grammarTip,
    encouragement,
  };
}

async function callGemini(apiKey: string, systemPrompt: string, message: string, chatHistory: Message[]): Promise<string | null> {
  const historyText = chatHistory
    .slice(-4)
    .map(m => `${m.role === 'user' ? 'Student' : 'Teacher'}: ${m.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}\n\n${historyText}\n\nStudent: ${message}\n\nTeacher:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.9 }
      }),
    }
  );

  if (!response.ok) return null;
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callGrok(apiKey: string, systemPrompt: string, message: string, chatHistory: Message[]): Promise<string | null> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-4).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 600,
      temperature: 0.9,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

async function callOpenRouter(apiKey: string, systemPrompt: string, message: string, chatHistory: Message[]): Promise<string | null> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-4).map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://poly-grok.vercel.app',
      'X-Title': 'PolyGrok',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-haiku-20240307',
      messages,
      max_tokens: 600,
      temperature: 0.9,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
  };
  return languages[code] || 'English';
}

function generateSmartMockResponse(
  message: string, 
  level: string, 
  levelConfig: LevelConfig,
  lastErrors: string[]
): {
  response: string;
  correction: Correction | null;
  translation: string | null;
  vocabulary: VocabularyItem[];
  grammarTip: string | null;
  encouragement: string;
} {
  const lower = message.toLowerCase();
  const isBeginner = level === 'beginner' || level === 'elementary';
  const useTranslation = levelConfig.nativeLanguageRatio > 0.5;
  
  // Common patterns to check
  const corrections: Array<{pattern: RegExp; correction: string; explanation: string; type: Correction['type']}> = [
    { 
      pattern: /\bi\s+am\s+from\b/gi, 
      correction: "I'm from", 
      explanation: "Use contractions - 'I'm' is shorter and more natural!", 
      type: 'grammar' 
    },
    { 
      pattern: /\bi\s+want\s+to\s+(go|eat|buy|see)/gi, 
      correction: "I'd like to $1", 
      explanation: "'I'd like to' sounds more polite and formal!", 
      type: 'grammar' 
    },
    { 
      pattern: /\bvery\s+good\b/gi, 
      correction: "That's great/wonderful/amazing", 
      explanation: "Let's vary our expressions! 'Very good' can sound repetitive.", 
      type: 'style' 
    },
    { 
      pattern: /\bno\s+problem\b(?!o)/gi, 
      correction: "You're welcome", 
      explanation: "Both are okay, but 'You're welcome' is more standard in American English.", 
      type: 'vocabulary' 
    },
    { 
      pattern: /\bi\s+don'?t\s+know\s+nothing\b/gi, 
      correction: "I don't know anything / I know nothing", 
      explanation: "Double negative alert! In English, use one negative.", 
      type: 'grammar' 
    },
    { 
      pattern: /\bshe\s+go\b/gi, 
      correction: "She goes", 
      explanation: "Remember the third person singular - add 's' or 'es'!", 
      type: 'grammar' 
    },
  ];

  for (const check of corrections) {
    if (check.pattern.test(lower)) {
      const match = lower.match(check.pattern);
      return {
        response: useTranslation 
          ? `Ótima tentativa! 👏 Mas podemos melhorar isso.`
          : `Good try! 👏 But let's improve this.`,
        translation: useTranslation ? `"${match?.[0]}" → "${check.correction}"` : null,
        vocabulary: [],
        grammarTip: check.explanation,
        correction: {
          original: match?.[0] || lower,
          corrected: check.correction,
          explanation: check.explanation,
          type: check.type,
        },
        encouragement: isBeginner 
          ? 'Não se preocupe! Errar é a melhor forma de aprender. 💪'
          : 'Every correction makes you better! Keep going! 💪',
      };
    }
  }

  // Greetings
  if (lower.match(/^(hi|hello|hey|olá|hola|oi|bom dia|boa tarde)/)) {
    return {
      response: isBeginner
        ? 'Olá! Que bom ver você! Como você está hoje? 😊 Vamos praticar inglês juntos!'
        : "Hello! Great to see you! How are you today? Let's practice some English! 😊",
      translation: isBeginner ? "Hello! Great to see you! How are you today?" : null,
      vocabulary: [
        { word: 'Hello', translation: 'Olá' },
        { word: 'Practice', translation: 'Prática/Praticar' },
      ],
      grammarTip: isBeginner ? null : 'Try saying "I\'m doing well" instead of "I\'m fine" - it sounds more natural!',
      correction: null,
      encouragement: "You're starting great! 🌟",
    };
  }

  // Name questions
  if (lower.includes('name') || lower.includes('seu nome') || lower.includes('who are you')) {
    return {
      response: isBeginner
        ? 'Eu sou o Poly, seu professor de inglês! Estou aqui para te ajudar a praticar. 😊 O que você gostaria de aprender hoje?'
        : "I'm Poly, your English teacher! I'm here to help you practice. 😊 What would you like to learn today?",
      translation: isBeginner ? null : null,
      vocabulary: [
        { word: 'Teacher', translation: 'Professor' },
        { word: 'Help', translation: 'Ajudar' },
      ],
      grammarTip: null,
      correction: null,
      encouragement: "Nice to meet you! Let's start our lesson! 📚",
    };
  }

  // Weather
  if (lower.includes('weather') || lower.includes('clima') || lower.includes('tempo')) {
    return {
      response: isBeginner
        ? 'Ótimo tema! Em inglês, dizemos "The weather is sunny" ou "It\'s raining". Qual é o clima aí? ☀️'
        : "Great topic! We say 'The weather is sunny' or 'It's raining.' What's the weather like where you are? ☀️",
      translation: isBeginner ? '"The weather is sunny" = "O clima está ensolarado"' : null,
      vocabulary: [
        { word: 'Sunny', translation: 'Ensolarado' },
        { word: 'Raining', translation: 'Chovendo' },
        { word: 'Cloudy', translation: 'Nublado' },
      ],
      grammarTip: isBeginner ? null : 'Notice how we use "It\'s" (it is) for weather - it\'s very common in English!',
      correction: null,
      encouragement: "Weather is a great conversation starter! Keep it up! 🌤️",
    };
  }

  // How are you
  if (lower.includes('how are you') || lower.includes('como você está')) {
    return {
      response: isBeginner
        ? 'Estou muito bem, obrigada! 😊 E você, como está se sentindo hoje?'
        : "I'm doing great, thank you! 😊 And you, how are you feeling today?",
      translation: isBeginner ? '"I\'m doing great" = "Estou muito bem"' : null,
      vocabulary: [],
      grammarTip: isBeginner ? null : 'We use "feeling" for emotions - it\'s more expressive than "being"!',
      correction: null,
      encouragement: "I love your enthusiasm! Let's continue! 🚀",
    };
  }

  // Default responses
  const defaultResponses = isBeginner ? [
    {
      response: 'Muito bem! 👏 Continue assim! O que mais você gostaria de praticar?',
      translation: 'Very well! Keep it up! What else would you like to practice?',
      vocabulary: [],
      grammarTip: null,
      correction: null,
      encouragement: 'Você está aprendendo muito rápido! 🌟',
    },
    {
      response: 'Excelente! 😊 Vamos continuar praticando. Me conte mais sobre isso!',
      translation: 'Excellent! Let\'s keep practicing. Tell me more about it!',
      vocabulary: [],
      grammarTip: null,
      correction: null,
      encouragement: 'Você está no caminho certo! 💪',
    },
  ] : [
    {
      response: "That's great! Tell me more about that. Practice makes perfect! 🌟",
      translation: null,
      vocabulary: [],
      grammarTip: "'Practice makes perfect' is a common expression - it means repetition leads to mastery!",
      correction: null,
      encouragement: "You're improving every day! Keep it up! 🚀",
    },
    {
      response: "Wonderful! You're doing amazing. What else would you like to discuss? 💬",
      translation: null,
      vocabulary: [],
      grammarTip: null,
      correction: null,
      encouragement: "I can see your progress! Well done! ✨",
    },
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
