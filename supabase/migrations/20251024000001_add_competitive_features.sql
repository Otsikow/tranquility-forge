-- Add competitive features to Peace app
-- Part 1: User Preferences and Onboarding

-- Add user preferences and goals to users_profile
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS primary_goal text;
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS secondary_goals text[] DEFAULT '{}';
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS preferred_session_length int DEFAULT 10;
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS notification_enabled boolean DEFAULT true;
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS notification_time time DEFAULT '09:00:00';
ALTER TABLE public.users_profile ADD COLUMN IF NOT EXISTS experience_level text DEFAULT 'beginner';

-- Create categories for meditations
CREATE TABLE IF NOT EXISTS public.meditation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Link meditations to categories (many-to-many)
CREATE TABLE IF NOT EXISTS public.meditation_category_links (
  meditation_id uuid REFERENCES public.meditations(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.meditation_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (meditation_id, category_id)
);

-- Add category and difficulty to meditations
ALTER TABLE public.meditations ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'beginner';
ALTER TABLE public.meditations ADD COLUMN IF NOT EXISTS instructor_name text;
ALTER TABLE public.meditations ADD COLUMN IF NOT EXISTS type text DEFAULT 'guided';

-- Part 2: Gamification Features

-- User statistics and streaks
CREATE TABLE IF NOT EXISTS public.user_statistics (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_meditation_minutes int DEFAULT 0,
  total_sessions_completed int DEFAULT 0,
  total_journal_entries int DEFAULT 0,
  current_meditation_streak int DEFAULT 0,
  longest_meditation_streak int DEFAULT 0,
  current_journal_streak int DEFAULT 0,
  longest_journal_streak int DEFAULT 0,
  last_meditation_date date,
  last_journal_date date,
  points int DEFAULT 0,
  level int DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  category text, -- 'meditation', 'journal', 'streak', 'social', 'milestone'
  requirement_type text NOT NULL, -- 'count', 'streak', 'time', 'special'
  requirement_value int,
  points_reward int DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Part 3: CBT and Therapeutic Tools

-- CBT Exercises
CREATE TABLE IF NOT EXISTS public.cbt_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL, -- 'thought_record', 'behavioral_activation', 'exposure', 'cognitive_restructuring'
  content jsonb NOT NULL, -- Structured content for the exercise
  duration_minutes int,
  difficulty_level text DEFAULT 'beginner',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User CBT Exercise Progress
CREATE TABLE IF NOT EXISTS public.user_cbt_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.cbt_exercises(id) ON DELETE CASCADE,
  responses jsonb NOT NULL, -- User's responses to the exercise
  completed boolean DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Part 4: Self-Assessment Tools

-- Assessments (PHQ-9, GAD-7, PSS-10, etc.)
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- 'PHQ-9', 'GAD-7', 'PSS-10', 'sleep'
  description text,
  questions jsonb NOT NULL,
  scoring jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User Assessment Results
CREATE TABLE IF NOT EXISTS public.user_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  responses jsonb NOT NULL,
  score int NOT NULL,
  interpretation text,
  taken_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_assessments_user_date ON public.user_assessments(user_id, taken_at DESC);

-- Part 5: Sleep Resources

-- Sleep tracks (stories, soundscapes, white noise)
CREATE TABLE IF NOT EXISTS public.sleep_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL, -- 'story', 'soundscape', 'white_noise', 'meditation'
  duration_seconds int NOT NULL,
  audio_url text NOT NULL,
  cover_url text,
  is_free boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Part 6: Community Features

-- Discussion topics/threads
CREATE TABLE IF NOT EXISTS public.community_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL, -- 'general', 'sleep', 'anxiety', 'depression', 'gratitude', 'support'
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Community comments/replies
CREATE TABLE IF NOT EXISTS public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.community_topics(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_edited boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Community likes/reactions
CREATE TABLE IF NOT EXISTS public.community_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES public.community_topics(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  reaction_type text NOT NULL DEFAULT 'like', -- 'like', 'support', 'insightful'
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reaction_target CHECK ((topic_id IS NOT NULL AND comment_id IS NULL) OR (topic_id IS NULL AND comment_id IS NOT NULL)),
  UNIQUE(user_id, topic_id),
  UNIQUE(user_id, comment_id)
);

-- Group challenges
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL, -- 'meditation', 'journal', 'mixed'
  goal_value int NOT NULL,
  goal_unit text NOT NULL, -- 'days', 'sessions', 'minutes'
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User challenge participation
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  current_progress int DEFAULT 0,
  completed boolean DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, challenge_id)
);

-- Part 7: Educational Resources

-- Articles and resources
CREATE TABLE IF NOT EXISTS public.educational_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  content text NOT NULL,
  category text NOT NULL, -- 'mindfulness', 'cbt', 'anxiety', 'depression', 'sleep', 'stress'
  author text,
  read_time_minutes int,
  cover_url text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User article bookmarks
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES public.educational_articles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Part 8: Enhanced Crisis Support

-- Crisis resources
CREATE TABLE IF NOT EXISTS public.crisis_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL,
  organization_name text NOT NULL,
  phone_number text,
  website_url text,
  chat_url text,
  description text,
  available_24_7 boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Part 9: Teletherapy/Coaching

-- Therapists/Coaches
CREATE TABLE IF NOT EXISTS public.therapists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  credentials text NOT NULL,
  specializations text[] DEFAULT '{}',
  bio text,
  avatar_url text,
  hourly_rate decimal(10,2),
  is_accepting_clients boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Therapy appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  scheduled_at timestamptz NOT NULL,
  duration_minutes int NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  meeting_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Part 10: Wearable Data Integration

-- Wearable health data
CREATE TABLE IF NOT EXISTS public.health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type text NOT NULL, -- 'heart_rate', 'sleep_hours', 'steps', 'activity_minutes'
  value decimal(10,2) NOT NULL,
  unit text NOT NULL,
  recorded_at timestamptz NOT NULL,
  source text, -- 'apple_health', 'google_fit', 'manual'
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_data_user_type_date ON public.health_data(user_id, data_type, recorded_at DESC);

-- Enable RLS on all new tables
ALTER TABLE public.meditation_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_category_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cbt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Meditation categories (public read)
CREATE POLICY "Anyone can view meditation categories"
ON public.meditation_categories FOR SELECT TO authenticated USING (true);

-- User statistics (users can only see their own)
CREATE POLICY "Users can view their own statistics"
ON public.user_statistics FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own statistics"
ON public.user_statistics FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own statistics"
ON public.user_statistics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Achievements (public read)
CREATE POLICY "Anyone can view achievements"
ON public.achievements FOR SELECT TO authenticated USING (true);

-- User achievements
CREATE POLICY "Users can view their own achievements"
ON public.user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- CBT exercises (public read)
CREATE POLICY "Anyone can view CBT exercises"
ON public.cbt_exercises FOR SELECT TO authenticated USING (true);

-- User CBT progress
CREATE POLICY "Users can manage their own CBT progress"
ON public.user_cbt_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Assessments (public read)
CREATE POLICY "Anyone can view assessments"
ON public.assessments FOR SELECT TO authenticated USING (true);

-- User assessments
CREATE POLICY "Users can manage their own assessments"
ON public.user_assessments FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sleep tracks (public read)
CREATE POLICY "Anyone can view sleep tracks"
ON public.sleep_tracks FOR SELECT TO authenticated USING (true);

-- Community topics (all authenticated users can read)
CREATE POLICY "Authenticated users can view community topics"
ON public.community_topics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create topics"
ON public.community_topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topics"
ON public.community_topics FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topics"
ON public.community_topics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Community comments
CREATE POLICY "Authenticated users can view comments"
ON public.community_comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.community_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.community_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Community reactions
CREATE POLICY "Authenticated users can view reactions"
ON public.community_reactions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their own reactions"
ON public.community_reactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Challenges (public read)
CREATE POLICY "Authenticated users can view challenges"
ON public.challenges FOR SELECT TO authenticated USING (true);

-- User challenges
CREATE POLICY "Users can view and manage their own challenge participation"
ON public.user_challenges FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Educational articles (public read for published)
CREATE POLICY "Anyone can view published articles"
ON public.educational_articles FOR SELECT TO authenticated USING (is_published = true);

-- User bookmarks
CREATE POLICY "Users can manage their own bookmarks"
ON public.user_bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Crisis resources (public read)
CREATE POLICY "Anyone can view crisis resources"
ON public.crisis_resources FOR SELECT TO authenticated USING (true);

-- Therapists (public read for active therapists)
CREATE POLICY "Anyone can view active therapists"
ON public.therapists FOR SELECT TO authenticated USING (is_accepting_clients = true);

-- Appointments
CREATE POLICY "Users can view their own appointments"
ON public.appointments FOR SELECT TO authenticated 
USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.therapists WHERE id = therapist_id));

CREATE POLICY "Clients can create appointments"
ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own appointments"
ON public.appointments FOR UPDATE TO authenticated 
USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.therapists WHERE id = therapist_id));

-- Health data
CREATE POLICY "Users can manage their own health data"
ON public.health_data FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
