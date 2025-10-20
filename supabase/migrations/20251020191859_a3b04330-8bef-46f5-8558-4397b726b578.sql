-- Add RLS policies for users_profile
CREATE POLICY "Users can view own profile"
  ON public.users_profile
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users_profile
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
  ON public.users_profile
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add RLS policies for journal_entries
CREATE POLICY "Users can view own journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add RLS policies for sessions_played
CREATE POLICY "Users can view own sessions"
  ON public.sessions_played
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.sessions_played
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON public.sessions_played
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add RLS policies for meditations (public read, admin write)
CREATE POLICY "Anyone can view meditations"
  ON public.meditations
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert meditations"
  ON public.meditations
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update meditations"
  ON public.meditations
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete meditations"
  ON public.meditations
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));