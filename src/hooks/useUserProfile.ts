/**
 * Hook for managing user profile and personalization features
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { 
  UsersProfile, 
  UserPreferences, 
  UserAchievement,
  UserActivityLog,
  ContentRecommendation,
  UpdateUserProfile,
  InsertUserPreferences,
  InsertUserActivityLog,
  InsertContentRecommendation
} from '@/types/db';

export function useUserProfile() {
  const [profile, setProfile] = useState<UsersProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data as any);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  // Fetch user preferences
  const fetchPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  }, []);

  // Fetch user achievements
  const fetchAchievements = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      if (error) throw error;
      setAchievements((data || []) as any);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates: UpdateUserProfile) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('users_profile')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as any);
      toast({ title: 'Profile updated successfully' });
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Create or update preferences
  const updatePreferences = useCallback(async (prefs: Partial<InsertUserPreferences>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: user.id, ...prefs })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      toast({ title: 'Preferences updated successfully' });
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preferences',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Log user activity
  const logActivity = useCallback(async (
    activityType: string,
    activityId?: string,
    durationSeconds?: number,
    metadata?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_activity_type: activityType,
        p_activity_id: activityId,
        p_duration_seconds: durationSeconds,
        p_metadata: metadata || {}
      });

      if (error) throw error;

      // Check for new achievements
      const { data: newAchievements } = await supabase.rpc('check_achievements', {
        p_user_id: user.id
      });

      if (newAchievements && newAchievements.length > 0) {
        // Refresh achievements and profile
        await Promise.all([fetchAchievements(), fetchProfile()]);
        
        // Show achievement notifications
        newAchievements.forEach((achievement: any) => {
          toast({
            title: 'Achievement Unlocked! 🎉',
            description: `You've earned the ${achievement.achievement_key} achievement!`,
          });
        });
      }

      return data;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [fetchAchievements, fetchProfile, toast]);

  // Get content recommendations
  const getRecommendations = useCallback(async (contentType: string, limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('content_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .gt('expires_at', new Date().toISOString())
        .order('recommendation_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }, []);

  // Generate recommendations based on user profile
  const generateRecommendations = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !profile) return;

      // Simple rule-based recommendations
      const recommendations: InsertContentRecommendation[] = [];

      // Recommend meditations based on goals and experience level
      if (profile.mental_health_goals.includes('stress_relief')) {
        recommendations.push({
          user_id: user.id,
          content_type: 'meditation',
          content_id: 'stress-relief-basics', // This would be a real meditation ID
          recommendation_score: 0.9,
          recommendation_reason: 'Based on your stress relief goal',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      if (profile.mental_health_goals.includes('sleep_improvement')) {
        recommendations.push({
          user_id: user.id,
          content_type: 'meditation',
          content_id: 'sleep-meditation',
          recommendation_score: 0.85,
          recommendation_reason: 'Perfect for your sleep improvement goal',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Recommend based on experience level
      if (profile.experience_level === 'beginner') {
        recommendations.push({
          user_id: user.id,
          content_type: 'meditation',
          content_id: 'beginner-guided-meditation',
          recommendation_score: 0.8,
          recommendation_reason: 'Great for beginners',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }

      // Insert recommendations
      if (recommendations.length > 0) {
        const { error } = await supabase
          .from('content_recommendations')
          .insert(recommendations);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }, [profile]);

  // Complete onboarding
  const completeOnboarding = useCallback(async (onboardingData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update profile with onboarding data
      await updateProfile({
        ...onboardingData,
        onboarding_completed: true
      });

      // Create default preferences
      await updatePreferences({
        meditation_reminders_enabled: true,
        journal_reminders_enabled: true,
        mood_check_reminders_enabled: true,
        reminder_time: '09:00:00',
        weekly_insights_enabled: true,
        community_participation_enabled: true,
        data_sharing_enabled: false
      });

      // Generate initial recommendations
      await generateRecommendations();

      toast({
        title: 'Welcome to Peace! 🎉',
        description: 'Your personalized experience is ready.',
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete setup',
        variant: 'destructive',
      });
      throw error;
    }
  }, [updateProfile, updatePreferences, generateRecommendations, toast]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchProfile(),
        fetchPreferences(),
        fetchAchievements()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchProfile, fetchPreferences, fetchAchievements]);

  return {
    profile,
    preferences,
    achievements,
    loading,
    updateProfile,
    updatePreferences,
    logActivity,
    getRecommendations,
    generateRecommendations,
    completeOnboarding,
    refetch: () => Promise.all([
      fetchProfile(),
      fetchPreferences(),
      fetchAchievements()
    ])
  };
}