-- Phase 2: Community Features, CBT Tools, Sleep Resources, and Monetization
-- Migration created: 2025-10-24

-- ============================================================================
-- COMMUNITY FEATURES
-- ============================================================================

-- Forums table
CREATE TABLE IF NOT EXISTS public.forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID NOT NULL REFERENCES public.forums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Forum comments
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Post likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Comment likes
CREATE TABLE IF NOT EXISTS public.comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Support Groups
CREATE TABLE IF NOT EXISTS public.support_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cover_image TEXT,
  is_private BOOLEAN DEFAULT false,
  max_members INTEGER DEFAULT 50,
  member_count INTEGER DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support Group Members
CREATE TABLE IF NOT EXISTS public.support_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Support Group Messages
CREATE TABLE IF NOT EXISTS public.support_group_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- CBT TOOLS
-- ============================================================================

-- CBT Exercise Templates
CREATE TABLE IF NOT EXISTS public.cbt_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('thought_record', 'behavioral_activation', 'exposure', 'problem_solving', 'relaxation', 'mindfulness')),
  instructions JSONB NOT NULL,
  estimated_minutes INTEGER,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User's CBT Exercise Responses
CREATE TABLE IF NOT EXISTS public.cbt_exercise_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL REFERENCES public.cbt_exercises(id) ON DELETE CASCADE,
  responses JSONB NOT NULL,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Thought Records (core CBT tool)
CREATE TABLE IF NOT EXISTS public.thought_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  situation TEXT NOT NULL,
  automatic_thought TEXT NOT NULL,
  emotions JSONB NOT NULL, -- [{emotion: "anxious", intensity: 8}]
  evidence_for TEXT,
  evidence_against TEXT,
  balanced_thought TEXT,
  emotions_after JSONB, -- [{emotion: "anxious", intensity: 4}]
  cognitive_distortions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- SLEEP RESOURCES
-- ============================================================================

-- Sleep Stories
CREATE TABLE IF NOT EXISTS public.sleep_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  narrator TEXT,
  duration_seconds INTEGER NOT NULL,
  audio_url TEXT,
  cover_url TEXT,
  category TEXT,
  is_premium BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sleep Soundscapes
CREATE TABLE IF NOT EXISTS public.sleep_soundscapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  cover_url TEXT,
  category TEXT CHECK (category IN ('nature', 'white_noise', 'ambient', 'rain', 'ocean', 'forest')),
  is_premium BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sleep Sessions (tracking)
CREATE TABLE IF NOT EXISTS public.sleep_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bedtime TIMESTAMP WITH TIME ZONE,
  wake_time TIMESTAMP WITH TIME ZONE,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  sleep_duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sleep Goals
CREATE TABLE IF NOT EXISTS public.sleep_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  target_bedtime TIME NOT NULL,
  target_wake_time TIME NOT NULL,
  target_hours DECIMAL(3,1),
  reminder_enabled BOOLEAN DEFAULT true,
  reminder_minutes_before INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================================
-- MONETIZATION & SUBSCRIPTIONS
-- ============================================================================

-- Subscription Tiers
CREATE TABLE IF NOT EXISTS public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('free', 'premium', 'pro')),
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Feature Access Log (for analytics)
CREATE TABLE IF NOT EXISTS public.feature_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  access_granted BOOLEAN NOT NULL,
  tier_required TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Community indexes
CREATE INDEX idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_created_at ON public.forum_posts(created_at DESC);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX idx_forum_comments_user_id ON public.forum_comments(user_id);
CREATE INDEX idx_support_group_members_group_id ON public.support_group_members(group_id);
CREATE INDEX idx_support_group_members_user_id ON public.support_group_members(user_id);
CREATE INDEX idx_support_group_messages_group_id ON public.support_group_messages(group_id);

-- CBT indexes
CREATE INDEX idx_cbt_exercise_responses_user_id ON public.cbt_exercise_responses(user_id);
CREATE INDEX idx_cbt_exercise_responses_completed_at ON public.cbt_exercise_responses(completed_at DESC);
CREATE INDEX idx_thought_records_user_id ON public.thought_records(user_id);
CREATE INDEX idx_thought_records_created_at ON public.thought_records(created_at DESC);

-- Sleep indexes
CREATE INDEX idx_sleep_sessions_user_id ON public.sleep_sessions(user_id);
CREATE INDEX idx_sleep_sessions_bedtime ON public.sleep_sessions(bedtime DESC);

-- Subscription indexes
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_exercise_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_soundscapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_access_log ENABLE ROW LEVEL SECURITY;

-- Forums (public read, authenticated write)
CREATE POLICY "Anyone can view forums" ON public.forums FOR SELECT USING (true);
CREATE POLICY "Authenticated users can view posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Forum Comments
CREATE POLICY "Anyone can view comments" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.forum_comments FOR DELETE USING (auth.uid() = user_id);

-- Likes
CREATE POLICY "Users can manage own post likes" ON public.post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own comment likes" ON public.comment_likes FOR ALL USING (auth.uid() = user_id);

-- Support Groups
CREATE POLICY "Anyone can view public groups" ON public.support_groups FOR SELECT USING (NOT is_private OR id IN (SELECT group_id FROM public.support_group_members WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can create groups" ON public.support_groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group admins can update groups" ON public.support_groups FOR UPDATE USING (id IN (SELECT group_id FROM public.support_group_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Support Group Members
CREATE POLICY "Users can view group members if member" ON public.support_group_members FOR SELECT USING (group_id IN (SELECT group_id FROM public.support_group_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can join public groups" ON public.support_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Support Group Messages
CREATE POLICY "Group members can view messages" ON public.support_group_messages FOR SELECT USING (group_id IN (SELECT group_id FROM public.support_group_members WHERE user_id = auth.uid()));
CREATE POLICY "Group members can send messages" ON public.support_group_messages FOR INSERT WITH CHECK (auth.uid() = user_id AND group_id IN (SELECT group_id FROM public.support_group_members WHERE user_id = auth.uid()));

-- CBT Exercises (public read)
CREATE POLICY "Anyone can view CBT exercises" ON public.cbt_exercises FOR SELECT USING (true);

-- CBT Exercise Responses (private)
CREATE POLICY "Users can view own responses" ON public.cbt_exercise_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own responses" ON public.cbt_exercise_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own responses" ON public.cbt_exercise_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own responses" ON public.cbt_exercise_responses FOR DELETE USING (auth.uid() = user_id);

-- Thought Records (private)
CREATE POLICY "Users can manage own thought records" ON public.thought_records FOR ALL USING (auth.uid() = user_id);

-- Sleep Resources (public read)
CREATE POLICY "Anyone can view sleep stories" ON public.sleep_stories FOR SELECT USING (true);
CREATE POLICY "Anyone can view soundscapes" ON public.sleep_soundscapes FOR SELECT USING (true);

-- Sleep Sessions (private)
CREATE POLICY "Users can manage own sleep sessions" ON public.sleep_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sleep goals" ON public.sleep_goals FOR ALL USING (auth.uid() = user_id);

-- Subscriptions (public read for tiers, private for user subscriptions)
CREATE POLICY "Anyone can view subscription tiers" ON public.subscription_tiers FOR SELECT USING (true);
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Feature Access Log
CREATE POLICY "Users can view own access log" ON public.feature_access_log FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check if user has access to premium features
CREATE OR REPLACE FUNCTION public.has_premium_access(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_tier_name TEXT;
BEGIN
  SELECT st.name INTO v_tier_name
  FROM public.user_subscriptions us
  JOIN public.subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND (us.current_period_end IS NULL OR us.current_period_end > now());
  
  RETURN v_tier_name IN ('premium', 'pro');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment post view count
CREATE OR REPLACE FUNCTION public.increment_post_views(p_post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.forum_posts
  SET view_count = view_count + 1
  WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update post comment count
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
    SET comment_count = comment_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for comment count
CREATE TRIGGER update_post_comment_count_trigger
AFTER INSERT OR DELETE ON public.forum_comments
FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();
