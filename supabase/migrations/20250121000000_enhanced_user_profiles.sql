-- Enhanced user profiles with personalization features
-- Migration: Enhanced User Profiles

-- Create enum for mental health goals
CREATE TYPE public.mental_health_goal AS ENUM (
  'stress_relief',
  'anxiety_management', 
  'sleep_improvement',
  'mood_enhancement',
  'focus_concentration',
  'emotional_regulation',
  'self_compassion',
  'mindfulness_practice'
);

-- Create enum for experience levels
CREATE TYPE public.experience_level AS ENUM (
  'beginner',
  'intermediate', 
  'advanced'
);

-- Create enum for preferred session lengths
CREATE TYPE public.session_length AS ENUM (
  'short',    -- 5-10 minutes
  'medium',   -- 10-20 minutes
  'long'      -- 20+ minutes
);

-- Create enum for notification preferences
CREATE TYPE public.notification_frequency AS ENUM (
  'none',
  'daily',
  'weekly',
  'custom'
);

-- Extend users_profile table with personalization fields
ALTER TABLE public.users_profile 
ADD COLUMN IF NOT EXISTS mental_health_goals mental_health_goal[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_level experience_level DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS preferred_session_length session_length DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS notification_frequency notification_frequency DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS timezone_offset INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS total_meditation_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_journal_entries INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS preferred_content_categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS location_country TEXT,
ADD COLUMN IF NOT EXISTS location_city TEXT;

-- Create user preferences table for more granular settings
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_reminders_enabled BOOLEAN DEFAULT true,
  journal_reminders_enabled BOOLEAN DEFAULT true,
  mood_check_reminders_enabled BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '09:00:00',
  weekly_insights_enabled BOOLEAN DEFAULT true,
  community_participation_enabled BOOLEAN DEFAULT true,
  data_sharing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user achievements table for gamification
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_key TEXT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_key)
);

-- Create user activity log for analytics and recommendations
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'meditation', 'journal', 'mood_check', 'assessment'
  activity_id UUID, -- ID of the specific activity
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content recommendations table
CREATE TABLE public.content_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'meditation', 'article', 'exercise'
  content_id UUID NOT NULL,
  recommendation_score DECIMAL(3,2) DEFAULT 0.0,
  recommendation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, content_type, content_id)
);

-- Enable RLS on new tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_activity_log
CREATE POLICY "Users can view their own activity"
ON public.user_activity_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
ON public.user_activity_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for content_recommendations
CREATE POLICY "Users can view their own recommendations"
ON public.content_recommendations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
ON public.content_recommendations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_activity_log_user_id_created_at ON public.user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_user_activity_log_activity_type ON public.user_activity_log(activity_type);
CREATE INDEX idx_content_recommendations_user_id ON public.content_recommendations(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Create function to update user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_id UUID DEFAULT NULL,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_log_id UUID;
BEGIN
  INSERT INTO public.user_activity_log (
    user_id,
    activity_type,
    activity_id,
    duration_seconds,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_activity_id,
    p_duration_seconds,
    p_metadata
  ) RETURNING id INTO activity_log_id;
  
  -- Update user profile stats
  IF p_activity_type = 'meditation' AND p_duration_seconds IS NOT NULL THEN
    UPDATE public.users_profile 
    SET total_meditation_minutes = total_meditation_minutes + (p_duration_seconds / 60)
    WHERE id = p_user_id;
  ELSIF p_activity_type = 'journal' THEN
    UPDATE public.users_profile 
    SET total_journal_entries = total_journal_entries + 1
    WHERE id = p_user_id;
  END IF;
  
  -- Update last active timestamp
  UPDATE public.users_profile 
  SET last_active_at = NOW()
  WHERE id = p_user_id;
  
  RETURN activity_log_id;
END;
$$;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_key TEXT, achievement_type TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_record RECORD;
  new_achievements TEXT[] := '{}';
BEGIN
  -- Get user profile data
  SELECT * INTO profile_record FROM public.users_profile WHERE id = p_user_id;
  
  -- Check for various achievements
  -- First meditation
  IF profile_record.total_meditation_minutes > 0 AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = p_user_id AND achievement_key = 'first_meditation'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key)
    VALUES (p_user_id, 'milestone', 'first_meditation');
    new_achievements := array_append(new_achievements, 'first_meditation');
  END IF;
  
  -- First journal entry
  IF profile_record.total_journal_entries > 0 AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = p_user_id AND achievement_key = 'first_journal'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key)
    VALUES (p_user_id, 'milestone', 'first_journal');
    new_achievements := array_append(new_achievements, 'first_journal');
  END IF;
  
  -- 7-day streak
  IF profile_record.current_streak_days >= 7 AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = p_user_id AND achievement_key = 'week_streak'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key)
    VALUES (p_user_id, 'streak', 'week_streak');
    new_achievements := array_append(new_achievements, 'week_streak');
  END IF;
  
  -- 30-day streak
  IF profile_record.current_streak_days >= 30 AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = p_user_id AND achievement_key = 'month_streak'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key)
    VALUES (p_user_id, 'streak', 'month_streak');
    new_achievements := array_append(new_achievements, 'month_streak');
  END IF;
  
  -- 100 meditation minutes
  IF profile_record.total_meditation_minutes >= 100 AND NOT EXISTS (
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = p_user_id AND achievement_key = 'meditation_100'
  ) THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key)
    VALUES (p_user_id, 'milestone', 'meditation_100');
    new_achievements := array_append(new_achievements, 'meditation_100');
  END IF;
  
  -- Return new achievements
  RETURN QUERY
  SELECT ua.achievement_key, ua.achievement_type
  FROM public.user_achievements ua
  WHERE ua.user_id = p_user_id 
    AND ua.achievement_key = ANY(new_achievements);
END;
$$;