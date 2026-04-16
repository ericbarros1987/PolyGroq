'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseTextToSpeechOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  useNaturalVoice?: boolean;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    language = 'pt-BR',
    rate = 1,
    pitch = 1,
    onStart,
    onEnd,
    onError,
    useNaturalVoice = true,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSpeaking(false);
    onEnd?.();
  }, [onEnd]);

  const speak = useCallback(async (text: string) => {
    if (!text) return;

    stop();
    setIsSpeaking(true);
    onStart?.();

    try {
      if (useNaturalVoice) {
        const ratePercent = `${Math.round((rate - 1) * 100)}%`;
        const pitchHz = `${Math.round((pitch - 1) * 50)}Hz`;

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            language,
            rate: ratePercent,
            pitch: pitchHz,
          }),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          throw new Error('TTS request failed');
        }

        const data = await response.json();
        
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audio = new Audio(data.audio);
        audioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          onEnd?.();
        };

        audio.onerror = () => {
          setIsSpeaking(false);
          onError?.(new Error('Audio playback failed'));
        };

        await audio.play();
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          onEnd?.();
        };
        utterance.onerror = (e) => {
          setIsSpeaking(false);
          onError?.(new Error(e.error));
        };

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        onError?.(error as Error);
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = rate;
        utterance.pitch = pitch;
        speechSynthesis.speak(utterance);
      }
    }
  }, [language, rate, pitch, useNaturalVoice, stop, onStart, onEnd, onError]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    speak,
    stop,
    isSpeaking,
  };
}

export default useTextToSpeech;
