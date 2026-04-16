'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, Zap, Shield, Sparkles, Globe, Star, Users } from 'lucide-react';
import PremiumAvatar from '@/components/PremiumAvatar';
import { LANGUAGES, getLanguageByCode, LEVEL_CONFIG } from '@/data/languages';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentLanguage = getLanguageByCode(selectedLanguage);

  const handleContinue = () => {
    localStorage.setItem('poly_grok_selected_language', selectedLanguage);
    router.push(`/avatar?lang=${selectedLanguage}`);
  };

  const groupedLanguages = {
    popular: ['en', 'es', 'fr', 'de', 'pt'],
    asia: ['ja', 'ko', 'zh'],
    other: ['it', 'ru'],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/onboarding" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-white">Escolha seu Idioma</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
            <Globe className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200 text-sm font-medium">Ferramenta Profissional de Poliglotismo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Torne-se um Poliglota Real
          </h2>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Com a metodologia PolyGrok, você aprenderá idiomas com professores nativos IA, 
            prática intensiva e feedback personalizado. Não é um joguinho - é uma ferramenta poderosa.
          </p>
        </div>

        {/* Selected Language Preview */}
        {currentLanguage && (
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <PremiumAvatar 
                  characterId={currentLanguage.teachers[0]?.id || 'alisha'}
                  expression="happy"
                  isSpeaking={isSpeaking}
                  size="xl"
                  showName
                  showTitle
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <span className="text-5xl">{currentLanguage.flag}</span>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{currentLanguage.name}</h3>
                    <p className="text-purple-300">{currentLanguage.nativeName}</p>
                  </div>
                </div>
                <p className="text-purple-200 mb-4">{currentLanguage.region}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {currentLanguage.teachers.map(teacher => (
                    <span key={teacher.id} className="px-3 py-1 bg-white/10 rounded-full text-sm text-purple-200">
                      {teacher.name} - {teacher.accent}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  currentLanguage.difficulty === 'easy' ? 'bg-green-500/30 text-green-300' :
                  currentLanguage.difficulty === 'medium' ? 'bg-amber-500/30 text-amber-300' :
                  'bg-red-500/30 text-red-300'
                }`}>
                  <span className="text-sm font-medium capitalize">Dificuldade: {currentLanguage.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Languages */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Idiomas Populares
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {groupedLanguages.popular.map(code => {
              const lang = getLanguageByCode(code);
              if (!lang) return null;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`relative p-4 rounded-2xl transition-all hover:scale-105 ${
                    selectedLanguage === code
                      ? 'bg-white/20 border-2 border-white'
                      : 'bg-white/10 border border-white/10 hover:bg-white/15'
                  }`}
                >
                  <span className="text-4xl mb-2 block">{lang.flag}</span>
                  <p className="text-white font-medium text-sm">{lang.name}</p>
                  <p className="text-purple-300 text-xs">{lang.teachers.length} professores</p>
                  {selectedLanguage === code && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asian Languages */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Idiomas Asiáticos
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {groupedLanguages.asia.map(code => {
              const lang = getLanguageByCode(code);
              if (!lang) return null;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`relative p-4 rounded-2xl transition-all hover:scale-105 ${
                    selectedLanguage === code
                      ? 'bg-white/20 border-2 border-white'
                      : 'bg-white/10 border border-white/10 hover:bg-white/15'
                  }`}
                >
                  <span className="text-4xl mb-2 block">{lang.flag}</span>
                  <p className="text-white font-medium text-sm">{lang.name}</p>
                  <p className="text-purple-300 text-xs">{lang.teachers.length} professores</p>
                  {selectedLanguage === code && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Languages */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-pink-400" />
            Mais Idiomas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedLanguages.other.map(code => {
              const lang = getLanguageByCode(code);
              if (!lang) return null;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`relative p-4 rounded-2xl transition-all hover:scale-105 ${
                    selectedLanguage === code
                      ? 'bg-white/20 border-2 border-white'
                      : 'bg-white/10 border border-white/10 hover:bg-white/15'
                  }`}
                >
                  <span className="text-4xl mb-2 block">{lang.flag}</span>
                  <p className="text-white font-medium text-sm">{lang.name}</p>
                  <p className="text-purple-300 text-xs">{lang.teachers.length} professores</p>
                  {selectedLanguage === code && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Por que o PolyGrok é diferente?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Professores Nativos IA</h3>
              <p className="text-sm text-purple-300">Cada idioma tem professores nativos com personalidades únicas</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/30 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Metodologia CEFR</h3>
              <p className="text-sm text-purple-300">Progressão clara do A1 ao C2 com métricas reais</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/30 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Ferramenta Profissional</h3>
              <p className="text-sm text-purple-300">Desenvolvido para resultados reais, não jogos</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
        >
          Aprender {currentLanguage?.name} →
        </button>
      </main>
    </div>
  );
}
