import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/openrouter';
import type { LanguageLevel } from '@/types';

interface ChatRequestBody {
  message: string;
  language: string;
  level: LanguageLevel;
  immersionMode: boolean;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  lastErrors: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, language, level, immersionMode, chatHistory, lastErrors } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await getAIResponse(
      message,
      chatHistory,
      language,
      level,
      immersionMode,
      lastErrors
    );

    return NextResponse.json({
      response: result.response,
      correction: result.correction,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
