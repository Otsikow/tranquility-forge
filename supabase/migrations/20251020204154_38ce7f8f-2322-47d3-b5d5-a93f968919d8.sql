-- Create storage bucket for meditation audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('meditations', 'meditations', true);

-- RLS policies for meditation audio
CREATE POLICY "Public can view meditation files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'meditations');

-- Admins can upload meditation files
CREATE POLICY "Admins can upload meditation files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'meditations' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Admins can update meditation files
CREATE POLICY "Admins can update meditation files"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'meditations' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Admins can delete meditation files
CREATE POLICY "Admins can delete meditation files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'meditations' 
    AND (SELECT has_role(auth.uid(), 'admin'::app_role))
  );

-- Create downloads table for tracking offline downloads
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  meditation_id UUID NOT NULL REFERENCES public.meditations(id) ON DELETE CASCADE,
  file_size BIGINT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  evicted BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Users can view their own downloads
CREATE POLICY "Users can view own downloads"
  ON public.downloads
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own downloads
CREATE POLICY "Users can create own downloads"
  ON public.downloads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own downloads
CREATE POLICY "Users can update own downloads"
  ON public.downloads
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own downloads
CREATE POLICY "Users can delete own downloads"
  ON public.downloads
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX idx_downloads_meditation_id ON public.downloads(meditation_id);
CREATE INDEX idx_downloads_last_accessed ON public.downloads(last_accessed_at);

-- Function to get user's total download size
CREATE OR REPLACE FUNCTION public.get_user_download_size(p_user_id UUID)
RETURNS BIGINT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(file_size), 0)
  FROM public.downloads
  WHERE user_id = p_user_id AND evicted = false;
$$;