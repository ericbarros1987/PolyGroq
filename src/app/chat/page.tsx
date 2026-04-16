'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mic, MicOff, Send, Volume2, Sparkles, Zap } from 'lucide-react';
import { useChatStore, useUserStore } from '@/store/userStore';
import type { ChatMessage } from '@/types';

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

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'from-green-400 to-emerald-500',
  elementary: 'from-emerald-400 to-teal-500',
  intermediate: 'from-blue-400 to-cyan-500',
  upper_intermediate: 'from-purple-400 to-violet-500',
  advanced: 'from-orange-400 to-amber-500',
  fluent: 'from-pink-400 to-rose-500',
};

export default function ChatPage() {
  const { userProgress, addXP } = useUserStore();
  const { messages, isProcessing, setProcessing, addMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!userProgress || isProcessing || !messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setProcessing(true);
    setInputValue('');

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

      // Speak the response
      speak(data.response);
    } catch (error) {
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
  }, [userProgress, isProcessing, messages, addMessage, setProcessing, addXP, speak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        handleSendMessage(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      startListening();
    }
  };

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{LANGUAGE_FLAGS[userProgress.current_language]}</span>
              <div>
                <h1 className="font-bold text-white text-sm">Professor IA</h1>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${LEVEL_COLORS[userProgress.level]} animate-pulse`} />
                  <span className="text-xs text-purple-300 capitalize">{userProgress.level.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {userProgress.immersion_mode && (
              <div className="px-3 py-1 bg-purple-500/30 rounded-full border border-purple-500/50">
                <span className="text-xs text-purple-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Imersão
                </span>
              </div>
            )}
            <div className="px-3 py-1 bg-amber-500/30 rounded-full border border-amber-500/50">
              <span className="text-xs text-amber-200 flex items-center gap-1">
                <Zap className="w-3 h-3" /> {userProgress.xp_points} XP
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && !isProcessing && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Vamos conversar!</h3>
              <p className="text-purple-300 max-w-sm mx-auto">
                Fale ou digite sua mensagem. A IA vai corrigir você gentilmente e ajudar a melhorar.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                    : 'bg-white/10'
                }`}>
                  {message.role === 'user' ? (
                    <span className="text-white font-bold">V</span>
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className={`px-5 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-tr-none'
                      : 'bg-white/10 backdrop-blur-xl text-white rounded-tl-none border border-white/10'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {message.correction && (
                    <div className="bg-amber-500/20 backdrop-blur-xl rounded-2xl p-4 border border-amber-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">Correção</span>
                      </div>
                      <p className="text-red-300 line-through text-sm">&#8220;{message.correction.original}&#8221;</p>
                      <p className="text-green-400 font-medium">&#8220;{message.correction.corrected}&#8221;</p>
                      {message.correction.explanation && (
                        <p className="text-purple-200 text-xs mt-2">{message.correction.explanation}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 px-1">
                    <span className="text-xs text-purple-400">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speak(message.content)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <Volume2 className="w-4 h-4 text-purple-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="px-5 py-4 bg-white/10 backdrop-blur-xl rounded-2xl rounded-tl-none border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-t from-indigo-950 via-indigo-950/95 to-transparent pt-6 pb-4">
        <div className="max-w-3xl mx-auto px-4">
          {transcript && isListening && (
            <div className="mb-3 px-4 py-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
              <p className="text-sm text-cyan-200">Ouvindo: &#8220;{transcript}&#8221;</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMicClick}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
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
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={isProcessing}
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-xl rounded-full text-white placeholder-purple-300 border border-white/10 focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
              />
            </div>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </form>
          
          <p className="text-center text-xs text-purple-400 mt-3">
            Pressione o microfone ou digite para conversar
          </p>
        </div>
      </div>
    </div>
  );
}
