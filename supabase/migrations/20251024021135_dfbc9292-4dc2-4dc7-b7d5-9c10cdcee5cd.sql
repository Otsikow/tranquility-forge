-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER,
  max_score INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  severity TEXT NOT NULL,
  interpretation TEXT,
  recommendations TEXT[],
  resources TEXT[],
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_progress table
CREATE TABLE IF NOT EXISTS public.assessment_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  current_question INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CBT tables
CREATE TABLE IF NOT EXISTS public.cbt_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cbt_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.cbt_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT NOT NULL,
  exercise_type TEXT NOT NULL CHECK (exercise_type IN ('worksheet', 'interactive', 'reflection', 'behavioral')),
  estimated_duration INTEGER,
  difficulty_level INTEGER,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cbt_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.cbt_exercises(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  responses JSONB,
  score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum tables
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[],
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sleep tables
CREATE TABLE IF NOT EXISTS public.sleep_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  narrator TEXT,
  background_sound_url TEXT,
  cover_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.soundscapes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  category TEXT NOT NULL,
  is_loopable BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sleep_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIME,
  wake_time TIME,
  sleep_duration INTEGER,
  sleep_quality INTEGER,
  mood_before_sleep INTEGER,
  mood_after_sleep INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cbt_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soundscapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for assessments (public read)
CREATE POLICY "Anyone can view assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Admins can manage assessments" ON public.assessments FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for assessment_results
CREATE POLICY "Users can view own results" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for assessment_progress
CREATE POLICY "Users can view own progress" ON public.assessment_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.assessment_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.assessment_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress" ON public.assessment_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for CBT tables
CREATE POLICY "Anyone can view categories" ON public.cbt_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view exercises" ON public.cbt_exercises FOR SELECT USING (true);
CREATE POLICY "Users can view own progress" ON public.cbt_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.cbt_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.cbt_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for forum
CREATE POLICY "Anyone can view categories" ON public.forum_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for sleep
CREATE POLICY "Anyone can view sleep stories" ON public.sleep_stories FOR SELECT USING (true);
CREATE POLICY "Anyone can view soundscapes" ON public.soundscapes FOR SELECT USING (true);
CREATE POLICY "Users can view own tracking" ON public.sleep_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracking" ON public.sleep_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracking" ON public.sleep_tracking FOR UPDATE USING (auth.uid() = user_id);

-- Create assessment RPC functions
CREATE OR REPLACE FUNCTION public.save_assessment_progress(
  p_user_id UUID,
  p_assessment_type TEXT,
  p_current_question INTEGER,
  p_answers JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_progress_id UUID;
BEGIN
  INSERT INTO public.assessment_progress (user_id, assessment_type, current_question, answers)
  VALUES (p_user_id, p_assessment_type, p_current_question, p_answers)
  ON CONFLICT (user_id, assessment_type) 
  DO UPDATE SET 
    current_question = p_current_question,
    answers = p_answers,
    updated_at = now()
  RETURNING id INTO v_progress_id;
  
  RETURN v_progress_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_assessment_progress(
  p_user_id UUID,
  p_assessment_type TEXT
) RETURNS TABLE (
  id UUID,
  current_question INTEGER,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ap.id, ap.current_question, ap.answers, ap.started_at
  FROM public.assessment_progress ap
  WHERE ap.user_id = p_user_id AND ap.assessment_type = p_assessment_type;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_assessment(
  p_user_id UUID,
  p_assessment_type TEXT,
  p_score INTEGER,
  p_severity TEXT,
  p_interpretation TEXT,
  p_recommendations TEXT[],
  p_resources TEXT[],
  p_responses JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result_id UUID;
BEGIN
  INSERT INTO public.assessment_results (
    user_id, assessment_type, score, severity, interpretation, 
    recommendations, resources, responses
  )
  VALUES (
    p_user_id, p_assessment_type, p_score, p_severity, p_interpretation,
    p_recommendations, p_resources, p_responses
  )
  RETURNING id INTO v_result_id;
  
  DELETE FROM public.assessment_progress 
  WHERE user_id = p_user_id AND assessment_type = p_assessment_type;
  
  RETURN v_result_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_assessment_history(
  p_user_id UUID,
  p_assessment_type TEXT
) RETURNS TABLE (
  id UUID,
  score INTEGER,
  severity TEXT,
  interpretation TEXT,
  recommendations TEXT[],
  resources TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ar.id, ar.score, ar.severity, ar.interpretation, 
         ar.recommendations, ar.resources, ar.completed_at
  FROM public.assessment_results ar
  WHERE ar.user_id = p_user_id AND ar.assessment_type = p_assessment_type
  ORDER BY ar.completed_at DESC;
END;
$$;

-- Add unique constraint for assessment_progress
CREATE UNIQUE INDEX IF NOT EXISTS assessment_progress_user_type_idx 
ON public.assessment_progress(user_id, assessment_type);

-- Add triggers for updated_at
CREATE TRIGGER update_assessments_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessment_progress_updated_at
BEFORE UPDATE ON public.assessment_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
BEFORE UPDATE ON public.forum_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();