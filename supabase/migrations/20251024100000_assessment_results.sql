-- Assessment Results Migration
-- Create table to store user assessment results

-- Create enum for assessment types
CREATE TYPE public.assessment_type AS ENUM (
  'phq9',
  'gad7',
  'pss10',
  'sleep_hygiene'
);

-- Create enum for severity levels
CREATE TYPE public.severity_level AS ENUM (
  'minimal',
  'mild',
  'moderate',
  'moderately_severe',
  'severe'
);

-- Create assessment_results table
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type assessment_type NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  severity_level severity_level NOT NULL,
  interpretation TEXT NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  resources TEXT[] DEFAULT '{}',
  answers JSONB NOT NULL, -- Store all question answers
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "Users can delete their own assessment results"
ON public.assessment_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_assessment_results_user_id_completed_at 
ON public.assessment_results(user_id, completed_at DESC);

CREATE INDEX idx_assessment_results_assessment_type 
ON public.assessment_results(assessment_type);

CREATE INDEX idx_assessment_results_user_id_assessment_type 
ON public.assessment_results(user_id, assessment_type, completed_at DESC);

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
  max_score INTEGER,
  severity_level severity_level,
  completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_assessment_type IS NULL THEN
    RETURN QUERY
    SELECT 
      ar.id,
      ar.assessment_type,
      ar.score,
      ar.max_score,
      ar.severity_level,
      ar.completed_at
    FROM public.assessment_results ar
    WHERE ar.user_id = p_user_id
    ORDER BY ar.completed_at DESC
    LIMIT p_limit;
  ELSE
    RETURN QUERY
    SELECT 
      ar.id,
      ar.assessment_type,
      ar.score,
      ar.max_score,
      ar.severity_level,
      ar.completed_at
    FROM public.assessment_results ar
    WHERE ar.user_id = p_user_id
      AND ar.assessment_type = p_assessment_type
    ORDER BY ar.completed_at DESC
    LIMIT p_limit;
  END IF;
END;
$$;

-- Create function to get latest assessment result for each type
CREATE OR REPLACE FUNCTION public.get_latest_assessments(p_user_id UUID)
RETURNS TABLE(
  assessment_type assessment_type,
  score INTEGER,
  max_score INTEGER,
  severity_level severity_level,
  completed_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (ar.assessment_type)
    ar.assessment_type,
    ar.score,
    ar.max_score,
    ar.severity_level,
    ar.completed_at
  FROM public.assessment_results ar
  WHERE ar.user_id = p_user_id
  ORDER BY ar.assessment_type, ar.completed_at DESC;
END;
$$;

-- Create function to get assessment statistics
CREATE OR REPLACE FUNCTION public.get_assessment_stats(
  p_user_id UUID,
  p_assessment_type assessment_type
)
RETURNS TABLE(
  total_count BIGINT,
  avg_score NUMERIC,
  min_score INTEGER,
  max_score INTEGER,
  latest_score INTEGER,
  trend TEXT -- 'improving', 'stable', 'worsening'
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prev_score INTEGER;
  curr_score INTEGER;
BEGIN
  -- Get basic stats
  SELECT 
    COUNT(*),
    AVG(ar.score),
    MIN(ar.score),
    MAX(ar.score),
    (SELECT score FROM public.assessment_results 
     WHERE user_id = p_user_id AND assessment_type = p_assessment_type 
     ORDER BY completed_at DESC LIMIT 1)
  INTO total_count, avg_score, min_score, max_score, latest_score
  FROM public.assessment_results ar
  WHERE ar.user_id = p_user_id
    AND ar.assessment_type = p_assessment_type;
  
  -- Calculate trend
  IF total_count >= 2 THEN
    SELECT ar.score INTO prev_score
    FROM public.assessment_results ar
    WHERE ar.user_id = p_user_id
      AND ar.assessment_type = p_assessment_type
    ORDER BY ar.completed_at DESC
    OFFSET 1 LIMIT 1;
    
    curr_score := latest_score;
    
    IF curr_score < prev_score THEN
      trend := 'improving';
    ELSIF curr_score > prev_score THEN
      trend := 'worsening';
    ELSE
      trend := 'stable';
    END IF;
  ELSE
    trend := 'insufficient_data';
  END IF;
  
  RETURN QUERY SELECT total_count, avg_score, min_score, max_score, latest_score, trend;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_assessment_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_latest_assessments TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_assessment_stats TO authenticated;
