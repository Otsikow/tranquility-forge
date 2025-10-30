-- Phase 2 core features: Community, CBT, Sleep, Subscriptions
-- Generated on 2025-10-24

-- Safety: required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================
-- Community: Forums/Groups/Sharing
-- =============================

-- Forums
CREATE TABLE IF NOT EXISTS public.community_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forums"
  ON public.community_forums FOR SELECT USING (true);

CREATE POLICY "Admins can manage forums"
  ON public.community_forums FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- Threads
CREATE TABLE IF NOT EXISTS public.community_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID NOT NULL REFERENCES public.community_forums(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  pinned BOOLEAN NOT NULL DEFAULT false,
  locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_community_threads_forum ON public.community_threads(forum_id);
CREATE INDEX IF NOT EXISTS idx_community_threads_created_at ON public.community_threads(created_at DESC);

ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view threads"
  ON public.community_threads FOR SELECT USING (true);

CREATE POLICY "Users can create own threads"
  ON public.community_threads FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors or admins can update threads"
  ON public.community_threads FOR UPDATE
  USING (auth.uid() = author_id OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Authors or admins can delete threads"
  ON public.community_threads FOR DELETE
  USING (auth.uid() = author_id OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- Posts (replies)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.community_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_community_posts_thread ON public.community_posts(thread_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Users can create own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors or admins can update posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = author_id OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Authors or admins can delete posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = author_id OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- Post reactions (likes, etc.)
CREATE TABLE IF NOT EXISTS public.community_post_reactions (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL DEFAULT 'like', -- future-proof for multiple reactions
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id, reaction)
);

ALTER TABLE public.community_post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON public.community_post_reactions FOR SELECT USING (true);

CREATE POLICY "Users can react as self"
  ON public.community_post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON public.community_post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Peer support groups
CREATE TABLE IF NOT EXISTS public.support_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;

-- Helper: check membership
CREATE OR REPLACE FUNCTION public.is_support_group_member(p_user_id UUID, p_group_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.support_group_members m
    WHERE m.group_id = p_group_id AND m.user_id = p_user_id
  )
$$;

CREATE POLICY "Visible groups"
  ON public.support_groups FOR SELECT
  USING (
    NOT is_private
    OR owner_id = auth.uid()
    OR public.is_support_group_member(auth.uid(), id)
  );

CREATE POLICY "Users can create group they own"
  ON public.support_groups FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Only owners or admins can update groups"
  ON public.support_groups FOR UPDATE
  USING (owner_id = auth.uid() OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Only owners or admins can delete groups"
  ON public.support_groups FOR DELETE
  USING (owner_id = auth.uid() OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- Group members
CREATE TYPE IF NOT EXISTS public.group_member_role AS ENUM ('owner','moderator','member');

CREATE TABLE IF NOT EXISTS public.support_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.group_member_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

ALTER TABLE public.support_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view membership"
  ON public.support_group_members FOR SELECT
  USING (public.is_support_group_member(auth.uid(), group_id) OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Owners/admins manage membership"
  ON public.support_group_members FOR ALL
  USING (
    (SELECT owner_id FROM public.support_groups g WHERE g.id = group_id) = auth.uid()
    OR (SELECT has_role(auth.uid(), 'admin'::public.app_role))
  )
  WITH CHECK (
    (SELECT owner_id FROM public.support_groups g WHERE g.id = group_id) = auth.uid()
    OR (SELECT has_role(auth.uid(), 'admin'::public.app_role))
  );

-- Content sharing
CREATE TYPE IF NOT EXISTS public.content_visibility AS ENUM ('public','group','private');

CREATE TABLE IF NOT EXISTS public.shared_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  media_url TEXT,
  visibility public.content_visibility NOT NULL DEFAULT 'public',
  group_id UUID REFERENCES public.support_groups(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shared_content_author ON public.shared_content(author_id);
CREATE INDEX IF NOT EXISTS idx_shared_content_created_at ON public.shared_content(created_at DESC);

ALTER TABLE public.shared_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Readable according to visibility"
  ON public.shared_content FOR SELECT
  USING (
    visibility = 'public'::public.content_visibility
    OR author_id = auth.uid()
    OR (
      visibility = 'group'::public.content_visibility AND group_id IS NOT NULL
      AND public.is_support_group_member(auth.uid(), group_id)
    )
    OR (SELECT has_role(auth.uid(), 'admin'::public.app_role))
  );

CREATE POLICY "Users can create own shared content"
  ON public.shared_content FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors or admins can update content"
  ON public.shared_content FOR UPDATE
  USING (author_id = auth.uid() OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE POLICY "Authors or admins can delete content"
  ON public.shared_content FOR DELETE
  USING (author_id = auth.uid() OR (SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- =============================
-- CBT: Worksheets & Entries
-- =============================

CREATE TABLE IF NOT EXISTS public.cbt_worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  schema JSONB NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cbt_worksheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view worksheets"
  ON public.cbt_worksheets FOR SELECT USING (true);

CREATE POLICY "Admins can manage worksheets"
  ON public.cbt_worksheets FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE TABLE IF NOT EXISTS public.cbt_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worksheet_id UUID NOT NULL REFERENCES public.cbt_worksheets(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  mood_before INT CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INT CHECK (mood_after BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cbt_entries_user ON public.cbt_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_cbt_entries_worksheet ON public.cbt_entries(worksheet_id);
CREATE INDEX IF NOT EXISTS idx_cbt_entries_created_at ON public.cbt_entries(created_at DESC);

ALTER TABLE public.cbt_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cbt entries"
  ON public.cbt_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cbt entries"
  ON public.cbt_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cbt entries"
  ON public.cbt_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cbt entries"
  ON public.cbt_entries FOR DELETE
  USING (auth.uid() = user_id);

-- =============================
-- Sleep: Stories, Soundscapes, Sessions
-- =============================

CREATE TABLE IF NOT EXISTS public.sleep_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT NOT NULL,
  cover_url TEXT,
  audio_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sleep_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sleep stories"
  ON public.sleep_stories FOR SELECT USING (true);

CREATE POLICY "Admins can manage sleep stories"
  ON public.sleep_stories FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE TABLE IF NOT EXISTS public.soundscapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT,
  cover_url TEXT,
  audio_url TEXT,
  is_free BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.soundscapes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view soundscapes"
  ON public.soundscapes FOR SELECT USING (true);

CREATE POLICY "Admins can manage soundscapes"
  ON public.soundscapes FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE TABLE IF NOT EXISTS public.sleep_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES public.sleep_stories(id) ON DELETE SET NULL,
  soundscape_id UUID REFERENCES public.soundscapes(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  notes TEXT,
  CHECK (
    (story_id IS NOT NULL AND soundscape_id IS NULL)
    OR (story_id IS NULL AND soundscape_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_sleep_sessions_user ON public.sleep_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_sessions_started_at ON public.sleep_sessions(started_at DESC);

ALTER TABLE public.sleep_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep sessions"
  ON public.sleep_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sleep sessions"
  ON public.sleep_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep sessions"
  ON public.sleep_sessions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep sessions"
  ON public.sleep_sessions FOR DELETE USING (auth.uid() = user_id);

-- =============================
-- Subscriptions & Monetization
-- =============================

CREATE TYPE IF NOT EXISTS public.billing_interval AS ENUM ('month','year');
CREATE TYPE IF NOT EXISTS public.subscription_status AS ENUM ('active','canceled','past_due','trialing');

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key TEXT UNIQUE NOT NULL, -- e.g., free, premium, pro
  name TEXT NOT NULL,
  price_cents INT NOT NULL DEFAULT 0,
  interval public.billing_interval NOT NULL DEFAULT 'month',
  features JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT USING (true);

CREATE POLICY "Admins can manage subscription plans"
  ON public.subscription_plans FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status public.subscription_status NOT NULL DEFAULT 'active',
  provider TEXT, -- e.g., stripe, paddle, internal
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.user_subscriptions FOR ALL
  USING ((SELECT has_role(auth.uid(), 'admin'::public.app_role)))
  WITH CHECK ((SELECT has_role(auth.uid(), 'admin'::public.app_role)));

-- =============================
-- End of migration
-- =============================
