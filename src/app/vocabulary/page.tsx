'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, BookOpen, Search, Volume2, 
  Filter, CheckCircle, Clock, Star, Shuffle, 
  Play, Trophy
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import AvatarTeacher from '@/components/AvatarTeacher';

interface VocabWord {
  id: string;
  word: string;
  translation: string;
  example?: string;
  pronunciation?: string;
  mastered: boolean;
  lastPracticed?: string;
  category: string;
  timesCorrect: number;
  timesIncorrect: number;
}

export default function VocabularyPage() {
  const { userProgress, conversationMemory } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyMastered, setShowOnlyMastered] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const level = userProgress?.level || 'beginner';

  const categories = [
    'Greetings', 'Food', 'Travel', 'Shopping', 
    'Business', 'Daily Life', 'Weather', 'Family',
    'Colors', 'Numbers', 'Time', 'Places'
  ];

  const vocabulary: VocabWord[] = [
    { id: '1', word: 'Hello', translation: 'Olá', example: 'Hello! How are you?', pronunciation: '/həˈloʊ/', mastered: false, category: 'Greetings', timesCorrect: 0, timesIncorrect: 0 },
    { id: '2', word: 'Goodbye', translation: 'Adeus', example: 'Goodbye, see you tomorrow!', pronunciation: '/ɡʊdˈbaɪ/', mastered: true, category: 'Greetings', timesCorrect: 5, timesIncorrect: 0 },
    { id: '3', word: 'Please', translation: 'Por favor', example: 'Please help me.', pronunciation: '/pliːz/', mastered: true, category: 'Greetings', timesCorrect: 8, timesIncorrect: 1 },
    { id: '4', word: 'Thank you', translation: 'Obrigado', example: 'Thank you very much!', pronunciation: '/θæŋk juː/', mastered: true, category: 'Greetings', timesCorrect: 10, timesIncorrect: 0 },
    { id: '5', word: 'Excuse me', translation: 'Com licença', example: 'Excuse me, where is the bathroom?', pronunciation: '/ɪkˈskjuːz miː/', mastered: false, category: 'Greetings', timesCorrect: 2, timesIncorrect: 3 },
    { id: '6', word: 'Water', translation: 'Água', example: 'Can I have some water?', pronunciation: '/ˈwɔːtər/', mastered: false, category: 'Food', timesCorrect: 0, timesIncorrect: 0 },
    { id: '7', word: 'Coffee', translation: 'Café', example: 'I would like a coffee, please.', pronunciation: '/ˈkɔːfi/', mastered: true, category: 'Food', timesCorrect: 6, timesIncorrect: 1 },
    { id: '8', word: 'Restaurant', translation: 'Restaurante', example: 'The restaurant is very good.', pronunciation: '/ˈrestərɑːnt/', mastered: false, category: 'Food', timesCorrect: 3, timesIncorrect: 2 },
    { id: '9', word: 'Menu', translation: 'Cardápio', example: 'Can I see the menu?', pronunciation: '/ˈmenjuː/', mastered: true, category: 'Food', timesCorrect: 4, timesIncorrect: 0 },
    { id: '10', word: 'Airport', translation: 'Aeroporto', example: 'The airport is far from here.', pronunciation: '/ˈɛrpɔːrt/', mastered: false, category: 'Travel', timesCorrect: 1, timesIncorrect: 2 },
    { id: '11', word: 'Hotel', translation: 'Hotel', example: 'I booked a hotel room.', pronunciation: '/hoʊˈtel/', mastered: true, category: 'Travel', timesCorrect: 7, timesIncorrect: 0 },
    { id: '12', word: 'Ticket', translation: 'Bilhete', example: 'I need to buy a ticket.', pronunciation: '/ˈtɪkɪt/', mastered: false, category: 'Travel', timesCorrect: 2, timesIncorrect: 1 },
    { id: '13', word: 'Shirt', translation: 'Camisa', example: 'This shirt is very nice.', pronunciation: '/ʃɜːrt/', mastered: false, category: 'Shopping', timesCorrect: 0, timesIncorrect: 0 },
    { id: '14', word: 'How much', translation: 'Quanto custa', example: 'How much is this?', pronunciation: '/haʊ mʌtʃ/', mastered: true, category: 'Shopping', timesCorrect: 5, timesIncorrect: 2 },
    { id: '15', word: 'Expensive', translation: 'Caro', example: 'This is too expensive.', pronunciation: '/ɪkˈspensɪv/', mastered: false, category: 'Shopping', timesCorrect: 1, timesIncorrect: 3 },
  ];

  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    setPlayingWord(word);
    window.speechSynthesis.speak(utterance);
    setTimeout(() => setPlayingWord(null), 1000);
  };

  const filteredVocab = vocabulary.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || v.category === selectedCategory;
    const matchesMastered = !showOnlyMastered || v.mastered;
    return matchesSearch && matchesCategory && matchesMastered;
  });

  const masteredCount = vocabulary.filter(v => v.mastered).length;
  const learningCount = vocabulary.filter(v => !v.mastered).length;

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
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white">Vocabulário</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{masteredCount}</p>
            <p className="text-green-100 text-sm">Dominadas</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{learningCount}</p>
            <p className="text-amber-100 text-sm">Aprendendo</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar palavra..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Todas</span>
          </button>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <span className="text-sm font-medium">{cat}</span>
            </button>
          ))}
        </div>

        {/* Mastered Toggle */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <div className={`relative w-12 h-6 rounded-full transition-colors ${showOnlyMastered ? 'bg-green-500' : 'bg-white/20'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showOnlyMastered ? 'translate-x-7' : 'translate-x-1'}`} />
          </div>
          <span className="text-purple-200">Mostrar apenas dominadas</span>
        </label>

        {/* Vocabulary List */}
        <div className="space-y-3">
          {filteredVocab.map((word) => (
            <div
              key={word.id}
              className={`rounded-2xl p-4 border transition-all ${
                word.mastered
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-white">{word.word}</h3>
                      {word.pronunciation && (
                        <p className="text-purple-300 text-sm">{word.pronunciation}</p>
                      )}
                    </div>
                    {word.mastered && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-purple-200 mt-1">{word.translation}</p>
                  {word.example && (
                    <p className="text-purple-300/70 text-sm mt-2 italic">&quot;{word.example}&quot;</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-purple-400 bg-white/10 px-2 py-1 rounded-full">
                      {word.category}
                    </span>
                    <span className="text-xs text-green-400">
                      ✓ {word.timesCorrect} acertos
                    </span>
                    {word.timesIncorrect > 0 && (
                      <span className="text-xs text-red-400">
                        ✗ {word.timesIncorrect} erros
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => speakWord(word.word)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    playingWord === word.word
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-purple-300 hover:bg-white/20'
                  }`}
                >
                  <Volume2 className={`w-5 h-5 ${playingWord === word.word ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVocab.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-purple-300" />
            <p className="text-purple-300">Nenhuma palavra encontrada</p>
          </div>
        )}

        {/* Practice Button */}
        <Link
          href="/speaking"
          className="block w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-1 shadow-xl shadow-purple-500/30"
        >
          <div className="bg-indigo-900 rounded-xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Praticar Vocabulário</h3>
                <p className="text-purple-300 text-sm">Teste seu conhecimento</p>
              </div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl">
              <span className="text-white font-medium">Praticar</span>
            </div>
          </div>
        </Link>
      </main>
    </div>
  );
}
