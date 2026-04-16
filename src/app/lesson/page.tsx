'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LessonFlow from '@/components/LessonFlow';
import { useUserStore } from '@/store/userStore';

function LessonContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson');
  const { userProgress, loading } = useUserStore();

  useEffect(() => {
    if (!loading && !userProgress) {
      window.location.href = '/onboarding';
    }
  }, [loading, userProgress]);

  if (loading || !userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <LessonFlow
      language={userProgress.current_language}
      level={userProgress.level}
      lessonId={lessonId || undefined}
      onExit={() => window.location.href = '/app'}
      onComplete={(data) => {
        console.log('Lesson completed:', data);
      }}
    />
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LessonContent />
    </Suspense>
  );
}
