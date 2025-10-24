-- Phase 2: Seed Data
-- Sample data for forums, CBT exercises, sleep resources, and subscription tiers

-- ============================================================================
-- SUBSCRIPTION TIERS
-- ============================================================================

INSERT INTO public.subscription_tiers (name, display_name, description, price_monthly, price_yearly, features) VALUES
('free', 'Free', 'Perfect for getting started with mental wellness', 0, 0, '{
  "features": [
    "Basic meditations",
    "Journal entries",
    "Mood tracking",
    "AI chat (limited)",
    "Breathing exercises",
    "Community access (read-only)"
  ]
}'::jsonb),
('premium', 'Premium', 'Unlock advanced features and unlimited access', 9.99, 99.99, '{
  "features": [
    "All Free features",
    "Unlimited AI chat",
    "Premium meditations",
    "CBT tools and worksheets",
    "Sleep stories",
    "Community posting",
    "Support groups",
    "Priority support",
    "Ad-free experience"
  ]
}'::jsonb),
('pro', 'Pro', 'Complete mental wellness toolkit for professionals', 19.99, 199.99, '{
  "features": [
    "All Premium features",
    "Advanced analytics",
    "Personalized insights",
    "Unlimited sleep content",
    "Private support groups",
    "Export data",
    "Custom reminders",
    "1-on-1 coaching sessions (monthly)",
    "Early access to new features"
  ]
}'::jsonb);

-- ============================================================================
-- FORUMS
-- ============================================================================

INSERT INTO public.forums (name, description, icon) VALUES
('General Discussion', 'Share your thoughts, experiences, and connect with others', '💬'),
('Anxiety Support', 'Support and strategies for managing anxiety', '🌊'),
('Depression Support', 'A safe space to share and find support', '🌱'),
('Self-Care Tips', 'Share and discover self-care practices', '✨'),
('Success Stories', 'Celebrate wins and inspire others', '🎉'),
('Resources & Tools', 'Share helpful resources and tools', '📚');

-- ============================================================================
-- CBT EXERCISES
-- ============================================================================

INSERT INTO public.cbt_exercises (title, description, category, instructions, estimated_minutes, is_premium) VALUES
(
  'Thought Record',
  'Identify and challenge negative thought patterns',
  'thought_record',
  '{
    "steps": [
      {"label": "Situation", "type": "text", "placeholder": "What happened? Where were you?"},
      {"label": "Automatic Thought", "type": "textarea", "placeholder": "What went through your mind?"},
      {"label": "Emotions", "type": "emotions", "placeholder": "What did you feel? Rate intensity 1-10"},
      {"label": "Evidence For", "type": "textarea", "placeholder": "What supports this thought?"},
      {"label": "Evidence Against", "type": "textarea", "placeholder": "What evidence contradicts it?"},
      {"label": "Balanced Thought", "type": "textarea", "placeholder": "What is a more balanced perspective?"},
      {"label": "Emotions After", "type": "emotions", "placeholder": "How do you feel now?"}
    ]
  }'::jsonb,
  15,
  false
),
(
  'Behavioral Activation',
  'Plan activities to improve mood and energy',
  'behavioral_activation',
  '{
    "steps": [
      {"label": "Activity", "type": "text", "placeholder": "What activity will you do?"},
      {"label": "When", "type": "datetime", "placeholder": "When will you do it?"},
      {"label": "Anticipated Mood", "type": "slider", "min": 1, "max": 10},
      {"label": "Barriers", "type": "textarea", "placeholder": "What might get in the way?"},
      {"label": "Solutions", "type": "textarea", "placeholder": "How will you overcome barriers?"}
    ]
  }'::jsonb,
  10,
  false
),
(
  'Progressive Muscle Relaxation',
  'Reduce physical tension and anxiety',
  'relaxation',
  '{
    "steps": [
      {"label": "Preparation", "type": "info", "text": "Find a quiet space and get comfortable"},
      {"label": "Initial Tension", "type": "slider", "min": 1, "max": 10, "label": "Rate your tension"},
      {"label": "Body Scan", "type": "checklist", "options": ["Hands", "Arms", "Shoulders", "Neck", "Face", "Chest", "Stomach", "Legs", "Feet"]},
      {"label": "Final Tension", "type": "slider", "min": 1, "max": 10}
    ]
  }'::jsonb,
  20,
  true
),
(
  'Problem Solving',
  'Break down problems and find solutions',
  'problem_solving',
  '{
    "steps": [
      {"label": "Define Problem", "type": "textarea", "placeholder": "What is the problem?"},
      {"label": "Brainstorm Solutions", "type": "list", "placeholder": "List all possible solutions"},
      {"label": "Pros & Cons", "type": "proscons", "placeholder": "Evaluate each solution"},
      {"label": "Choose Solution", "type": "text", "placeholder": "Which solution will you try?"},
      {"label": "Action Plan", "type": "textarea", "placeholder": "What are the steps?"}
    ]
  }'::jsonb,
  15,
  false
),
(
  'Exposure Hierarchy',
  'Gradually face fears in a structured way',
  'exposure',
  '{
    "steps": [
      {"label": "Fear/Anxiety", "type": "text", "placeholder": "What are you avoiding?"},
      {"label": "Create Hierarchy", "type": "ranked-list", "placeholder": "List situations from least to most anxiety-provoking"},
      {"label": "Start Small", "type": "text", "placeholder": "Choose easiest step to start"},
      {"label": "Practice", "type": "textarea", "placeholder": "How will you practice?"}
    ]
  }'::jsonb,
  20,
  true
),
(
  'Mindful Observation',
  'Practice present-moment awareness',
  'mindfulness',
  '{
    "steps": [
      {"label": "Choose Object", "type": "text", "placeholder": "What will you observe?"},
      {"label": "Five Senses", "type": "textarea", "placeholder": "What do you notice with each sense?"},
      {"label": "Thoughts", "type": "textarea", "placeholder": "What thoughts arose?"},
      {"label": "Reflection", "type": "textarea", "placeholder": "What did you learn?"}
    ]
  }'::jsonb,
  10,
  false
);

-- ============================================================================
-- SLEEP STORIES
-- ============================================================================

INSERT INTO public.sleep_stories (title, description, narrator, duration_seconds, category, is_premium, cover_url) VALUES
('Journey to the Peaceful Valley', 'A gentle walk through a serene valley at twilight', 'Emma Thompson', 1800, 'nature', false, '/assets/sleep-valley.jpg'),
('The Ancient Library', 'Explore a mysterious library filled with forgotten tales', 'James Morgan', 2400, 'fantasy', true, '/assets/sleep-library.jpg'),
('Ocean Dreams', 'Float peacefully on calm ocean waters under the stars', 'Sarah Chen', 1500, 'nature', false, '/assets/sleep-ocean.jpg'),
('Mountain Cabin', 'Cozy evening in a remote mountain cabin', 'David Park', 2100, 'nature', true, '/assets/sleep-cabin.jpg'),
('Garden at Dusk', 'Stroll through a fragrant garden as day turns to night', 'Lisa Anderson', 1650, 'nature', false, '/assets/sleep-garden.jpg'),
('The Sleepy Train', 'A peaceful train journey through countryside', 'Michael Scott', 2700, 'travel', true, '/assets/sleep-train.jpg'),
('Starlight Meadow', 'Lie in a meadow watching the stars appear', 'Emily White', 1800, 'nature', false, '/assets/sleep-meadow.jpg'),
('Desert Twilight', 'Experience the magic of the desert at sunset', 'Ahmed Hassan', 2000, 'nature', true, '/assets/sleep-desert.jpg');

-- ============================================================================
-- SLEEP SOUNDSCAPES
-- ============================================================================

INSERT INTO public.sleep_soundscapes (title, description, category, is_premium, cover_url) VALUES
('Gentle Rain', 'Soft rainfall on leaves', 'rain', false, '/assets/sound-rain.jpg'),
('Ocean Waves', 'Rhythmic waves on a peaceful beach', 'ocean', false, '/assets/sound-ocean.jpg'),
('Forest Night', 'Crickets and gentle wind through trees', 'forest', false, '/assets/sound-forest.jpg'),
('White Noise', 'Pure white noise for deep sleep', 'white_noise', false, '/assets/sound-white.jpg'),
('Thunder Storm', 'Distant thunder with steady rain', 'rain', true, '/assets/sound-thunder.jpg'),
('Mountain Stream', 'Babbling brook in the mountains', 'nature', true, '/assets/sound-stream.jpg'),
('Pink Noise', 'Balanced pink noise for relaxation', 'white_noise', false, '/assets/sound-pink.jpg'),
('Desert Wind', 'Soft wind across sand dunes', 'nature', true, '/assets/sound-wind.jpg'),
('Campfire', 'Crackling fire under the stars', 'ambient', true, '/assets/sound-fire.jpg'),
('City Rain', 'Rain on city streets at night', 'rain', true, '/assets/sound-city.jpg');

-- ============================================================================
-- SAMPLE FORUM POSTS (for demo)
-- ============================================================================

-- Note: These will need actual user_ids after users are created
-- This is just to show the structure

-- INSERT INTO public.forum_posts (forum_id, user_id, title, content) VALUES
-- ((SELECT id FROM public.forums WHERE name = 'General Discussion'), 'user_id_here', 'Welcome to the Community!', 'Hello everyone! Let''s support each other on this journey.');
