-- Assessment System Migration
-- Creates tables for storing assessment results and tracking progress

-- Create enum for assessment types
CREATE TYPE public.assessment_type AS ENUM (
  'phq9',
  'gad7', 
  'pss10',
  'sleep_hygiene'
);

-- Create enum for assessment severity levels
CREATE TYPE public.assessment_severity AS ENUM (
  'minimal',
  'mild',
  'moderate',
  'moderately_severe',
  'severe'
);

-- Create assessments table to store assessment definitions
CREATE TABLE public.assessments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER,
  max_score INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment results table
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type assessment_type NOT NULL,
  score INTEGER NOT NULL,
  severity assessment_severity NOT NULL,
  interpretation TEXT,
  recommendations TEXT[],
  resources TEXT[],
  responses JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment progress tracking table
CREATE TABLE public.assessment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type assessment_type NOT NULL,
  current_question INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, assessment_type)
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessments (read-only for all authenticated users)
CREATE POLICY "Anyone can view active assessments"
ON public.assessments
FOR SELECT
TO authenticated
USING (is_active = true);

-- RLS Policies for assessment_results
CREATE POLICY "Users can view their own assessment results"
ON public.assessment_results
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results"
ON public.assessment_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment results"
ON public.assessment_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for assessment_progress
CREATE POLICY "Users can view their own assessment progress"
ON public.assessment_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment progress"
ON public.assessment_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment progress"
ON public.assessment_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_assessment_results_user_id_created_at ON public.assessment_results(user_id, created_at DESC);
CREATE INDEX idx_assessment_results_assessment_type ON public.assessment_results(assessment_type);
CREATE INDEX idx_assessment_progress_user_id ON public.assessment_progress(user_id);

-- Insert default assessment definitions
INSERT INTO public.assessments (id, name, description, category, duration_minutes, max_score) VALUES
('phq9', 'PHQ-9 Depression Screening', 'A validated 9-question screening tool for depression', 'Mental Health', 10, 27),
('gad7', 'GAD-7 Anxiety Screening', 'A validated 7-question screening tool for anxiety', 'Mental Health', 7, 21),
('pss10', 'PSS-10 Stress Scale', 'A 10-question scale to measure perceived stress', 'Stress', 5, 40),
('sleep_hygiene', 'Sleep Hygiene Assessment', 'Evaluate your sleep habits and quality', 'Sleep', 5, 30);

-- Create function to save assessment progress
CREATE OR REPLACE FUNCTION public.save_assessment_progress(
  p_user_id UUID,
  p_assessment_type assessment_type,
  p_current_question INTEGER,
  p_answers JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.assessment_progress (
    user_id,
    assessment_type,
    current_question,
    answers,
    updated_at
  ) VALUES (
    p_user_id,
    p_assessment_type,
    p_current_question,
    p_answers,
    NOW()
  )
  ON CONFLICT (user_id, assessment_type)
  DO UPDATE SET
    current_question = EXCLUDED.current_question,
    answers = EXCLUDED.answers,
    updated_at = NOW();
END;
$$;

-- Create function to complete assessment
CREATE OR REPLACE FUNCTION public.complete_assessment(
  p_user_id UUID,
  p_assessment_type assessment_type,
  p_score INTEGER,
  p_severity assessment_severity,
  p_interpretation TEXT,
  p_recommendations TEXT[],
  p_resources TEXT[],
  p_responses JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id UUID;
BEGIN
  -- Insert assessment result
  INSERT INTO public.assessment_results (
    user_id,
    assessment_type,
    score,
    severity,
    interpretation,
    recommendations,
    resources,
    responses
  ) VALUES (
    p_user_id,
    p_assessment_type,
    p_score,
    p_severity,
    p_interpretation,
    p_recommendations,
    p_resources,
    p_responses
  ) RETURNING id INTO result_id;
  
  -- Clear progress for this assessment
  DELETE FROM public.assessment_progress 
  WHERE user_id = p_user_id AND assessment_type = p_assessment_type;
  
  -- Log activity
  PERFORM public.log_user_activity(
    p_user_id,
    'assessment',
    result_id,
    NULL,
    jsonb_build_object(
      'assessment_type', p_assessment_type,
      'score', p_score,
      'severity', p_severity
    )
  );
  
  RETURN result_id;
END;
$$;

-- Create function to get assessment history
CREATE OR REPLACE FUNCTION public.get_assessment_history(
  p_user_id UUID,
  p_assessment_type assessment_type DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  id UUID,
  assessment_type assessment_type,
  score INTEGER,
  severity assessment_severity,
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
  SELECT 
    ar.id,
    ar.assessment_type,
    ar.score,
    ar.severity,
    ar.interpretation,
    ar.recommendations,
    ar.resources,
    ar.completed_at
  FROM public.assessment_results ar
  WHERE ar.user_id = p_user_id
    AND (p_assessment_type IS NULL OR ar.assessment_type = p_assessment_type)
  ORDER BY ar.completed_at DESC
  LIMIT p_limit;
END;
$$;

-- Create function to get assessment progress
CREATE OR REPLACE FUNCTION public.get_assessment_progress(
  p_user_id UUID,
  p_assessment_type assessment_type
)
RETURNS TABLE(
  current_question INTEGER,
  answers JSONB,
  started_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ap.current_question,
    ap.answers,
    ap.started_at
  FROM public.assessment_progress ap
  WHERE ap.user_id = p_user_id 
    AND ap.assessment_type = p_assessment_type;
END;
$$;