'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Check, Star, Zap, Shield, Sparkles } from 'lucide-react';
import PremiumAvatar from '@/components/PremiumAvatar';
import { getAvatarsByLanguage } from '@/data/avatarCharacters';
import { getLanguageByCode } from '@/data/languages';

function AvatarSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const languageCode = searchParams.get('lang') || 'en';
  
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    getAvatarsByLanguage(languageCode)[0]?.id || 'alisha'
  );

  const avatars = getAvatarsByLanguage(languageCode);
  const language = getLanguageByCode(languageCode);

  const handleContinue = () => {
    localStorage.setItem('poly_grok_selected_avatar', selectedAvatar);
    localStorage.setItem('poly_grok_selected_language', languageCode);
    router.push('/onboarding');
  };

  if (!language || avatars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/languages" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{language.flag}</span>
            <h1 className="font-bold text-white">Escolha seu Tutor</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Selected Avatar Preview */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl p-8 border border-white/10">
            <PremiumAvatar 
              characterId={selectedAvatar}
              expression="happy"
              isSpeaking={false}
              size="xl"
              showName
              showTitle
            />
          </div>
          
          {avatars.find(a => a.id === selectedAvatar) && (
            <div className="mt-4 max-w-md mx-auto">
              <p className="text-purple-300 text-sm">
                {avatars.find(a => a.id === selectedAvatar)?.title}
              </p>
              <p className="text-purple-400 text-xs mt-1">
                {avatars.find(a => a.id === selectedAvatar)?.personality}
              </p>
            </div>
          )}
          
          <p className="text-purple-300 mt-4 max-w-md mx-auto">
            Seu tutor nativo de {language.name} vai ajudá-lo a dominar o idioma com 
            conversas naturais e feedback personalizado.
          </p>
        </div>

        {/* Avatar Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`relative rounded-2xl p-4 transition-all hover:scale-105 ${
                selectedAvatar === avatar.id
                  ? 'bg-white/20 border-2 border-white'
                  : 'bg-white/10 border border-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex justify-center mb-3">
                <PremiumAvatar 
                  characterId={avatar.id}
                  expression={selectedAvatar === avatar.id ? 'happy' : 'neutral'}
                  size="md"
                  showName
                />
              </div>
              {selectedAvatar === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            O que esperar das aulas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-500/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Conversas Naturais</h3>
              <p className="text-sm text-purple-300">Pratique como se estivesse falando com um nativo</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500/30 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Feedback Imediato</h3>
              <p className="text-sm text-purple-300">Correção de pronúncia e gramática em tempo real</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-500/30 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Ambiente Seguro</h3>
              <p className="text-sm text-purple-300">Pratique sem medo de errar</p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
        >
          Começar com {avatars.find(a => a.id === selectedAvatar)?.name}
        </button>

        {/* Back Button */}
        <button
          onClick={() => router.push('/languages')}
          className="w-full mt-4 text-purple-300 hover:text-purple-200 text-sm py-2"
        >
          Escolher outro idioma
        </button>
      </main>
    </div>
  );
}

export default function AvatarSelectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AvatarSelectionContent />
    </Suspense>
  );
}
