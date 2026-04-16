'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  language: string;
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({
  language,
  onResult,
  onError,
}: UseSpeechRecognitionOptions) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<unknown>(null);

  useEffect(() => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        onResult(finalTranscript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognition as any).stop();
    };
  }, [language, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (recognitionRef.current as any).stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    toggleListening,
  };
}

interface UseTextToSpeechOptions {
  language: string;
  onEnd?: () => void;
}

export function useTextToSpeech({ language, onEnd }: UseTextToSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) {
        console.error('Text-to-speech not supported');
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [language, onEnd]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
