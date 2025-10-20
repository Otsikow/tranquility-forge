-- Seed script for Peace app demo meditations
-- Run this after the main migration to populate demo content

-- Insert 6 demo meditations matching Stitch-style cards
INSERT INTO public.meditations (title, description, duration_seconds, cover_url, is_free) VALUES
  (
    'Morning Clarity',
    'Start your day with renewed focus and calm energy. This gentle meditation helps you set positive intentions and embrace the day ahead with mindfulness.',
    600,
    '/placeholder-meditation-1.jpg',
    true
  ),
  (
    'Stress Release',
    'Let go of tension and anxiety with this soothing guided meditation. Perfect for those overwhelming moments when you need to find your center.',
    480,
    '/placeholder-meditation-2.jpg',
    true
  ),
  (
    'Deep Sleep Journey',
    'Drift into peaceful slumber with calming visualizations and gentle breathing exercises. Wake up refreshed and restored.',
    1200,
    '/placeholder-meditation-3.jpg',
    true
  ),
  (
    'Mindful Breathing',
    'Master the art of conscious breathing. This foundational practice helps you anchor yourself in the present moment and reduce stress.',
    300,
    '/placeholder-meditation-4.jpg',
    true
  ),
  (
    'Gratitude Practice',
    'Cultivate appreciation and positive emotions through this heartwarming meditation. Shift your perspective and embrace abundance.',
    420,
    '/placeholder-meditation-5.jpg',
    true
  ),
  (
    'Inner Peace',
    'Journey to your calm center with this profound meditation. Discover tranquility within, no matter what''s happening around you.',
    900,
    '/placeholder-meditation-6.jpg',
    false
  );

-- Verify insertion
SELECT 
  id,
  title,
  duration_seconds / 60 as duration_minutes,
  is_free
FROM public.meditations
ORDER BY created_at;
