-- Phase 2 Features Database Schema
-- Community Features, CBT Tools, Sleep Resources, Monetization

-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium', 'pro');

-- Create forum categories
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'message-circle',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum posts
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create forum replies
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CBT exercise categories
CREATE TABLE public.cbt_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'brain',
  color TEXT DEFAULT '#10B981',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CBT exercises
CREATE TABLE public.cbt_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.cbt_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('worksheet', 'interactive', 'reflection', 'behavioral')),
  estimated_duration INTEGER, -- in minutes
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user CBT progress
CREATE TABLE public.cbt_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.cbt_exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  responses JSONB, -- Store user responses
  score INTEGER, -- If applicable
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sleep stories
CREATE TABLE public.sleep_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  narrator TEXT,
  background_sound_url TEXT,
  cover_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create soundscapes
CREATE TABLE public.soundscapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  category TEXT DEFAULT 'nature',
  is_loopable BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sleep tracking
CREATE TABLE public.sleep_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIMESTAMP WITH TIME ZONE,
  wake_time TIMESTAMP WITH TIME ZONE,
  sleep_duration INTEGER, -- in minutes
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  mood_before_sleep INTEGER CHECK (mood_before_sleep BETWEEN 1 AND 10),
  mood_after_sleep INTEGER CHECK (mood_after_sleep BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create premium features access
CREATE TABLE public.premium_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  tier_required subscription_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user feature access
CREATE TABLE public.user_feature_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.premium_features(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, feature_id)
);

-- Create notification templates
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'engagement', 'achievement', 'social')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user notifications
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.notification_templates(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB, -- Additional data for the notification
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category_id);
CREATE INDEX idx_forum_posts_user ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_created ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_replies_post ON public.forum_replies(post_id);
CREATE INDEX idx_forum_replies_user ON public.forum_replies(user_id);
CREATE INDEX idx_cbt_exercises_category ON public.cbt_exercises(category_id);
CREATE INDEX idx_cbt_progress_user ON public.cbt_progress(user_id);
CREATE INDEX idx_cbt_progress_exercise ON public.cbt_progress(exercise_id);
CREATE INDEX idx_sleep_tracking_user ON public.sleep_tracking(user_id);
CREATE INDEX idx_sleep_tracking_date ON public.sleep_tracking(sleep_date);
CREATE INDEX idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_feature_access_user ON public.user_feature_access(user_id);
CREATE INDEX idx_user_notifications_user ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_sent ON public.user_notifications(sent_at);

-- Enable RLS on all tables
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soundscapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_categories (public read)
CREATE POLICY "Anyone can view forum categories"
  ON public.forum_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage forum categories"
  ON public.forum_categories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_posts
CREATE POLICY "Anyone can view forum posts"
  ON public.forum_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum posts"
  ON public.forum_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own forum posts"
  ON public.forum_posts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own forum posts"
  ON public.forum_posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for forum_replies
CREATE POLICY "Anyone can view forum replies"
  ON public.forum_replies
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum replies"
  ON public.forum_replies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own forum replies"
  ON public.forum_replies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own forum replies"
  ON public.forum_replies
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for CBT categories (public read)
CREATE POLICY "Anyone can view CBT categories"
  ON public.cbt_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage CBT categories"
  ON public.cbt_categories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for CBT exercises (public read)
CREATE POLICY "Anyone can view CBT exercises"
  ON public.cbt_exercises
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage CBT exercises"
  ON public.cbt_exercises
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for CBT progress
CREATE POLICY "Users can view own CBT progress"
  ON public.cbt_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CBT progress"
  ON public.cbt_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CBT progress"
  ON public.cbt_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for sleep stories (public read)
CREATE POLICY "Anyone can view sleep stories"
  ON public.sleep_stories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sleep stories"
  ON public.sleep_stories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for soundscapes (public read)
CREATE POLICY "Anyone can view soundscapes"
  ON public.soundscapes
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage soundscapes"
  ON public.soundscapes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for sleep tracking
CREATE POLICY "Users can view own sleep tracking"
  ON public.sleep_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sleep tracking"
  ON public.sleep_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep tracking"
  ON public.sleep_tracking
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep tracking"
  ON public.sleep_tracking
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for premium features (public read)
CREATE POLICY "Anyone can view premium features"
  ON public.premium_features
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage premium features"
  ON public.premium_features
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user feature access
CREATE POLICY "Users can view own feature access"
  ON public.user_feature_access
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage feature access"
  ON public.user_feature_access
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for notification templates (public read)
CREATE POLICY "Anyone can view notification templates"
  ON public.notification_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage notification templates"
  ON public.notification_templates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user notifications
CREATE POLICY "Users can view own notifications"
  ON public.user_notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notifications"
  ON public.user_notifications
  FOR ALL
  USING (auth.role() = 'service_role');

-- Insert default data
INSERT INTO public.forum_categories (name, description, color, icon, sort_order) VALUES
('General Discussion', 'General mental health and wellness discussions', '#3B82F6', 'message-circle', 1),
('Anxiety Support', 'Support and discussions about anxiety', '#EF4444', 'heart', 2),
('Depression Support', 'Support and discussions about depression', '#8B5CF6', 'shield', 3),
('Meditation & Mindfulness', 'Share meditation experiences and tips', '#10B981', 'leaf', 4),
('Success Stories', 'Share your mental health journey and victories', '#F59E0B', 'star', 5);

INSERT INTO public.cbt_categories (name, description, color, icon, sort_order) VALUES
('Thought Challenging', 'Exercises to identify and challenge negative thoughts', '#3B82F6', 'brain', 1),
('Behavioral Activation', 'Activities to improve mood and engagement', '#10B981', 'activity', 2),
('Mindfulness', 'Present-moment awareness exercises', '#8B5CF6', 'eye', 3),
('Problem Solving', 'Structured approaches to solving life problems', '#F59E0B', 'puzzle', 4),
('Relaxation', 'Techniques for stress reduction and calm', '#EF4444', 'wind', 5);

INSERT INTO public.premium_features (name, description, tier_required) VALUES
('Advanced CBT Tools', 'Access to premium CBT exercises and worksheets', 'premium'),
('Sleep Stories', 'Exclusive sleep stories and guided meditations', 'premium'),
('Community Forums', 'Access to peer support forums', 'premium'),
('Advanced Analytics', 'Detailed mood and progress analytics', 'premium'),
('Unlimited Journal Entries', 'No limit on daily journal entries', 'premium'),
('Priority Support', '24/7 priority customer support', 'pro'),
('Personal Coach', 'Access to personal mental health coach', 'pro'),
('Custom Meditations', 'Create personalized meditation sessions', 'pro');

INSERT INTO public.notification_templates (name, title, body, type) VALUES
('daily_checkin', 'Daily Check-in', 'How are you feeling today? Take a moment to reflect.', 'reminder'),
('meditation_reminder', 'Meditation Time', 'Take a few minutes to center yourself with meditation.', 'reminder'),
('journal_reminder', 'Journal Entry', 'Capture your thoughts and feelings in your journal.', 'reminder'),
('mood_tracking', 'Mood Check', 'Track your mood to better understand your patterns.', 'reminder'),
('community_engagement', 'Community Update', 'New posts in your favorite support groups!', 'engagement'),
('achievement_unlock', 'Achievement Unlocked', 'Congratulations! You''ve reached a new milestone.', 'achievement'),
('weekly_reflection', 'Weekly Reflection', 'Review your week and set intentions for the next one.', 'engagement');

-- Create functions for updating reply counts
CREATE OR REPLACE FUNCTION update_forum_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts 
    SET replies_count = replies_count + 1,
        last_reply_at = NEW.created_at
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts 
    SET replies_count = GREATEST(replies_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_forum_post_reply_count_trigger
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION update_forum_post_reply_count();

-- Create function to check user subscription tier
CREATE OR REPLACE FUNCTION get_user_subscription_tier(p_user_id UUID)
RETURNS subscription_tier
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT tier FROM public.user_subscriptions 
     WHERE user_id = p_user_id 
     AND status = 'active' 
     AND (current_period_end IS NULL OR current_period_end > now())
     ORDER BY created_at DESC LIMIT 1),
    'free'::subscription_tier
  );
$$;

-- Create function to check if user has access to feature
CREATE OR REPLACE FUNCTION user_has_feature_access(p_user_id UUID, p_feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_feature_access ufa
    JOIN public.premium_features pf ON ufa.feature_id = pf.id
    WHERE ufa.user_id = p_user_id 
    AND pf.name = p_feature_name
    AND (ufa.expires_at IS NULL OR ufa.expires_at > now())
  ) OR EXISTS (
    SELECT 1 FROM public.user_subscriptions us
    JOIN public.premium_features pf ON us.tier >= pf.tier_required
    WHERE us.user_id = p_user_id 
    AND pf.name = p_feature_name
    AND us.status = 'active'
    AND (us.current_period_end IS NULL OR us.current_period_end > now())
  );
$$;