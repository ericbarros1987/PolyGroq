'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Play, Pause, 
  RotateCcw, CheckCircle, AlertCircle, ChevronLeft,
  Sparkles, Target, TrendingUp, Award, Mic2
} from 'lucide-react';
import Link from 'next/link';
import AvatarTeacher from '@/components/AvatarTeacher';
import { useUserStore } from '@/store/userStore';
import type { LanguageLevel } from '@/types';

const LEVEL_CONFIG: Record<LanguageLevel, { cefr: string; namePt: string; color: string }> = {
  beginner: { cefr: 'A1-A2', namePt: 'Iniciante', color: 'from-green-400 to-emerald-500' },
  elementary: { cefr: 'A2-B1', namePt: 'Elementar', color: 'from-emerald-400 to-teal-500' },
  intermediate: { cefr: 'B1-B2', namePt: 'Intermediário', color: 'from-blue-400 to-cyan-500' },
  upper_intermediate: { cefr: 'B2-C1', namePt: 'Upper-Intermediário', color: 'from-purple-400 to-violet-500' },
  advanced: { cefr: 'C1', namePt: 'Avançado', color: 'from-orange-400 to-amber-500' },
  fluent: { cefr: 'C2', namePt: 'Fluente', color: 'from-pink-400 to-rose-500' },
};

const PRACTICE_SENTENCES = {
  beginner: [
    { text: 'Hello, how are you?', translation: 'Olá, como você está?', difficulty: 1 },
    { text: 'My name is John.', translation: 'Meu nome é John.', difficulty: 1 },
    { text: 'I am from Brazil.', translation: 'Eu sou do Brasil.', difficulty: 1 },
    { text: 'Nice to meet you!', translation: 'Prazer em conhecê-lo!', difficulty: 2 },
    { text: 'Thank you very much.', translation: 'Muito obrigado.', difficulty: 2 },
  ],
  elementary: [
    { text: 'What time is it?', translation: 'Que horas são?', difficulty: 2 },
    { text: 'I would like a coffee, please.', translation: 'Eu gostaria de um café, por favor.', difficulty: 3 },
    { text: 'Where is the bathroom?', translation: 'Onde fica o banheiro?', difficulty: 2 },
    { text: 'How much does this cost?', translation: 'Quanto custa isso?', difficulty: 3 },
    { text: 'Can you help me?', translation: 'Você pode me ajudar?', difficulty: 3 },
  ],
  intermediate: [
    { text: 'I have been learning English for two years.', translation: 'Eu tenho aprendido inglês há dois anos.', difficulty: 4 },
    { text: 'If I were you, I would take the train.', translation: 'Se eu fosse você, eu pegaria o trem.', difficulty: 5 },
    { text: 'Not only did I finish the project, but I also presented it.', translation: 'Não só eu terminei o projeto, mas também o apresentei.', difficulty: 5 },
    { text: 'What do you think about moving to London?', translation: 'O que você acha de se mudar para Londres?', difficulty: 4 },
  ],
  upper_intermediate: [
    { text: 'Had I known about the traffic, I would have left earlier.', translation: 'Se eu soubesse do trânsito, teria saído mais cedo.', difficulty: 6 },
    { text: 'The more you practice, the better you become.', translation: 'Quanto mais você pratica, melhor você fica.', difficulty: 6 },
    { text: 'Despite having studied hard, he did not pass the exam.', translation: 'Apesar de ter estudado muito, ele não passou no exame.', difficulty: 6 },
  ],
  advanced: [
    { text: 'Were it not for your assistance, we would have failed spectacularly.', translation: 'Não fosse pela sua ajuda, teríamos falhado espetacularmente.', difficulty: 7 },
    { text: 'The intricacies of diplomatic negotiations often elude public comprehension.', translation: 'As complexidades das negociações diplomáticas frequentemente escapam à compreensão pública.', difficulty: 7 },
  ],
  fluent: [
    { text: 'Notwithstanding the ostensibly insurmountable challenges, perseverance prevailed.', translation: 'Não obstante os desafios aparentemente insuperáveis, a perseverança prevaleceram.', difficulty: 8 },
    { text: 'The vicissitudes of life demand resilience and adaptability.', translation: 'As vicissitudes da vida exigem resiliência e adaptabilidade.', difficulty: 8 },
  ],
};

interface PronunciationResult {
  score: number;
  feedback: string;
  improvements: string[];
  isCorrect: boolean;
}

export default function SpeakingPracticePage() {
  const { userProgress, addXP } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [transcript, setTranscript] = useState('');
  const [practiceHistory, setPracticeHistory] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const level = (userProgress?.level || 'beginner') as LanguageLevel;
  const config = LEVEL_CONFIG[level];
  const levelColor = `bg-gradient-to-r ${config.color}`;

  const sentences = PRACTICE_SENTENCES[level] || PRACTICE_SENTENCES.beginner;
  const currentSentence = sentences[currentIndex];

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = false;
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
        evaluatePronunciation(finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const evaluatePronunciation = (spokenText: string) => {
    const targetText = currentSentence.text.toLowerCase();
    const spoken = spokenText.toLowerCase();
    
    const targetWords = targetText.split(' ').filter(w => w.length > 2);
    const spokenWords = spoken.split(' ').filter(w => w.length > 2);
    
    let matchedWords = 0;
    const missedWords: string[] = [];
    
    targetWords.forEach(word => {
      if (spoken.includes(word)) {
        matchedWords++;
      } else {
        missedWords.push(word);
      }
    });
    
    const similarity = (matchedWords / targetWords.length) * 100;
    let score = Math.round(similarity);
    
    const improvements: string[] = [];
    let feedback = '';
    let isCorrect = false;
    
    if (score >= 90) {
      score = 100;
      feedback = 'Perfeito! Sua pronúncia está excelente! 🎉';
      isCorrect = true;
    } else if (score >= 75) {
      feedback = 'Muito bom! Quase lá!继续保持! 💪';
      improvements.push('Tente pronunciar as palavras mais devagar');
      isCorrect = true;
    } else if (score >= 50) {
      feedback = 'Bom esforço! Continue praticando! 🌟';
      improvements.push('Ouviu o áudio novamente e repita');
      improvements.push('Foque nos sons que são diferentes do português');
      isCorrect = false;
    } else {
      feedback = 'Vamos praticar mais! Não desista! 💪';
      improvements.push('Primeiro, ouça o áudio несколько vezes');
      improvements.push('Repita cada palavra separadamente');
      isCorrect = false;
    }
    
    if (missedWords.length > 0) {
      improvements.push(`Palavras para praticar: ${missedWords.slice(0, 3).join(', ')}`);
    }
    
    const pronunciationTips = [
      'O som "th" em inglês não existe em português - posiciona a língua entre os dentes',
      'O "r" no final das palavras é diferente - não enrole a língua!',
      'A vogal "a" em "baby" soa como "e" em português',
      'Conecte as palavras quando falar rápido - é mais natural',
    ];
    
    const randomTip = pronunciationTips[Math.floor(Math.random() * pronunciationTips.length)];
    improvements.push(randomTip);
    
    setResult({ score, feedback, improvements, isCorrect });
    setShowResult(true);
    
    setPracticeHistory(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    
    if (isCorrect) {
      addXP(15);
    }
  };

  const nextSentence = () => {
    setShowResult(false);
    setResult(null);
    setTranscript('');
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const repeatSentence = () => {
    setShowResult(false);
    setResult(null);
    setTranscript('');
    speak(currentSentence.text);
  };

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/app" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Mic2 className="w-5 h-5 text-purple-400" />
              <span className="font-bold text-white">Prática de Pronúncia</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full ${levelColor} text-white text-xs font-medium`}>
            {config.cefr}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <AvatarTeacher 
            expression={isRecording ? 'listening' : isSpeaking ? 'speaking' : showResult ? (result?.isCorrect ? 'celebrating' : 'encouraging') : 'happy'}
            mood={result?.isCorrect ? 'excited' : 'neutral'}
            isSpeaking={isSpeaking || isRecording}
            level={level}
            size="lg"
          />
          <p className="text-purple-300 mt-4 text-center">
            {isRecording ? 'Ouvindo...' : isSpeaking ? 'Falando...' : 'Pronto para praticar!'}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-300 text-sm">Progresso</span>
            <span className="text-white font-medium">{practiceHistory.correct}/{practiceHistory.total} corretas</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full ${levelColor} transition-all duration-500`}
              style={{ width: `${practiceHistory.total > 0 ? (practiceHistory.correct / practiceHistory.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Sentence Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-6">
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-white mb-2">{currentSentence.text}</p>
            <p className="text-purple-300">{currentSentence.translation}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => speak(currentSentence.text)}
              disabled={isSpeaking}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/50 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSpeaking ? (
                <Volume2 className="w-6 h-6 text-white animate-pulse" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 ${
                isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50 animate-pulse' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>

            <button
              onClick={repeatSentence}
              disabled={isSpeaking || isRecording}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/50 hover:scale-105 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-6 h-6 text-white" />
            </button>
          </div>

          {transcript && (
            <div className="bg-cyan-500/20 rounded-xl p-4 mb-4">
              <p className="text-cyan-200 text-sm mb-1">Você disse:</p>
              <p className="text-white">{transcript}</p>
            </div>
          )}

          {showResult && result && (
            <div className={`rounded-2xl p-6 ${result.isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
              {/* Score */}
              <div className="flex items-center justify-center mb-4">
                <div className={`w-24 h-24 rounded-full ${levelColor} flex items-center justify-center`}>
                  <span className="text-3xl font-bold text-white">{result.score}%</span>
                </div>
              </div>

              {/* Feedback */}
              <p className="text-center text-white font-medium mb-4">{result.feedback}</p>

              {/* Improvements */}
              <div className="space-y-2">
                {result.improvements.map((improvement, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Target className={`w-4 h-4 mt-0.5 ${result.isCorrect ? 'text-green-400' : 'text-amber-400'}`} />
                    <span className="text-purple-200">{improvement}</span>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSentence}
                className={`w-full mt-6 ${levelColor} text-white font-medium py-3 rounded-xl transition-all hover:opacity-90`}
              >
                Próxima Frase
              </button>
            </div>
          )}
        </div>

        {/* Sentence Navigation */}
        <div className="flex justify-center gap-2 mb-6">
          {sentences.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setShowResult(false); setResult(null); }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex 
                  ? `${levelColor} scale-125` 
                  : i < currentIndex 
                    ? 'bg-green-500' 
                    : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Tips */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium">Dicas de Pronúncia</span>
          </div>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>• Ouça o áudio quantas vezes precisar antes de gravar</li>
            <li>• Grave-se e compare com o áudio original</li>
            <li>• Pratique palavras difíceis separadamente</li>
            <li>• Fale mais devagar para melhorar a clareza</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
