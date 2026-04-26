import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Json } from '@/integrations/supabase/types';

export interface GenerationHistoryItem {
  id: string;
  user_id: string;
  input_text: string;
  generated_prompt: string;
  tool_type: 'generator' | 'humanizer' | 'detector' | 'image_analyzer';
  length_setting: string | null;
  tone: string | null;
  style: string | null;
  target_model: string | null;
  version: number;
  parent_id: string | null;
  metadata: Json;
  created_at: string;
}

export function useGenerationHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (toolType?: string, limit = 50) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('generation_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (toolType) {
        query = query.eq('tool_type', toolType);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setHistory(data as GenerationHistoryItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToHistory = useCallback(async (
    item: Omit<GenerationHistoryItem, 'id' | 'user_id' | 'created_at' | 'version' | 'metadata'> & { 
      version?: number;
      metadata?: Json;
    }
  ) => {
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const insertData = {
        user_id: user.id,
        input_text: item.input_text,
        generated_prompt: item.generated_prompt,
        tool_type: item.tool_type,
        length_setting: item.length_setting || null,
        tone: item.tone || null,
        style: item.style || null,
        target_model: item.target_model || null,
        parent_id: item.parent_id || null,
        version: item.version || 1,
        metadata: item.metadata || {}
      };

      const { data, error: insertError } = await supabase
        .from('generation_history')
        .insert([insertData])
        .select()
        .single();
      
      // Add to local state
      setHistory(prev => [data as GenerationHistoryItem, ...prev]);
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Failed to add to history' };
    }
  }, [user]);

  const deleteFromHistory = useCallback(async (id: string) => {
    if (!user) return { error: 'Not authenticated' };
    
    try {
      const { error: deleteError } = await supabase
        .from('generation_history')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      setHistory(prev => prev.filter(item => item.id !== id));
      
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Failed to delete' };
    }
  }, [user]);

  const getVersions = useCallback(async (parentId: string) => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('generation_history')
        .select('*')
        .or(`id.eq.${parentId},parent_id.eq.${parentId}`)
        .eq('user_id', user.id)
        .order('version', { ascending: true });
      
      if (error) throw error;
      
      return data as GenerationHistoryItem[];
    } catch {
      return [];
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, fetchHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    addToHistory,
    deleteFromHistory,
    getVersions
  };
}
