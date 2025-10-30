-- Add personalization columns to users_profile table
ALTER TABLE public.users_profile
ADD COLUMN IF NOT EXISTS mental_health_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS preferred_session_length TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS notification_frequency TEXT DEFAULT 'daily',
ADD COLUMN IF NOT EXISTS timezone_offset INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
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

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_reminders_enabled BOOLEAN DEFAULT true,
  journal_reminders_enabled BOOLEAN DEFAULT true,
  mood_check_reminders_enabled BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '09:00:00',
  weekly_insights_enabled BOOLEAN DEFAULT true,
  community_participation_enabled BOOLEAN DEFAULT false,
  data_sharing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_key TEXT NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_key)
);

-- Enable RLS on user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS public.user_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_id UUID,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON public.user_activity_log(created_at DESC);

-- Enable RLS on user_activity_log
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_activity_log
CREATE POLICY "Users can view own activity"
  ON public.user_activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON public.user_activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create content_recommendations table
CREATE TABLE IF NOT EXISTS public.content_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  recommendation_score DECIMAL(3,2) NOT NULL,
  recommendation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user_id ON public.content_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_expires_at ON public.content_recommendations(expires_at);

-- Enable RLS on content_recommendations
ALTER TABLE public.content_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.content_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON public.content_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON public.content_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log user activity and update profile stats
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_activity_id UUID DEFAULT NULL,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  -- Insert activity log
  INSERT INTO public.user_activity_log (user_id, activity_type, activity_id, duration_seconds, metadata)
  VALUES (p_user_id, p_activity_type, p_activity_id, p_duration_seconds, p_metadata)
  RETURNING id INTO v_activity_id;
  
  -- Update profile stats
  UPDATE public.users_profile
  SET 
    last_active_at = now(),
    total_meditation_minutes = CASE 
      WHEN p_activity_type = 'meditation' AND p_duration_seconds IS NOT NULL 
      THEN total_meditation_minutes + (p_duration_seconds / 60)
      ELSE total_meditation_minutes
    END,
    total_journal_entries = CASE 
      WHEN p_activity_type = 'journal_entry' 
      THEN total_journal_entries + 1
      ELSE total_journal_entries
    END
  WHERE id = p_user_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and award achievements
CREATE OR REPLACE FUNCTION public.check_achievements(p_user_id UUID)
RETURNS SETOF public.user_achievements AS $$
DECLARE
  v_profile public.users_profile;
  v_achievement RECORD;
  v_new_achievements UUID[];
BEGIN
  -- Get user profile
  SELECT * INTO v_profile FROM public.users_profile WHERE id = p_user_id;
  
  v_new_achievements := ARRAY[]::UUID[];
  
  -- Check first meditation achievement
  IF v_profile.total_meditation_minutes >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'milestone', 'first_meditation', '{"name": "First Steps", "description": "Complete your first meditation session"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  -- Check meditation milestones
  IF v_profile.total_meditation_minutes >= 100 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'meditation', 'meditation_100', '{"name": "Century Club", "description": "Complete 100 minutes of meditation"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  IF v_profile.total_meditation_minutes >= 500 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'meditation', 'meditation_500', '{"name": "Meditation Master", "description": "Complete 500 minutes of meditation"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  -- Check journal milestones
  IF v_profile.total_journal_entries >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'milestone', 'first_journal', '{"name": "Thoughtful Start", "description": "Write your first journal entry"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  IF v_profile.total_journal_entries >= 10 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'journal', 'journal_10', '{"name": "Reflection Pro", "description": "Write 10 journal entries"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  IF v_profile.total_journal_entries >= 50 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'journal', 'journal_50', '{"name": "Storyteller", "description": "Write 50 journal entries"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  -- Check streak achievements
  IF v_profile.current_streak_days >= 7 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'streak', 'week_streak', '{"name": "Week Warrior", "description": "Maintain a 7-day streak"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  IF v_profile.current_streak_days >= 30 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, metadata)
    VALUES (p_user_id, 'streak', 'month_streak', '{"name": "Month Master", "description": "Maintain a 30-day streak"}'::jsonb)
    ON CONFLICT (user_id, achievement_key) DO NOTHING
    RETURNING id INTO v_achievement;
    
    IF v_achievement.id IS NOT NULL THEN
      v_new_achievements := array_append(v_new_achievements, v_achievement.id);
    END IF;
  END IF;
  
  -- Return newly awarded achievements
  RETURN QUERY
  SELECT * FROM public.user_achievements
  WHERE id = ANY(v_new_achievements);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;