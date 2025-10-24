-- Seed data for competitive features

-- Insert meditation categories
INSERT INTO public.meditation_categories (name, description, icon) VALUES
  ('Stress Relief', 'Meditations to help reduce stress and tension', '😌'),
  ('Sleep', 'Guided sessions for better sleep', '😴'),
  ('Anxiety', 'Tools to manage anxiety and worry', '🧘'),
  ('Focus', 'Improve concentration and productivity', '🎯'),
  ('Gratitude', 'Cultivate appreciation and positivity', '🙏'),
  ('Mindfulness', 'Present moment awareness', '🌟'),
  ('Body Scan', 'Progressive relaxation techniques', '💆'),
  ('Breathing', 'Breathwork exercises', '🌬️')
ON CONFLICT (name) DO NOTHING;

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points_reward) VALUES
  ('First Step', 'Complete your first meditation', '🌱', 'meditation', 'count', 1, 10),
  ('Week Warrior', '7-day meditation streak', '🔥', 'streak', 'streak', 7, 50),
  ('Mindful Month', '30-day meditation streak', '🏆', 'streak', 'streak', 30, 200),
  ('Journaling Beginner', 'Write your first journal entry', '📝', 'journal', 'count', 1, 10),
  ('Consistent Writer', '7-day journaling streak', '✍️', 'streak', 'streak', 7, 50),
  ('Meditation Master', 'Complete 100 meditations', '🧘‍♂️', 'meditation', 'count', 100, 300),
  ('Deep Relaxation', 'Meditate for 1000 minutes total', '⏰', 'meditation', 'time', 1000, 250),
  ('Community Helper', 'Help 10 people in community', '🤝', 'social', 'count', 10, 100),
  ('Self-Aware', 'Complete your first self-assessment', '📊', 'milestone', 'count', 1, 25),
  ('Early Bird', 'Meditate at 6 AM', '🌅', 'special', 'special', 0, 50)
ON CONFLICT DO NOTHING;

-- Insert self-assessment templates

-- PHQ-9 (Depression Screening)
INSERT INTO public.assessments (name, type, description, questions, scoring) VALUES
  ('PHQ-9', 'PHQ-9', 'Patient Health Questionnaire - measures depression severity',
  '[
    {"id": 1, "text": "Little interest or pleasure in doing things", "scale": [0, 1, 2, 3]},
    {"id": 2, "text": "Feeling down, depressed, or hopeless", "scale": [0, 1, 2, 3]},
    {"id": 3, "text": "Trouble falling or staying asleep, or sleeping too much", "scale": [0, 1, 2, 3]},
    {"id": 4, "text": "Feeling tired or having little energy", "scale": [0, 1, 2, 3]},
    {"id": 5, "text": "Poor appetite or overeating", "scale": [0, 1, 2, 3]},
    {"id": 6, "text": "Feeling bad about yourself - or that you are a failure", "scale": [0, 1, 2, 3]},
    {"id": 7, "text": "Trouble concentrating on things", "scale": [0, 1, 2, 3]},
    {"id": 8, "text": "Moving or speaking slowly, or being fidgety/restless", "scale": [0, 1, 2, 3]},
    {"id": 9, "text": "Thoughts that you would be better off dead", "scale": [0, 1, 2, 3]}
  ]',
  '{
    "scale_labels": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    "ranges": [
      {"min": 0, "max": 4, "severity": "minimal", "recommendation": "No treatment needed, continue self-care"},
      {"min": 5, "max": 9, "severity": "mild", "recommendation": "Consider support groups and mindfulness practices"},
      {"min": 10, "max": 14, "severity": "moderate", "recommendation": "Therapy and active monitoring recommended"},
      {"min": 15, "max": 19, "severity": "moderately severe", "recommendation": "Therapy or medication strongly recommended"},
      {"min": 20, "max": 27, "severity": "severe", "recommendation": "Immediate treatment with therapy and medication recommended"}
    ]
  }'
);

-- GAD-7 (Anxiety Screening)
INSERT INTO public.assessments (name, type, description, questions, scoring) VALUES
  ('GAD-7', 'GAD-7', 'Generalized Anxiety Disorder 7-item scale',
  '[
    {"id": 1, "text": "Feeling nervous, anxious, or on edge", "scale": [0, 1, 2, 3]},
    {"id": 2, "text": "Not being able to stop or control worrying", "scale": [0, 1, 2, 3]},
    {"id": 3, "text": "Worrying too much about different things", "scale": [0, 1, 2, 3]},
    {"id": 4, "text": "Trouble relaxing", "scale": [0, 1, 2, 3]},
    {"id": 5, "text": "Being so restless that it is hard to sit still", "scale": [0, 1, 2, 3]},
    {"id": 6, "text": "Becoming easily annoyed or irritable", "scale": [0, 1, 2, 3]},
    {"id": 7, "text": "Feeling afraid, as if something awful might happen", "scale": [0, 1, 2, 3]}
  ]',
  '{
    "scale_labels": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
    "ranges": [
      {"min": 0, "max": 4, "severity": "minimal", "recommendation": "No treatment needed, continue mindfulness practice"},
      {"min": 5, "max": 9, "severity": "mild", "recommendation": "Self-help strategies and breathing exercises"},
      {"min": 10, "max": 14, "severity": "moderate", "recommendation": "Consider CBT or therapy"},
      {"min": 15, "max": 21, "severity": "severe", "recommendation": "Professional treatment strongly recommended"}
    ]
  }'
);

-- PSS-10 (Perceived Stress Scale)
INSERT INTO public.assessments (name, type, description, questions, scoring) VALUES
  ('PSS-10', 'PSS-10', 'Perceived Stress Scale - 10 item version',
  '[
    {"id": 1, "text": "Been upset because of something that happened unexpectedly", "scale": [0, 1, 2, 3, 4], "reverse": false},
    {"id": 2, "text": "Felt unable to control important things in your life", "scale": [0, 1, 2, 3, 4], "reverse": false},
    {"id": 3, "text": "Felt nervous and stressed", "scale": [0, 1, 2, 3, 4], "reverse": false},
    {"id": 4, "text": "Felt confident about handling personal problems", "scale": [0, 1, 2, 3, 4], "reverse": true},
    {"id": 5, "text": "Felt that things were going your way", "scale": [0, 1, 2, 3, 4], "reverse": true},
    {"id": 6, "text": "Found that you could not cope with all the things you had to do", "scale": [0, 1, 2, 3, 4], "reverse": false},
    {"id": 7, "text": "Been able to control irritations in your life", "scale": [0, 1, 2, 3, 4], "reverse": true},
    {"id": 8, "text": "Felt that you were on top of things", "scale": [0, 1, 2, 3, 4], "reverse": true},
    {"id": 9, "text": "Been angered because of things outside of your control", "scale": [0, 1, 2, 3, 4], "reverse": false},
    {"id": 10, "text": "Felt difficulties were piling up so high you could not overcome them", "scale": [0, 1, 2, 3, 4], "reverse": false}
  ]',
  '{
    "scale_labels": ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"],
    "ranges": [
      {"min": 0, "max": 13, "severity": "low", "recommendation": "Stress is well-managed, maintain current practices"},
      {"min": 14, "max": 26, "severity": "moderate", "recommendation": "Consider stress reduction techniques and meditation"},
      {"min": 27, "max": 40, "severity": "high", "recommendation": "Seek support, therapy, and stress management programs"}
    ]
  }'
);

-- Insert sample CBT exercises
INSERT INTO public.cbt_exercises (title, description, category, content, duration_minutes, difficulty_level) VALUES
  (
    'Thought Record',
    'Identify and challenge negative thought patterns',
    'thought_record',
    '{
      "steps": [
        {"title": "Situation", "prompt": "What situation or event triggered this thought?"},
        {"title": "Automatic Thought", "prompt": "What went through your mind? What did you tell yourself?"},
        {"title": "Evidence For", "prompt": "What evidence supports this thought?"},
        {"title": "Evidence Against", "prompt": "What evidence contradicts this thought?"},
        {"title": "Alternative Thought", "prompt": "What is a more balanced way to think about this?"},
        {"title": "Outcome", "prompt": "How do you feel now after examining this thought?"}
      ]
    }',
    15,
    'beginner'
  ),
  (
    'Behavioral Activation',
    'Plan activities that bring you joy and accomplishment',
    'behavioral_activation',
    '{
      "steps": [
        {"title": "Activity", "prompt": "What activity will you do?"},
        {"title": "When", "prompt": "When will you do this activity?"},
        {"title": "Predicted Enjoyment", "prompt": "On a scale of 1-10, how much do you think you will enjoy it?"},
        {"title": "Predicted Accomplishment", "prompt": "On a scale of 1-10, how accomplished will you feel?"},
        {"title": "Actual Enjoyment", "prompt": "After doing it, how much did you actually enjoy it? (1-10)"},
        {"title": "Actual Accomplishment", "prompt": "How accomplished did you actually feel? (1-10)"},
        {"title": "Reflection", "prompt": "What did you learn from this experience?"}
      ]
    }',
    20,
    'beginner'
  ),
  (
    'Cognitive Restructuring',
    'Transform unhelpful thinking patterns',
    'cognitive_restructuring',
    '{
      "common_distortions": [
        "All-or-Nothing Thinking",
        "Overgeneralization",
        "Mental Filter",
        "Discounting the Positive",
        "Jumping to Conclusions",
        "Magnification or Minimization",
        "Emotional Reasoning",
        "Should Statements",
        "Labeling",
        "Personalization"
      ],
      "steps": [
        {"title": "Negative Thought", "prompt": "What is the negative thought?"},
        {"title": "Identify Distortion", "prompt": "Which cognitive distortion is this? Select from the list above."},
        {"title": "Challenge", "prompt": "How can you challenge this distortion?"},
        {"title": "Reframe", "prompt": "Write a more realistic, balanced thought"}
      ]
    }',
    20,
    'intermediate'
  );

-- Insert crisis resources
INSERT INTO public.crisis_resources (country_code, organization_name, phone_number, website_url, description, available_24_7) VALUES
  ('US', 'National Suicide Prevention Lifeline', '988', 'https://988lifeline.org', 'Free and confidential support for people in distress', true),
  ('US', 'Crisis Text Line', 'Text HOME to 741741', 'https://www.crisistextline.org', 'Free 24/7 crisis support via text', true),
  ('US', 'SAMHSA National Helpline', '1-800-662-4357', 'https://www.samhsa.gov', 'Treatment referral and information service', true),
  ('GB', 'Samaritans', '116 123', 'https://www.samaritans.org', 'Confidential support for anyone in crisis', true),
  ('GB', 'Mind', '0300 123 3393', 'https://www.mind.org.uk', 'Mental health support and information', false),
  ('CA', 'Canada Suicide Prevention Service', '1-833-456-4566', 'https://www.crisisservicescanada.ca', '24/7 support in English and French', true),
  ('AU', 'Lifeline Australia', '13 11 14', 'https://www.lifeline.org.au', '24-hour crisis support and suicide prevention', true),
  ('IN', 'AASRA', '91-9820466726', 'http://www.aasra.info', '24/7 helpline for suicide prevention', true)
ON CONFLICT DO NOTHING;

-- Insert sample educational articles
INSERT INTO public.educational_articles (title, summary, content, category, author, read_time_minutes, is_published, published_at) VALUES
  (
    'What is Mindfulness?',
    'An introduction to mindfulness meditation and its benefits',
    E'# What is Mindfulness?\n\nMindfulness is the practice of being fully present and engaged in the current moment, aware of your thoughts and feelings without judgment.\n\n## Benefits of Mindfulness\n\n- Reduces stress and anxiety\n- Improves focus and concentration\n- Enhances emotional regulation\n- Promotes better sleep\n- Increases self-awareness\n\n## How to Practice\n\n1. Find a quiet space\n2. Focus on your breath\n3. Notice when your mind wanders\n4. Gently return attention to the present\n5. Practice regularly for best results',
    'mindfulness',
    'Dr. Sarah Johnson',
    5,
    true,
    NOW()
  ),
  (
    'Understanding CBT',
    'Cognitive Behavioral Therapy explained and how it can help',
    E'# Understanding Cognitive Behavioral Therapy\n\nCBT is a structured, evidence-based approach that helps you identify and change negative thought patterns.\n\n## Core Principles\n\n- Our thoughts affect our feelings and behaviors\n- Negative thought patterns can be identified and changed\n- Changing thoughts can change how we feel and act\n\n## Common Techniques\n\n- Thought records\n- Behavioral experiments\n- Exposure therapy\n- Problem-solving\n- Relaxation techniques',
    'cbt',
    'Dr. Michael Chen',
    7,
    true,
    NOW()
  ),
  (
    'Sleep Hygiene: Tips for Better Sleep',
    'Evidence-based strategies to improve your sleep quality',
    E'# Sleep Hygiene Guide\n\nGood sleep hygiene can dramatically improve your sleep quality and overall wellbeing.\n\n## Key Strategies\n\n### Before Bed\n- Establish a consistent sleep schedule\n- Avoid screens 1 hour before bed\n- Keep your bedroom cool (60-67°F)\n- Use blackout curtains\n\n### During the Day\n- Get natural sunlight exposure\n- Exercise regularly (but not too close to bedtime)\n- Limit caffeine after 2 PM\n- Avoid alcohol before bed\n\n## What to Do If You Can''t Sleep\n\n- Don''t lie awake for more than 20 minutes\n- Get up and do a calm activity\n- Practice deep breathing\n- Return to bed when sleepy',
    'sleep',
    'Dr. Emily Rodriguez',
    8,
    true,
    NOW()
  ),
  (
    'Managing Anxiety in Daily Life',
    'Practical techniques to reduce anxiety and worry',
    E'# Managing Anxiety\n\nAnxiety is a normal human emotion, but when it becomes overwhelming, these strategies can help.\n\n## Immediate Relief Techniques\n\n### 5-4-3-2-1 Grounding\n- 5 things you can see\n- 4 things you can touch\n- 3 things you can hear\n- 2 things you can smell\n- 1 thing you can taste\n\n### Box Breathing\n1. Breathe in for 4 counts\n2. Hold for 4 counts\n3. Breathe out for 4 counts\n4. Hold for 4 counts\n5. Repeat\n\n## Long-term Strategies\n\n- Regular exercise\n- Consistent sleep schedule\n- Limit caffeine and alcohol\n- Practice mindfulness meditation\n- Challenge anxious thoughts\n- Seek professional support when needed',
    'anxiety',
    'Dr. James Williams',
    6,
    true,
    NOW()
  );

-- Insert sample challenges
INSERT INTO public.challenges (title, description, type, goal_value, goal_unit, start_date, end_date, is_active) VALUES
  (
    '30-Day Meditation Challenge',
    'Meditate every day for 30 days and build a lasting habit',
    'meditation',
    30,
    'days',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    true
  ),
  (
    '7-Day Gratitude Journal',
    'Write about three things you''re grateful for each day',
    'journal',
    7,
    'days',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    true
  ),
  (
    'Mindful March',
    'Complete 20 meditation sessions this month',
    'meditation',
    20,
    'sessions',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    true
  );
