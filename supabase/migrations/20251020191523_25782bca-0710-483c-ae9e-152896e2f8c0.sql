-- Create users_profile table (1:1 with auth.users)
CREATE TABLE public.users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood int CHECK (mood BETWEEN 1 AND 10),
  title text,
  content text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create meditations table
CREATE TABLE public.meditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_seconds int NOT NULL,
  cover_url text,
  audio_url text,
  is_free boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create sessions_played table
CREATE TABLE public.sessions_played (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meditation_id uuid NOT NULL REFERENCES public.meditations(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes for better query performance
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_sessions_played_user_id ON public.sessions_played(user_id);
CREATE INDEX idx_sessions_played_meditation_id ON public.sessions_played(meditation_id);

-- Enable RLS (will add policies later)
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_played ENABLE ROW LEVEL SECURITY;

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users_profile (id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();