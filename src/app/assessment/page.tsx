'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mic, MicOff, Volume2, Loader2, CheckCircle, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useSpeechRecognition, useTextToSpeech } from '@/hooks/useSpeechRecognition';
import type { LanguageLevel } from '@/types';

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    prompt: "Hello! How are you today?",
    expectedResponses: ["i'm fine", "i am fine", "good", "i'm good", "i am good", "great", "okay", "ok", "fine thanks", "fine, thank you"],
    difficulty: 'beginner',
    type: 'greeting'
  },
  {
    id: 2,
    prompt: "Can you tell me your name?",
    expectedResponses: ["my name is", "i'm", "i am", "name:"],
    difficulty: 'beginner',
    type: 'introduction'
  },
  {
    id: 3,
    prompt: "What do you do for work?",
    expectedResponses: ["i work as", "i'm a", "i am a", "i'm an", "i do", "my job is", "i'm working"],
    difficulty: 'elementary',
    type: 'work'
  },
  {
    id: 4,
    prompt: "Where are you from?",
    expectedResponses: ["i'm from", "i am from", "i come from", "born in", "originally from"],
    difficulty: 'beginner',
    type: 'location'
  },
  {
    id: 5,
    prompt: "Can you describe your typical day?",
    expectedResponses: ["i usually", "typically", "normally", "every day", "in the morning", "first i", "then i", "after that"],
    difficulty: 'intermediate',
    type: 'routine'
  },
  {
    id: 6,
    prompt: "What did you do last weekend?",
    expectedResponses: ["last weekend", "i went", "i visited", "i spent", "i was", "on saturday", "on sunday", "the day before"],
    difficulty: 'intermediate',
    type: 'past'
  },
  {
    id: 7,
    prompt: "What are your plans for the future?",
    expectedResponses: ["i'm going to", "i plan to", "i hope to", "i would like to", "in the future", "someday", "hopefully"],
    difficulty: 'upper_intermediate',
    type: 'future'
  },
  {
    id: 8,
    prompt: "What's your opinion about artificial intelligence?",
    expectedResponses: ["i think", "in my opinion", "i believe", "from my perspective", "although", "however", "nevertheless"],
    difficulty: 'advanced',
    type: 'opinion'
  },
  {
    id: 9,
    prompt: "If you could live anywhere in the world, where would you choose and why?",
    expectedResponses: ["if i could", "i would choose", "primarily because", "the main reason", "moreover", "additionally", "consequently"],
    difficulty: 'fluent',
    type: 'hypothetical'
  },
  {
    id: 10,
    prompt: "Discuss the impact of social media on modern society.",
    expectedResponses: ["social media", "society", "impact", "affect", "effect", "communication", "connection", "additionally", "consequently", "furthermore"],
    difficulty: 'fluent',
    type: 'abstract'
  },
];

interface AnswerResult {
  questionId: number;
  transcript: string;
  correct: boolean;
  feedback: string;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [assessedLevel, setAssessedLevel] = useState<LanguageLevel | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const question = ASSESSMENT_QUESTIONS[currentQuestion];

  const { speak, stop: stopSpeaking } = useTextToSpeech({
    language: 'en-US',
    onEnd: () => setIsSpeaking(false),
  });

  const { isListening, startListening, stopListening, transcript: liveTranscript } = useSpeechRecognition({
    language: 'en-US',
    onResult: (text) => setTranscript(text),
  });

  useEffect(() => {
    if (question) {
      setIsSpeaking(true);
      speak(question.prompt);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!isListening && transcript) {
      evaluateAnswer();
    }
  }, [isListening, transcript]);

  const handleStartRecording = () => {
    setTranscript('');
    startListening();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    stopListening();
    setIsRecording(false);
  };

  const evaluateAnswer = () => {
    if (!transcript || !question) return;

    const lowerTranscript = transcript.toLowerCase();
    const lowerResponses = question.expectedResponses.map(r => r.toLowerCase());
    const correct = lowerResponses.some(r => lowerTranscript.includes(r));

    const result: AnswerResult = {
      questionId: question.id,
      transcript,
      correct,
      feedback: correct 
        ? 'Excellent! Your response shows good understanding.' 
        : 'Good try! Let me show you a better way to say that.',
    };

    setResults([...results, result]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setTranscript('');
    
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateLevel();
    }
  };

  const calculateLevel = () => {
    const correctCount = results.filter(r => r.correct).length;
    const percentage = (correctCount / ASSESSMENT_QUESTIONS.length) * 100;

    let level: LanguageLevel;
    
    if (percentage >= 90) level = 'fluent';
    else if (percentage >= 75) level = 'advanced';
    else if (percentage >= 60) level = 'upper_intermediate';
    else if (percentage >= 45) level = 'intermediate';
    else if (percentage >= 25) level = 'elementary';
    else level = 'beginner';

    setAssessedLevel(level);
    setIsComplete(true);

    // Save to localStorage
    const userId = localStorage.getItem('poly_grok_user_id');
    if (userId) {
      localStorage.setItem('poly_grok_assessment_' + userId, JSON.stringify({
        level,
        results,
        completedAt: new Date().toISOString(),
      }));
    }
  };

  const handleStartLearning = () => {
    router.push('/app');
  };

  const levelDescriptions: Record<LanguageLevel, string> = {
    beginner: 'Você está começando! Vamos aprender as bases.',
    elementary: 'Você conhece o básico. Vamos.expandir seu vocabulário.',
    intermediate: 'Bom progresso! Vamos aprofundar sua comunicação.',
    upper_intermediate: 'Excelente! Vamos trabalhar em fluência.',
    advanced: 'Incrível! Vamos discutir temas complexos.',
    fluent: 'Parabéns! Vamos manter sua fluência.',
  };

  const levelColors: Record<LanguageLevel, string> = {
    beginner: 'from-green-400 to-emerald-500',
    elementary: 'from-emerald-400 to-teal-500',
    intermediate: 'from-blue-400 to-cyan-500',
    upper_intermediate: 'from-purple-400 to-violet-500',
    advanced: 'from-orange-400 to-amber-500',
    fluent: 'from-pink-400 to-rose-500',
  };

  if (isComplete && assessedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${levelColors[assessedLevel]} p-1`}>
            <div className="w-full h-full bg-indigo-900 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Avaliação Completa!</h1>
          <p className="text-purple-300 mb-6">Seu nível foi determinado</p>
          
          <div className={`inline-block px-6 py-3 rounded-2xl bg-gradient-to-r ${levelColors[assessedLevel]} mb-6`}>
            <p className="text-2xl font-bold text-white capitalize">{assessedLevel.replace('_', ' ')}</p>
          </div>
          
          <p className="text-purple-200 mb-8">
            {levelDescriptions[assessedLevel]}
          </p>
          
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <p className="text-sm text-purple-300 mb-2">Resumo</p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-2xl font-bold text-white">{results.filter(r => r.correct).length}</p>
                <p className="text-xs text-green-400">Corretas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{results.filter(r => !r.correct).length}</p>
                <p className="text-xs text-red-400">Incorretas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{ASSESSMENT_QUESTIONS.length}</p>
                <p className="text-xs text-purple-300">Total</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleStartLearning}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-purple-500/30"
          >
            Começar a Aprender
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/app"
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="text-sm text-purple-300">Pergunta {currentQuestion + 1}/{ASSESSMENT_QUESTIONS.length}</div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Teste de Avaliação</h1>
          <p className="text-purple-300">Ouve a pergunta e responda usando o microfone</p>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => {
                setIsSpeaking(true);
                speak(question.prompt);
              }}
              disabled={isSpeaking}
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isSpeaking ? (
                <Volume2 className="w-8 h-8 text-white animate-pulse" />
              ) : (
                <Volume2 className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
          
          <div className="bg-indigo-900/50 rounded-2xl p-4 mb-6">
            <p className="text-xl text-white text-center font-medium">"{question.prompt}"</p>
          </div>

          {/* Microphone Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${
                isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50 animate-pulse' 
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50 hover:scale-105'
              }`}
            >
              {isRecording ? (
                <MicOff className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </button>
            <p className="mt-4 text-purple-300 text-center">
              {isRecording ? 'Gravando... Clique para parar' : 'Clique para começar a falar'}
            </p>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-4">
            <p className="text-sm text-purple-300 mb-1">Sua resposta:</p>
            <p className="text-white text-lg">"{transcript}"</p>
          </div>
        )}

        {/* Result Display */}
        {showResult && (
          <div className={`rounded-2xl p-6 mb-4 ${
            results[results.length - 1]?.correct 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-amber-500/20 border border-amber-500/30'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              {results[results.length - 1]?.correct ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-400" />
              )}
              <p className={`font-bold ${results[results.length - 1]?.correct ? 'text-green-400' : 'text-amber-400'}`}>
                {results[results.length - 1]?.correct ? 'Muito bem!' : 'Boa tentativa!'}
              </p>
            </div>
            <p className="text-purple-200">{results[results.length - 1]?.feedback}</p>
            
            <button
              onClick={handleNextQuestion}
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>{currentQuestion < ASSESSMENT_QUESTIONS.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
