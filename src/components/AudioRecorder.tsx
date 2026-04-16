'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/useSpeechRecognition';

interface AudioRecorderProps {
  language: string;
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ language, onTranscript, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const transcriptRef = useRef<string>('');

  const { speak, stop: stopSpeaking } = useTextToSpeech({
    language: getSpeechLanguageCode(language),
    onEnd: () => setIsSpeaking(false),
  });

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    language: getSpeechLanguageCode(language),
    onResult: (text) => {
      transcriptRef.current = text;
      onTranscript(text);
    },
    onError: (error) => {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    },
  });

  useEffect(() => {
    setIsRecording(isListening);
  }, [isListening]);

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      transcriptRef.current = '';
      startListening();
    }
  };

  const handleSpeak = (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    speak(text);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
            : 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording ? (
          <div className="flex items-center gap-1">
            <MicOff className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          </div>
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {transcript && (
        <div className="flex-1 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Você disse:</span> {transcript}
        </div>
      )}

      {isSpeaking && (
        <button
          onClick={() => stopSpeaking()}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-200 animate-pulse" />
        </button>
      )}
    </div>
  );
}

function getSpeechLanguageCode(lang: string): string {
  const langMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    ja: 'ja-JP',
    pt: 'pt-BR',
    zh: 'zh-CN',
    ko: 'ko-KR',
  };
  return langMap[lang] || 'en-US';
}

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TextInput({ value, onChange, onSubmit, disabled, placeholder }: TextInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder || 'Digite sua mensagem...'}
        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-primary-500 focus:outline-none transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enviar
      </button>
    </form>
  );
}
