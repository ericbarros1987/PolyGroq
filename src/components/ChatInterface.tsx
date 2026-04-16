'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, Bot, User, Volume2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { AudioRecorder, TextInput } from './AudioRecorder';
import type { ChatMessage, Language, LanguageLevel, Correction } from '@/types';

const LANGUAGE_FLAGS: Record<string, string> = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  ja: '🇯🇵',
  pt: '🇧🇷',
  zh: '🇨🇳',
  ko: '🇰🇷',
};

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  language: Language;
  level: LanguageLevel;
  immersionMode: boolean;
  onSendMessage: (message: string) => void;
  onTranscript: (transcript: string) => void;
}

export function ChatInterface({
  messages,
  isProcessing,
  language,
  level,
  immersionMode,
  onSendMessage,
  onTranscript,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{LANGUAGE_FLAGS[language]}</span>
          <div>
            <h3 className="font-semibold capitalize">{language === 'en' ? 'Inglês' : language}</h3>
            <p className="text-xs text-gray-500">Nível: {level.replace('_', ' ')}</p>
          </div>
        </div>
        {immersionMode && (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
            Modo Imersão
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Prática de Conversação</h3>
            <p className="text-gray-500 max-w-md">
              Fale ou digite sua mensagem para começar a praticar. 
              {immersionMode 
                ? ' Você está no modo imersão - a IA só falará no idioma alvo!'
                : ' A IA vai corrigir sua gramática e pronúncia gentilmente.'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            language={language}
          />
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <AudioRecorder
            language={language}
            onTranscript={onTranscript}
            disabled={isProcessing}
          />
        </div>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          disabled={isProcessing}
          placeholder="Ou digite sua mensagem aqui..."
        />
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: ChatMessage;
  language: string;
}

function MessageBubble({ message, language }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`p-2 rounded-full ${isUser ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
        {isUser ? (
          <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        ) : (
          <Bot className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        )}
      </div>

      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-primary-500 text-white rounded-tr-none'
              : 'bg-gray-100 dark:bg-gray-800 rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.timestamp && (
          <span className="text-xs text-gray-400 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}

        {message.correction && (
          <CorrectionBadge correction={message.correction} language={language} />
        )}
      </div>
    </div>
  );
}

function CorrectionBadge({ correction, language }: { correction: Correction; language: string }) {
  return (
    <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <span className="font-medium text-amber-800 dark:text-amber-200">Correção</span>
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 dark:text-gray-300">
          <span className="line-through text-red-500">{correction.original}</span>
        </p>
        <p className="text-green-600 dark:text-green-400 font-medium">
          {correction.corrected}
        </p>
        {correction.explanation && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {correction.explanation}
          </p>
        )}
      </div>
    </div>
  );
}
