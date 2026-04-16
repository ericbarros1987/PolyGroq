import type { LanguageLevel, Correction } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: 'You are a patient and encouraging English teacher from London. You help students practice English conversation, correct their grammar and pronunciation gently.',
  es: 'Eres un maestro de español paciente y amable de Madrid. Ayudas a los estudiantes a practicar la conversación en español.',
  fr: "Vous êtes un professeur de français patient et encourageant de Paris. Vous aidez les étudiants à pratiquer la conversation en français.",
  de: 'Du bist ein geduldiger und ermutigender Deutschlehrer aus Berlin. Du hilfst Schülern, Deutsch zu üben.',
  it: 'Sei un insegnante d\'italiano paziente e incoraggiante di Roma. Aiuti gli studenti a praticare la conversazione in italiano.',
  ja: 'あなたは辛抱強く励まし上手な東京の日本語教師です。生徒が日本語会話を練習するのを助けます。',
  pt: 'Você é um professor de português paciente e encorajador do Brasil. Ajuda os alunos a praticar a conversão em português.',
  zh: '你是一位来自北京的耐心且鼓励人心的中文老师。你帮助学生练习中文对话。',
  ko: '당신은 인내심 많고 격려하는 서울의 한국어 선생님입니다. 학생들이 한국어 회화를 연습하도록 도와줍니다.',
};

const LEVEL_INSTRUCTIONS: Record<LanguageLevel, string> = {
  beginner: 'Use very simple words and short sentences. Always speak slowly and clearly. Repeat important phrases.',
  elementary: 'Use simple sentences. Speak at a moderate pace. Gently introduce new vocabulary.',
  intermediate: 'Have natural conversations. Introduce idiomatic expressions occasionally. Speak at a normal pace.',
  upper_intermediate: 'Engage in complex discussions. Use idioms and expressions. Challenge the student appropriately.',
  advanced: 'Discuss abstract topics. Use sophisticated vocabulary and complex grammar structures.',
  fluent: 'Have deep, nuanced conversations. Discuss complex cultural topics. Provide literary and poetic language.',
};

export async function getAIResponse(
  userMessage: string,
  chatHistory: OpenRouterMessage[],
  language: string,
  level: LanguageLevel,
  immersionMode: boolean,
  lastErrors: string[] = []
): Promise<{ response: string; correction?: Correction }> {
  const systemPrompt = buildSystemPrompt(language, level, immersionMode, lastErrors);
  
  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-10),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'PolyGrok - Language Learning AI',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku-20240307',
        messages,
        max_tokens: 1000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || '';

    const correction = extractCorrection(userMessage, assistantMessage, language);

    return {
      response: assistantMessage,
      correction,
    };
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

function buildSystemPrompt(
  language: string,
  level: LanguageLevel,
  immersionMode: boolean,
  lastErrors: string[]
): string {
  const langPrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
  const levelPrompt = LEVEL_INSTRUCTIONS[level];
  
  let prompt = `${langPrompt}\n\nTeaching level: ${levelPrompt}\n`;

  if (lastErrors.length > 0) {
    prompt += `\nRemember, the student has been making these mistakes recently. Gently remind them:\n`;
    lastErrors.forEach((error, i) => {
      prompt += `${i + 1}. ${error}\n`;
    });
  }

  if (immersionMode) {
    prompt += `\nIMPORTANT: You are in IMMERSION MODE. Only speak in the target language. Do not translate or use the student's native language unless absolutely necessary to clarify a concept.`;
  } else {
    prompt += `\nYou may occasionally use Portuguese (Brazilian) to explain complex concepts, but try to keep the conversation primarily in the target language.`;
  }

  prompt += `\n\nKeep responses conversational and encouraging. Celebrate small victories. Be patient and kind.`;
  
  return prompt;
}

function extractCorrection(
  userMessage: string,
  _assistantResponse: string,
  language: string
): Correction | undefined {
  const correctionPatterns: Record<string, RegExp[]> = {
    en: [
      /I noticed you said "(.*?)". Did you mean "(.*?)"?/i,
      /(?:grammar|pronunciation):?\s*(?:You said )?"([^"]+)" (?:should be|correctly) "([^"]+)"/i,
    ],
    es: [
      /notaste que dijiste "(.*?)"\. Lo correcto sería "(.*?)"/i,
    ],
    fr: [
      /tu as dit "(.*?)"\. La bonne façon serait "(.*?)"/i,
    ],
  };

  const patterns = correctionPatterns[language] || correctionPatterns.en;
  
  for (const pattern of patterns) {
    const match = userMessage.match(pattern);
    if (match && match.length >= 3) {
      return {
        original: match[1],
        corrected: match[2],
        explanation: 'Here is the corrected version.',
        type: pattern.source.includes('pronunciation') ? 'pronunciation' : 'grammar',
      };
    }
  }

  return undefined;
}

export async function evaluateLevel(
  conversationHistory: OpenRouterMessage[]
): Promise<LanguageLevel> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3-haiku-20240307',
      messages: [
        {
          role: 'system',
          content: 'Analyze the following conversation and determine the speaker\'s language level. Reply with only one word: beginner, elementary, intermediate, upper_intermediate, advanced, or fluent.',
        },
        ...conversationHistory.slice(-5),
      ],
      max_tokens: 50,
    }),
  });

  const data = await response.json();
  const levelText = data.choices[0]?.message?.content?.toLowerCase() || 'beginner';

  const levels: LanguageLevel[] = ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'];
  return levels.find(l => levelText.includes(l)) || 'beginner';
}
