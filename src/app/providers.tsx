'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import type { UserProgress } from '@/types';

interface AppContextType {
  userProgress: UserProgress | null;
  loading: boolean;
  updateProgress: (progress: Partial<UserProgress>) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  userProgress: null,
  loading: true,
  updateProgress: async () => {},
});

export const useApp = () => useContext(AppContext);

function AppProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const { userProgress, setUserProgress, loading, setLoading } = useUserStore();

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const userId = localStorage.getItem('poly_grok_user_id');
        if (!userId) {
          const newUserId = crypto.randomUUID();
          localStorage.setItem('poly_grok_user_id', newUserId);
          await supabase.from('user_progress').insert({
            user_id: newUserId,
            current_language: 'en',
            level: 'beginner',
            streak_days: 0,
            total_lessons: 0,
          });
          setUserProgress({
            user_id: newUserId,
            current_language: 'en',
            level: 'beginner',
            streak_days: 0,
            total_lessons: 0,
            xp_points: 0,
            immersion_mode: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          const { data } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (data) {
            setUserProgress(data);
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [setUserProgress, setLoading]);

  const updateProgress = async (progress: Partial<UserProgress>) => {
    const userId = localStorage.getItem('poly_grok_user_id');
    if (!userId) return;

    try {
      await supabase
        .from('user_progress')
        .update({ ...progress, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      
      setUserProgress({ ...userProgress!, ...progress });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ userProgress, loading, updateProgress }}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
