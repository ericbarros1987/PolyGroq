import { supabase } from '@/lib/supabase';
import type { ChatMessage } from '@/types';

export interface SavedConversation {
  id: string;
  user_id: string;
  language: string;
  level: string;
  scenario?: string;
  messages: ChatMessage[];
  started_at: string;
  ended_at?: string;
  xp_earned: number;
  accuracy?: number;
  created_at: string;
}

class ConversationService {
  private userId: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('poly_grok_user_id');
    }
  }

  async saveConversation(conversation: Omit<SavedConversation, 'id' | 'created_at'>): Promise<string | null> {
    if (!this.userId) {
      console.warn('No user ID, conversation not saved');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: this.userId,
          language: conversation.language,
          level: conversation.level,
          scenario: conversation.scenario,
          messages: conversation.messages,
          started_at: conversation.started_at,
          ended_at: conversation.ended_at,
          xp_earned: conversation.xp_earned,
          accuracy: conversation.accuracy,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving conversation:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return null;
    }
  }

  async getConversations(limit = 20, offset = 0): Promise<SavedConversation[]> {
    if (!this.userId) return [];

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getConversationById(id: string): Promise<SavedConversation | null> {
    if (!this.userId) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .eq('user_id', this.userId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  }

  async getRecentConversations(language?: string, limit = 5): Promise<SavedConversation[]> {
    if (!this.userId) return [];

    try {
      let query = supabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (language) {
        query = query.eq('language', language);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recent conversations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      return [];
    }
  }

  async getConversationStats(): Promise<{
    total: number;
    totalMessages: number;
    averageAccuracy: number;
    totalXP: number;
    byLanguage: Record<string, number>;
  }> {
    if (!this.userId) {
      return { total: 0, totalMessages: 0, averageAccuracy: 0, totalXP: 0, byLanguage: {} };
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('language, messages, accuracy, xp_earned')
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error fetching stats:', error);
        return { total: 0, totalMessages: 0, averageAccuracy: 0, totalXP: 0, byLanguage: {} };
      }

      const total = data?.length || 0;
      let totalMessages = 0;
      let totalAccuracy = 0;
      let totalXP = 0;
      const byLanguage: Record<string, number> = {};

      data?.forEach((conv) => {
        totalMessages += conv.messages?.length || 0;
        totalAccuracy += conv.accuracy || 0;
        totalXP += conv.xp_earned || 0;
        byLanguage[conv.language] = (byLanguage[conv.language] || 0) + 1;
      });

      return {
        total,
        totalMessages,
        averageAccuracy: total > 0 ? totalAccuracy / total : 0,
        totalXP,
        byLanguage,
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return { total: 0, totalMessages: 0, averageAccuracy: 0, totalXP: 0, byLanguage: {} };
    }
  }

  async deleteConversation(id: string): Promise<boolean> {
    if (!this.userId) return false;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error deleting conversation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  async clearOldConversations(daysOld = 30): Promise<number> {
    if (!this.userId) return 0;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { error, count } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', this.userId)
        .lt('created_at', cutoffDate.toISOString());

      if (error) {
        console.error('Error clearing old conversations:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error clearing old conversations:', error);
      return 0;
    }
  }
}

export const conversationService = new ConversationService();

export default conversationService;
