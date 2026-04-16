import { NextRequest, NextResponse } from 'next/server';
import type { LanguageLevel, Correction } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: 'You are a patient and encouraging English teacher. Help students practice conversation, correct grammar gently with encouraging feedback. Always be supportive and celebrate their efforts.',
  es: 'Eres un maestro de español paciente y amable. Ayuda a los estudiantes a practicar la conversación, corrige la gramática gentilmente con comentarios positivos.',
  fr: "Vous êtes un professeur de français patient et encourageant. Aidez les étudiants à pratiquer la conversation, corrigez la grammaire avec gentillesse.",
  de: 'Du bist ein geduldiger und ermutigender Deutschlehrer. Hilf Schülern beim Üben, korrigiere Grammatik sanft.',
  it: 'Sei un insegnante d\'italiano paziente e incoraggiante. Aiuta gli studenti a praticare la conversazione, correggi la grammatica gentilmente.',
  pt: 'Você é um professor de português paciente e encorajador. Ajude os alunos a praticar a conversão, corrija a gramática gentilmente.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, language, level, immersionMode, chatHistory, lastErrors } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ 
        response: 'Desculpe, a chave da API OpenRouter não está configurada. Por favor, configure a variável OPENROUTER_API_KEY.',
        correction: null
      }, { status: 200 });
    }

    const systemPrompt = buildSystemPrompt(language, level, immersionMode, lastErrors);
    
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(chatHistory || []).slice(-10),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://poly-grok.vercel.app',
        'X-Title': 'PolyGrok',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku-20240307',
        messages,
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json({ 
        response: 'Desculpe, houve um problema ao conectar com a IA. Tente novamente.',
        correction: null
      }, { status: 200 });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    return NextResponse.json({
      response: assistantMessage,
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

function buildSystemPrompt(
  language: string,
  level: LanguageLevel,
  immersionMode: boolean,
  lastErrors: string[]
): string {
  const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
  
  let prompt = `${langPrompt}\n\n`;
  prompt += `Teaching level: ${level}\n`;
  prompt += `Student language: ${language}\n\n`;

  if (immersionMode) {
    prompt += `IMMERSION MODE: Only speak in ${language}. Never use the student's native language.\n\n`;
  } else {
    prompt += `You may use Portuguese (Brazilian) to explain complex concepts briefly.\n\n`;
  }

  prompt += `Guidelines:\n`;
  prompt += `- Be patient, encouraging, and supportive\n`;
  prompt += `- Celebrate small victories\n`;
  prompt += `- Gently correct grammar mistakes\n`;
  prompt += `- Keep responses conversational (2-4 sentences max)\n`;
  prompt += `- Ask follow-up questions to keep conversation going\n`;

  if (lastErrors && lastErrors.length > 0) {
    prompt += `\nCommon mistakes to gently remind about:\n`;
    lastErrors.slice(0, 3).forEach((error, i) => {
      prompt += `${i + 1}. ${error}\n`;
    });
  }

  return prompt;
}
