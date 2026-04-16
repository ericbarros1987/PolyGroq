'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Volume2, 
  VolumeX,
  Trophy,
  Star,
  Zap,
  BookOpen,
  MessageCircle,
  GraduationCap,
  RotateCcw,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import PremiumAvatar from './PremiumAvatar';
import useNaturalTTS from '@/hooks/useNaturalTTS';
import type { TeachingPhase, Lesson, TeachingStep } from '@/data/teachingMethodology';
import { getLessonsByLanguage, getTeachingProgress } from '@/data/teachingMethodology';
import type { LanguageLevel } from '@/types';

const PHASE_NAMES: Record<TeachingPhase, { pt: string; en: string }> = {
  vocabulary: { pt: 'Vocabulário', en: 'Vocabulary' },
  phrases: { pt: 'Frases', en: 'Phrases' },
  dialogues: { pt: 'Diálogos', en: 'Dialogues' },
  conversation: { pt: 'Conversação', en: 'Conversation' },
  mastery: { pt: 'Domínio', en: 'Mastery' },
};

const PHASE_COLORS: Record<TeachingPhase, string> = {
  vocabulary: 'from-green-400 to-emerald-500',
  phrases: 'from-blue-400 to-cyan-500',
  dialogues: 'from-purple-400 to-violet-500',
  conversation: 'from-orange-400 to-amber-500',
  mastery: 'from-pink-400 to-rose-500',
};

interface LessonFlowProps {
  language: string;
  level: LanguageLevel;
  lessonId?: string;
  onComplete?: (data: { xpEarned: number; stepsCompleted: number }) => void;
  onExit?: () => void;
}

export default function LessonFlow({ language, level, lessonId, onComplete, onExit }: LessonFlowProps) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { addXP, updateStreak } = useUserStore();

  useEffect(() => {
    const lessons = getLessonsByLanguage(language);
    if (lessons.length > 0) {
      const lesson = lessonId 
        ? lessons.find(l => l.id === lessonId) 
        : lessons[0];
      if (lesson) {
        setCurrentLesson(lesson);
      }
    }
  }, [language, lessonId]);

  const currentStep = currentLesson?.steps[currentStepIndex];
  const progress = getTeachingProgress(level, currentLesson?.targetPhase || 'vocabulary');
  const totalSteps = currentLesson?.steps.length || 0;
  const progressPercent = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
  const nativeRatio = 1 - progress.targetRatio;

  const getLangCode = (lvl: LanguageLevel, lang: string): string => {
    if (lvl === 'beginner' || lvl === 'elementary') return 'pt-BR';
    const map: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
      it: 'it-IT', pt: 'pt-BR', ja: 'ja-JP', ko: 'ko-KR',
      zh: 'zh-CN', ru: 'ru-RU'
    };
    return map[lang] || 'pt-BR';
  };

  const { speak, stop: stopSpeaking } = useNaturalTTS({
    language: getLangCode(level, language),
    useNaturalVoice: true,
  });

  useEffect(() => {
    if (currentStep && !isMuted) {
      const timer = setTimeout(() => {
        if (currentStep.instructionNative) {
          speak(currentStep.instructionNative);
        } else {
          speak(currentStep.instruction);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentStep, isMuted, speak]);

  const checkAnswer = () => {
    if (!studentAnswer.trim() || !currentStep?.expectedResponse) return;
    
    const normalizedAnswer = studentAnswer.toLowerCase().trim();
    const normalizedExpected = currentStep.expectedResponse.toLowerCase().trim();
    
    const correct = normalizedAnswer.includes(normalizedExpected) || 
                    normalizedExpected.includes(normalizedAnswer);
    
    setIsCorrect(correct);
    setIsLoading(true);
    
    if (correct) {
      speak(currentStep.encouragement || 'Muito bem!');
      setXpEarned(prev => prev + 10);
    } else {
      speak(`A resposta correta é: ${currentStep.expectedResponse}`);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      setStudentAnswer('');
      setShowHint(false);
      setIsCorrect(null);
    }, 1500);
  };

  const nextStep = () => {
    if (!currentStep) return;
    
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
    }
    
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleLessonComplete();
    }
  };

  const handleLessonComplete = () => {
    const finalXP = (currentLesson?.xpReward || 50) + xpEarned;
    addXP(finalXP);
    updateStreak();
    setShowReward(true);
    
    setTimeout(() => {
      onComplete?.({ xpEarned: finalXP, stepsCompleted: completedSteps.length });
    }, 3000);
  };

  const handleRepeatStep = () => {
    setStudentAnswer('');
    setShowHint(false);
    setIsCorrect(null);
    if (currentStep) {
      speak(currentStep.instructionNative || currentStep.instruction);
    }
  };

  const skipStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setStudentAnswer('');
      setShowHint(false);
      setIsCorrect(null);
    } else {
      handleLessonComplete();
    }
  };

  if (showReward) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full text-center">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${PHASE_COLORS[currentLesson?.targetPhase || 'vocabulary']} flex items-center justify-center shadow-lg animate-bounce`}>
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Lição Completa!</h2>
          <p className="text-purple-300 mb-6">{currentLesson?.title}</p>
          
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-amber-400">+{xpEarned + (currentLesson?.xpReward || 50)}</p>
              <p className="text-sm text-purple-300">XP Total</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400">{completedSteps.length}</p>
              <p className="text-sm text-purple-300">Passos</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/app"
              className="flex-1 bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Início
            </Link>
            <button
              onClick={() => {
                setShowReward(false);
                setCurrentStepIndex(0);
                setCompletedSteps([]);
                setXpEarned(0);
              }}
              className={`flex-1 bg-gradient-to-r ${PHASE_COLORS[currentLesson?.targetPhase || 'vocabulary']} text-white py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
            >
              <RotateCcw className="w-5 h-5" />
              Repetir
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentLesson || !currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center text-white">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-pulse" />
          <p className="text-xl">Carregando lição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-white text-sm">{currentLesson.title}</h1>
              <p className="text-xs text-purple-300">{PHASE_NAMES[currentLesson.targetPhase].pt}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="px-3 py-1 bg-amber-500/30 rounded-full border border-amber-500/50">
              <span className="text-xs text-amber-200 flex items-center gap-1">
                <Zap className="w-3 h-3" /> {xpEarned} XP
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="px-4 pb-3">
          <div className="flex justify-between text-xs text-purple-300 mb-1">
            <span>Passo {currentStepIndex + 1} de {totalSteps}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${PHASE_COLORS[currentLesson.targetPhase]} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Avatar section */}
        <div className="lg:w-80 bg-white/5 border-r border-white/10 p-6 flex flex-col items-center justify-center">
          <PremiumAvatar
            characterId="alisha"
            expression={isCorrect === true ? 'happy' : isCorrect === false ? 'concerned' : 'speaking'}
            isSpeaking={!isMuted && !isCorrect}
            size="xl"
          />
          
          {/* Native language ratio indicator */}
          <div className="mt-6 w-full max-w-xs">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-300">🇧🇷 Português</span>
              <span className="text-purple-300">🇺🇸 {language.toUpperCase()}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div 
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${nativeRatio * 100}%` }}
              />
              <div 
                className="bg-green-500 h-full transition-all duration-500"
                style={{ width: `${progress.targetRatio * 100}%` }}
              />
            </div>
          </div>
          
          {/* Phase info */}
          <div className="mt-4 text-center">
            <p className="text-white font-medium">{PHASE_NAMES[currentLesson.targetPhase].pt}</p>
            <p className="text-purple-300 text-sm">{progress.description}</p>
          </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Instruction card */}
          <div className={`bg-gradient-to-br ${PHASE_COLORS[currentLesson.targetPhase]} bg-opacity-20 rounded-2xl p-6 border border-white/10 mb-6`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${PHASE_COLORS[currentLesson.targetPhase]} flex items-center justify-center flex-shrink-0`}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">
                  {currentStep.instructionNative}
                </h2>
                <p className="text-white/80 text-lg">
                  {currentStep.instruction}
                </p>
              </div>
            </div>
          </div>

          {/* Vocabulary cards */}
          {currentStep.vocabulary && currentStep.vocabulary.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Palavras Novas</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentStep.vocabulary.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => speak(word)}
                    className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-white text-sm flex items-center gap-2"
                  >
                    <span>{word}</span>
                    <Volume2 className="w-4 h-4 text-purple-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grammar tip */}
          {currentStep.grammarTip && (
            <div className="bg-amber-500/10 rounded-xl p-4 mb-6 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <p className="text-amber-200">{currentStep.grammarTip}</p>
              </div>
            </div>
          )}

          {/* Answer section */}
          <div className="flex-1 flex flex-col justify-end">
            {/* Expected response hint */}
            {showHint && currentStep.expectedResponse && (
              <div className="bg-purple-500/20 rounded-xl p-4 mb-4 border border-purple-500/30">
                <p className="text-purple-200 text-sm">
                  <span className="font-medium">Dica:</span> Tente dizer algo relacionado a: 
                  <span className="text-white font-bold ml-2">{currentStep.expectedResponse}</span>
                </p>
              </div>
            )}

            {/* Answer input */}
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (isCorrect === null) checkAnswer();
                    else nextStep();
                  }
                }}
                placeholder={
                  level === 'beginner' || level === 'elementary'
                    ? 'Digite sua resposta em português...'
                    : 'Type your answer...'
                }
                disabled={isLoading}
                className={`flex-1 px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-purple-300 focus:border-purple-500 focus:outline-none transition-all ${
                  isCorrect === true ? 'border-green-500 bg-green-500/20' :
                  isCorrect === false ? 'border-red-500 bg-red-500/20' :
                  'border-white/20'
                }`}
              />
              {isCorrect === null ? (
                <button
                  onClick={checkAnswer}
                  disabled={!studentAnswer.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={isLoading}
                  className={`px-6 py-3 bg-gradient-to-r ${PHASE_COLORS[currentLesson.targetPhase]} text-white font-medium rounded-xl hover:opacity-90 transition-all flex items-center gap-2`}
                >
                  {currentStepIndex < totalSteps - 1 ? (
                    <>
                      Próximo
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5" />
                      Finalizar
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleRepeatStep}
                className="text-sm text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Repetir
              </button>
              {!showHint && currentStep.expectedResponse && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-sm text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  💡 Ver dica
                </button>
              )}
              <button
                onClick={skipStep}
                className="text-sm text-purple-300 hover:text-white transition-colors"
              >
                Pular passo →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="flex justify-center gap-2">
          {currentLesson.steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => i < currentStepIndex && setCurrentStepIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                completedSteps.includes(step.id)
                  ? 'bg-green-500'
                  : i === currentStepIndex
                    ? `bg-gradient-to-r ${PHASE_COLORS[currentLesson.targetPhase]}`
                    : 'bg-white/20 hover:bg-white/30'
              }`}
              disabled={i >= currentStepIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
