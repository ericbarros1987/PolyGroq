'use client';

import { createContext, useContext, useEffect, useRef } from 'react';
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
  const { userProgress, setUserProgress, setLoading } = useUserStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadProgress = async () => {
      try {
        const userId = localStorage.getItem('poly_grok_user_id');
        
        if (!userId) {
          const newUserId = crypto.randomUUID();
          localStorage.setItem('poly_grok_user_id', newUserId);
          
          const newProgress: UserProgress = {
            user_id: newUserId,
            current_language: 'en',
            level: 'beginner',
            streak_days: 0,
            total_lessons: 0,
            xp_points: 0,
            immersion_mode: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          await supabase
            .from('user_progress')
            .insert(newProgress);
          
          setUserProgress(newProgress);
        } else {
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (error && error.code === 'PGRST116') {
            const newProgress: UserProgress = {
              user_id: userId,
              current_language: 'en',
              level: 'beginner',
              streak_days: 0,
              total_lessons: 0,
              xp_points: 0,
              immersion_mode: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            await supabase
              .from('user_progress')
              .insert(newProgress);
            
            setUserProgress(newProgress);
          } else if (data) {
            setUserProgress(data);
          } else {
            console.error('Error loading progress:', error);
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
      const { error } = await supabase
        .from('user_progress')
        .upsert({ 
          ...progress, 
          user_id: userId, 
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error saving progress:', error);
      }
      
      if (userProgress) {
        setUserProgress({ ...userProgress, ...progress });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <AppContext.Provider value={{ userProgress, loading: useUserStore.getState().loading, updateProgress }}>
      {children}
    </AppContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
