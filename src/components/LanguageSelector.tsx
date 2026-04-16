'use client';

import { useState } from 'react';
import { Globe, Check, ChevronRight } from 'lucide-react';
import type { Language, LanguageOption, LanguageLevel } from '@/types';

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'Inglês', nativeName: 'English', flag: '🇬🇧', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'es', name: 'Espanhol', nativeName: 'Español', flag: '🇪🇸', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'fr', name: 'Francês', nativeName: 'Français', flag: '🇫🇷', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'de', name: 'Alemão', nativeName: 'Deutsch', flag: '🇩🇪', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', flag: '🇮🇹', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'ja', name: 'Japonês', nativeName: '日本語', flag: '🇯🇵', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇧🇷', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'zh', name: 'Mandarim', nativeName: '中文', flag: '🇨🇳', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
  { code: 'ko', name: 'Coreano', nativeName: '한국어', flag: '🇰🇷', availableLevels: ['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'fluent'] },
];

const LEVELS: { value: LanguageLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Iniciante', description: 'Sem conhecimento prévio ou apenas o básico' },
  { value: 'elementary', label: 'Elementar', description: 'Conheço algumas palavras e frases simples' },
  { value: 'intermediate', label: 'Intermediário', description: 'Posso ter conversas básicas sobre temas familiares' },
  { value: 'upper_intermediate', label: 'Upper Intermediário', description: 'Falo com alguma fluência sobre diversos assuntos' },
  { value: 'advanced', label: 'Avançado', description: 'Tenho boa fluência e posso debater temas complexos' },
  { value: 'fluent', label: 'Fluente', description: 'Falo como um nativo ou quase' },
];

interface LanguageSelectorProps {
  selectedLanguage: Language;
  selectedLevel: LanguageLevel;
  onLanguageChange: (language: Language) => void;
  onLevelChange: (level: LanguageLevel) => void;
}

export function LanguageSelector({
  selectedLanguage,
  selectedLevel,
  onLanguageChange,
  onLevelChange,
}: LanguageSelectorProps) {
  const [step, setStep] = useState<'language' | 'level'>('language');

  const currentLanguage = LANGUAGES.find(l => l.code === selectedLanguage);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <Globe className="w-12 h-12 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          {step === 'language' ? 'Qual idioma você quer aprender?' : 'Qual é o seu nível?'}
        </h2>
        <p className="text-gray-500 text-center">
          {step === 'language'
            ? 'Escolha o idioma que deseja dominar'
            : `Você escolheu ${currentLanguage?.name}. Agora defina seu nível atual`}
        </p>
      </div>

      {step === 'language' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setStep('level');
              }}
              className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLanguage === lang.code
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
              }`}
            >
              <span className="text-3xl mr-4">{lang.flag}</span>
              <div className="text-left flex-1">
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm text-gray-500">{lang.nativeName}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => onLevelChange(level.value)}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedLevel === level.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
              }`}
            >
              <div className="flex-1 text-left">
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm text-gray-500">{level.description}</div>
              </div>
              {selectedLevel === level.value && (
                <Check className="w-6 h-6 text-primary-500" />
              )}
            </button>
          ))}
          <button
            onClick={() => setStep('language')}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            ← Voltar para escolha de idioma
          </button>
        </div>
      )}
    </div>
  );
}
