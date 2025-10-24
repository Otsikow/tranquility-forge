-- Extend users_profile with personalization fields
ALTER TABLE public.users_profile
  ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS demographics jsonb DEFAULT '{}'::jsonb;

-- Indexes for users_profile
CREATE INDEX IF NOT EXISTS idx_users_profile_goals ON public.users_profile USING GIN (goals);

-- Extend meditations with categorization for recommendations
ALTER TABLE public.meditations
  ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS level text DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced'));

-- Indexes for meditations
CREATE INDEX IF NOT EXISTS idx_meditations_categories ON public.meditations USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_meditations_tags ON public.meditations USING GIN (tags);

-- Seed default categories/tags for existing demo data (best-effort)
UPDATE public.meditations
SET categories = CASE
  WHEN title ILIKE '%sleep%' THEN ARRAY['sleep']
  WHEN title ILIKE '%stress%' THEN ARRAY['stress']
  WHEN title ILIKE '%gratitude%' THEN ARRAY['gratitude']
  WHEN title ILIKE '%breathing%' OR title ILIKE '%breathe%' THEN ARRAY['breathing']
  ELSE ARRAY['mindfulness']
END,
    tags = CASE
  WHEN title ILIKE '%sleep%' THEN ARRAY['sleep','relaxation']
  WHEN title ILIKE '%stress%' THEN ARRAY['stress','relief']
  WHEN title ILIKE '%gratitude%' THEN ARRAY['gratitude','positivity']
  WHEN title ILIKE '%breathing%' OR title ILIKE '%breathe%' THEN ARRAY['breathing','focus']
  ELSE ARRAY['mindfulness','focus']
END
WHERE categories = '{}'::text[] OR tags = '{}'::text[];