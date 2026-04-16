import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROK_API_KEY = process.env.GROK_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: 'You are a patient and encouraging English teacher. Help students practice conversation, correct grammar gently with encouraging feedback. Always be supportive.',
  es: 'Eres un maestro de español paciente y amable. Ayuda a los estudiantes a practicar la conversación, corrige la gramática gentilmente.',
  fr: "Vous êtes un professeur de français patient et encourageant. Aidez les étudiants à pratiquer la conversation.",
  de: 'Du bist ein geduldiger Deutschlehrer. Hilf Schülern beim Üben.',
  pt: 'Você é um professor paciente e encorajador. Ajude os alunos a praticar.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language, level, immersionMode, chatHistory, lastErrors } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(language, level, immersionMode, lastErrors);

    // Try Gemini first (free)
    if (GEMINI_API_KEY) {
      try {
        const response = await callGemini(GEMINI_API_KEY, systemPrompt, message);
        if (response) {
          return NextResponse.json({ response, correction: null });
        }
      } catch (e) {
        console.error('Gemini failed:', e);
      }
    }

    // Try Grok
    if (GROK_API_KEY) {
      try {
        const response = await callGrok(GROK_API_KEY, systemPrompt, message, chatHistory || []);
        if (response) {
          return NextResponse.json({ response, correction: null });
        }
      } catch (e) {
        console.error('Grok failed:', e);
      }
    }

    // Try OpenRouter
    if (OPENROUTER_API_KEY) {
      try {
        const response = await callOpenRouter(OPENROUTER_API_KEY, systemPrompt, message, chatHistory || []);
        if (response) {
          return NextResponse.json({ response, correction: null });
        }
      } catch (e) {
        console.error('OpenRouter failed:', e);
      }
    }

    // Fallback to mock response
    return NextResponse.json({
      response: generateMockResponse(message, language),
      correction: null,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: 'Desculpe, houve um erro. Tente novamente.',
      correction: null
    }, { status: 200 });
  }
}

async function callGemini(apiKey: string, systemPrompt: string, message: string): Promise<string | null> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}\n\nTeacher:`
          }]
        }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.9 }
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
    ...chatHistory.slice(-6),
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
      max_tokens: 500,
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
    ...chatHistory.slice(-6),
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
      max_tokens: 500,
      temperature: 0.9,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

function buildSystemPrompt(language: string, level: string, immersionMode: boolean, lastErrors: string[]): string {
  const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
  
  let prompt = `${langPrompt}\n\n`;
  prompt += `Level: ${level}\n`;
  prompt += immersionMode ? `IMMERSION MODE: Only speak in ${language}.\n\n` : `You may use Portuguese briefly if needed.\n\n`;
  prompt += `Be encouraging, keep responses short (2-3 sentences), ask follow-up questions.\n`;

  if (lastErrors?.length > 0) {
    prompt += `\nRemind gently about: ${lastErrors.slice(0, 2).join(', ')}\n`;
  }

  return prompt;
}

function generateMockResponse(message: string, language: string): string {
  const lower = message.toLowerCase();
  
  if (lower.match(/^(hi|hello|hey|olá|hola)/)) {
    return "Hello! Great to see you! How are you today? Let's practice some English together! 🌟";
  }
  if (lower.includes('name') || lower.includes('who are you')) {
    return "I'm Poly, your English teacher! I'm here to help you practice. What would you like to talk about? 😊";
  }
  if (lower.includes('how are you')) {
    return "I'm doing great, thank you! I'm excited to help you today. Are you ready to start? 💪";
  }
  if (lower.includes('weather')) {
    return "Great topic! We say 'The weather is sunny' or 'It's raining.' What's the weather like where you are? ☀️";
  }
  
  const responses = [
    "That's great! Tell me more about that. Practice makes perfect! 🌟",
    "I appreciate your effort! Let's continue. What else would you like to discuss? 💬",
    "Wonderful! You're improving. Keep practicing! 🚀",
    "I understand! Let's practice more. Try different words! 📚",
    "Excellent! Every conversation helps. What topic next? ✨"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
