'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { ChatInterface } from '@/components/ChatInterface';
import { useChatStore, useUserStore } from '@/store/userStore';
import type { ChatMessage } from '@/types';

export default function ChatPage() {
  const router = useRouter();
  const { userProgress, addXP, updateStreak } = useUserStore();
  const { messages, isProcessing, setProcessing, addMessage, clearMessages } = useChatStore();
  const [transcript, setTranscript] = useState('');

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!userProgress || isProcessing) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          language: userProgress.current_language,
          level: userProgress.level,
          immersionMode: userProgress.immersion_mode,
          chatHistory: messages.map(m => ({ role: m.role, content: m.content })),
          lastErrors: userProgress.errors_frequency ? Object.keys(userProgress.errors_frequency) : [],
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        correction: data.correction,
      };
      addMessage(assistantMessage);

      if (data.correction) {
        addXP(10);
      } else {
        addXP(5);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Desculpe, tive um problema. Pode tentar novamente?',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setProcessing(false);
    }
  }, [userProgress, isProcessing, messages, addMessage, setProcessing, addXP]);

  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    if (text && text.length > 10) {
      handleSendMessage(text);
      setTranscript('');
    }
  }, [handleSendMessage]);

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold">Conversa com IA</h1>
            <p className="text-xs text-gray-500">Pratique {userProgress.current_language}</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-hidden">
        <ChatInterface
          messages={messages}
          isProcessing={isProcessing}
          language={userProgress.current_language}
          level={userProgress.level}
          immersionMode={userProgress.immersion_mode}
          onSendMessage={handleSendMessage}
          onTranscript={handleTranscript}
        />
      </div>
    </div>
  );
}
