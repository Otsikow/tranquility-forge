import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { 
  AssessmentResult, 
  AssessmentHistory, 
  AssessmentStats,
  AssessmentType,
  InsertAssessmentResult 
} from '@/types/db';

export function useAssessments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAssessmentResult = async (
    assessmentType: AssessmentType,
    score: number,
    maxScore: number,
    severityLevel: string,
    interpretation: string,
    recommendations: string[],
    resources: string[],
    answers: Record<string, number>
  ): Promise<AssessmentResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const resultData: InsertAssessmentResult = {
        user_id: user.id,
        assessment_type: assessmentType,
        score,
        max_score: maxScore,
        severity_level: severityLevel as any,
        interpretation,
        recommendations,
        resources,
        answers,
        completed_at: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('assessment_results')
        .insert(resultData)
        .select()
        .single();

      if (insertError) throw insertError;

      return data as AssessmentResult;
    } catch (err) {
      console.error('Error saving assessment result:', err);
      setError(err instanceof Error ? err.message : 'Failed to save assessment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentHistory = async (
    assessmentType?: AssessmentType,
    limit: number = 10
  ): Promise<AssessmentHistory[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      let query = supabase
        .from('assessment_results')
        .select('id, assessment_type, score, max_score, severity_level, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (assessmentType) {
        query = query.eq('assessment_type', assessmentType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return (data || []) as AssessmentHistory[];
    } catch (err) {
      console.error('Error fetching assessment history:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getLatestAssessments = async (): Promise<Record<AssessmentType, AssessmentHistory | null>> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('assessment_results')
        .select('id, assessment_type, score, max_score, severity_level, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Get the latest result for each assessment type
      const latestResults: Record<string, AssessmentHistory> = {};
      
      if (data) {
        for (const result of data) {
          if (!latestResults[result.assessment_type]) {
            latestResults[result.assessment_type] = result as AssessmentHistory;
          }
        }
      }

      return {
        phq9: latestResults.phq9 || null,
        gad7: latestResults.gad7 || null,
        pss10: latestResults.pss10 || null,
        sleep_hygiene: latestResults.sleep_hygiene || null,
      };
    } catch (err) {
      console.error('Error fetching latest assessments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch latest assessments');
      return { phq9: null, gad7: null, pss10: null, sleep_hygiene: null };
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentStats = async (
    assessmentType: AssessmentType
  ): Promise<AssessmentStats | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: rpcError } = await supabase
        .rpc('get_assessment_stats', {
          p_user_id: user.id,
          p_assessment_type: assessmentType
        });

      if (rpcError) throw rpcError;

      return data?.[0] as AssessmentStats || null;
    } catch (err) {
      console.error('Error fetching assessment stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentById = async (id: string): Promise<AssessmentResult | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      return data as AssessmentResult;
    } catch (err) {
      console.error('Error fetching assessment by ID:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assessment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteAssessmentResult = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error: deleteError } = await supabase
        .from('assessment_results')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error('Error deleting assessment result:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete assessment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    saveAssessmentResult,
    getAssessmentHistory,
    getLatestAssessments,
    getAssessmentStats,
    getAssessmentById,
    deleteAssessmentResult
  };
}
