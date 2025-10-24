# Quick Start Guide - Peace App Competitive Features

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or bun
- Supabase project

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
# Option 1: Using Supabase CLI
supabase db push

# Option 2: In Supabase Dashboard
# Go to SQL Editor and run:
# 1. supabase/migrations/20251024000001_add_competitive_features.sql
# 2. supabase/migrations/20251024000002_seed_competitive_features.sql

# Start development server
npm run dev
```

---

## 🧪 Testing New Features

### 1. Onboarding (New Users)
```
1. Register new account at /auth/register
2. You'll be redirected to /onboarding
3. Complete the 4-step survey:
   - Step 1: Select primary goal (e.g., "Stress Relief")
   - Step 2: Choose secondary interests (optional)
   - Step 3: Pick experience level (e.g., "Beginner")
   - Step 4: Set preferences (session length, reminder time)
4. Click "Get Started"
5. You'll land on dashboard with personalized content
```

### 2. Self-Assessments
```
Navigate to: /assessments or Dashboard → Assessments card

Try PHQ-9 (Depression Screening):
1. Click "Start Assessment"
2. Answer all 9 questions
3. View your score and interpretation
4. Check "My History" tab to see trends

Also available:
- GAD-7 (Anxiety): 7 questions
- PSS-10 (Stress): 10 questions
```

### 3. CBT Tools
```
Navigate to: /cbt or Dashboard → CBT Tools card

Try Thought Record:
1. Click "Start" on "Thought Record" exercise
2. Follow the guided steps:
   - Describe the situation
   - Identify automatic thoughts
   - List evidence for/against
   - Create alternative thought
   - Rate outcome
3. Save progress (can resume later)
4. View completed exercises in "My Work" tab
```

### 4. Community
```
Navigate to: /community or Bottom Nav → Community

Create a Discussion:
1. Click "New Post"
2. Select category (e.g., "Anxiety Stories")
3. Add title and content
4. Post to community
5. See your post in the feed

Join a Challenge:
1. Go to "Challenges" tab
2. Click "Join Challenge" on any active challenge
3. Track progress in /stats page
```

### 5. Sleep Resources
```
Navigate to: /sleep or Dashboard → Sleep card

Browse Content:
1. Filter by type: Stories, Soundscapes, White Noise, Meditations
2. Click on any track to view details
3. Play button opens player (to be implemented)
4. View duration and premium/free status
```

### 6. Stats & Gamification
```
Navigate to: /stats or Bottom Nav → Stats

View Progress:
1. Check your level and points
2. See meditation/journal streaks
3. View earned achievements
4. Monitor active challenge progress

Earn Your First Achievement:
1. Complete 1 meditation → Unlock "First Step" (+10 points)
2. Write 1 journal entry → Unlock "Journaling Beginner" (+10 points)
3. Take 1 assessment → Unlock "Self-Aware" (+25 points)
```

### 7. Educational Resources
```
Navigate to: /learn or Dashboard → Learn card

Browse Articles:
1. Use search bar to find topics
2. Filter by category (Mindfulness, CBT, Anxiety, etc.)
3. Click article to read
4. Bookmark favorites
5. View bookmarks by searching or in future "Bookmarks" section
```

### 8. Crisis Resources
```
Navigate to: /crisis or Settings → Crisis Resources

Access Support:
1. View resources for your country
2. Click phone numbers to call directly
3. Click website links to visit support sites
4. Click chat links for text-based support
5. All resources show 24/7 availability
```

---

## 📊 Database Seed Data

After running migrations, you'll have:

### Assessments (3)
- PHQ-9 (Depression)
- GAD-7 (Anxiety)
- PSS-10 (Stress)

### CBT Exercises (3)
- Thought Record
- Behavioral Activation
- Cognitive Restructuring

### Achievements (10)
- First Step (1 meditation)
- Week Warrior (7-day streak)
- Mindful Month (30-day streak)
- Journaling Beginner (1 entry)
- Consistent Writer (7-day journal streak)
- Meditation Master (100 meditations)
- Deep Relaxation (1000 minutes)
- Community Helper (10 interactions)
- Self-Aware (first assessment)
- Early Bird (6 AM meditation)

### Meditation Categories (8)
- Stress Relief, Sleep, Anxiety, Focus
- Gratitude, Mindfulness, Body Scan, Breathing

### Articles (4)
- "What is Mindfulness?"
- "Understanding CBT"
- "Sleep Hygiene: Tips for Better Sleep"
- "Managing Anxiety in Daily Life"

### Crisis Resources (8)
- US: 988, Crisis Text Line, SAMHSA
- UK: Samaritans, Mind
- Canada: CSPS
- Australia: Lifeline
- India: AASRA

### Challenges (3)
- 30-Day Meditation Challenge
- 7-Day Gratitude Journal
- Mindful March (20 sessions)

---

## 🔄 User Flows to Test

### New User Experience
```
1. Sign up (/auth/register)
2. Complete onboarding (/onboarding)
3. Explore dashboard with personalized cards
4. Take first assessment (PHQ-9 or GAD-7)
5. Complete first meditation
6. Write first journal entry
7. Check stats page - see achievements unlocked!
```

### Mental Health Journey
```
1. Take PHQ-9 assessment (establish baseline)
2. Start CBT Thought Record exercise
3. Write reflective journal entry
4. Complete guided meditation
5. Return weekly to retake PHQ-9
6. Compare scores over time in charts
7. See improvement and celebrate progress!
```

### Community Engagement
```
1. Browse existing topics in /community
2. React to helpful posts
3. Comment on topics that resonate
4. Create your own discussion topic
5. Join an active challenge
6. Track challenge progress in /stats
7. Engage regularly to maintain streaks
```

### Evening Wind-Down Routine
```
1. Visit /sleep before bed
2. Browse "Sleep Stories" or "Soundscapes"
3. Select a track (e.g., "Ocean Waves")
4. Set sleep timer (future feature)
5. Let content play while you drift off
6. Content continues even with screen off (PWA)
```

---

## 🎯 Testing Checklist

### Core Functionality
- [ ] Onboarding saves preferences correctly
- [ ] Assessments calculate scores accurately
- [ ] CBT exercises save and resume properly
- [ ] Community posts are visible to all users
- [ ] Stats update after completing activities
- [ ] Achievements unlock at correct thresholds
- [ ] Articles can be bookmarked/unbookmarked
- [ ] Crisis resource links are functional
- [ ] Sleep tracks filter by type correctly
- [ ] Challenges track progress accurately

### Edge Cases
- [ ] Refresh during onboarding (data persists)
- [ ] Submit assessment with missing answers (validation)
- [ ] Create post with empty content (prevents)
- [ ] Rapid bookmark toggling (debounced)
- [ ] Duplicate achievement unlocking (prevented)
- [ ] Streak calculation at midnight transition
- [ ] Long article content renders properly
- [ ] Large number of community posts (pagination needed)

### UI/UX
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Dark mode works on all new pages
- [ ] Loading states show while fetching data
- [ ] Error states display helpful messages
- [ ] Success toasts confirm actions
- [ ] Navigation flows are intuitive
- [ ] Back buttons work correctly
- [ ] Forms validate inputs properly

### Performance
- [ ] Pages load in < 2 seconds
- [ ] Images lazy load
- [ ] Charts render smoothly
- [ ] Search is debounced
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

---

## 🐛 Common Issues & Solutions

### Issue: Migrations fail
**Solution**: 
- Ensure tables don't already exist
- Run migrations in order (001, then 002)
- Check Supabase dashboard for error details

### Issue: "Authentication required" errors
**Solution**:
- Ensure user is logged in
- Check RLS policies in Supabase
- Verify JWT token is valid

### Issue: Assessments don't calculate scores
**Solution**:
- Check all questions are answered
- Verify scoring logic in code
- Check for reverse-scored items (PSS-10)

### Issue: Achievements not unlocking
**Solution**:
- Check `user_statistics` is updating
- Verify achievement requirements
- Check for unique constraint violations (no duplicates)

### Issue: Community posts not visible
**Solution**:
- Check RLS policy allows SELECT for authenticated users
- Verify `is_published` or similar flags
- Check user is authenticated

---

## 📱 Demo User Journey

Create a demo account to showcase all features:

```
Email: demo@peace.app
Password: DemoUser123!

Onboarding Profile:
- Primary Goal: "Stress Relief"
- Secondary: Mindfulness, Breathing
- Experience: Beginner
- Session Length: 10 minutes
- Reminder: 9:00 AM

Day 1 Activities:
1. Complete PHQ-9 assessment (establish baseline)
2. Start "Thought Record" CBT exercise
3. Write first journal entry (mood: 7/10)
4. Complete 10-min stress relief meditation
5. Check stats → 3 achievements unlocked!

Week 1:
- Meditate daily (build 7-day streak)
- Journal 3x per week
- Engage in community (1 post, 5 comments)
- Join "30-Day Meditation Challenge"

Week 4:
- Retake PHQ-9 (compare scores)
- Complete all CBT exercises
- Read 4 educational articles
- Achieve "Week Warrior" badge
```

---

## 🔧 Development Tips

### Adding New Assessment
```typescript
// In seed SQL or admin panel
INSERT INTO assessments (name, type, description, questions, scoring)
VALUES (
  'New Assessment',
  'TYPE',
  'Description',
  '[ ... questions array ... ]',
  '{ ... scoring object ... }'
);
```

### Adding New Achievement
```typescript
INSERT INTO achievements (
  name, description, icon, category, 
  requirement_type, requirement_value, points_reward
) VALUES (
  'Achievement Name',
  'Description',
  '🏆',
  'meditation',
  'count',
  50,
  100
);
```

### Adding New Article
```typescript
INSERT INTO educational_articles (
  title, summary, content, category, 
  author, read_time_minutes, 
  is_published, published_at
) VALUES (
  'Article Title',
  'Summary',
  'Full markdown content...',
  'mindfulness',
  'Dr. Author Name',
  5,
  true,
  NOW()
);
```

---

## 📈 Monitoring Success

### Key Metrics Dashboard
Track these in your analytics:

**User Engagement**
- Daily Active Users (DAU)
- Average session duration
- Features used per session

**Feature Adoption**
- % users who complete onboarding
- % users who take at least 1 assessment
- % users who try CBT exercises
- % users who engage in community
- % users who use sleep content

**Retention**
- 1-day, 7-day, 30-day retention rates
- % users with active streaks
- Average streak length

**Health Outcomes**
- Average PHQ-9/GAD-7 score changes
- % users showing improvement
- Most helpful features (correlations)

---

## 🎉 Launch Checklist

### Before Production
- [ ] Run all migrations in production database
- [ ] Verify seed data is loaded
- [ ] Test all routes are accessible
- [ ] Check RLS policies are secure
- [ ] Ensure sensitive data is encrypted
- [ ] Test authentication flow
- [ ] Verify email notifications work
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure analytics (Mixpanel, Amplitude)
- [ ] Test on multiple devices/browsers
- [ ] Perform security audit
- [ ] Get legal review (terms, privacy policy)
- [ ] Review with mental health professional

### Marketing Materials
- [ ] Screenshot all new features
- [ ] Create demo video
- [ ] Write blog post announcement
- [ ] Update app store descriptions
- [ ] Prepare social media posts
- [ ] Update website with new features
- [ ] Create feature comparison chart

### Post-Launch
- [ ] Monitor error rates
- [ ] Track user feedback
- [ ] Watch analytics dashboards
- [ ] Respond to support tickets
- [ ] Iterate based on data
- [ ] Plan Phase 2 features

---

## 📚 Resources

### Documentation
- [Full Feature Docs](/docs/COMPETITIVE_FEATURES.md)
- [Implementation Summary](/IMPLEMENTATION_SUMMARY.md)
- [Database Schema](/supabase/migrations/)

### External Resources
- [PHQ-9 Official](https://www.apa.org/depression-guideline/patient-health-questionnaire.pdf)
- [GAD-7 Official](https://www.phqscreeners.com/images/sites/g/files/g10049256/f/201412/GAD-7_English.pdf)
- [PSS-10 Research](https://www.cmu.edu/dietrich/psychology/stress-immunity-disease-lab/scales/pdf/pss10.pdf)
- [Crisis Resources](https://www.samhsa.gov/find-help/national-helpline)

### Support
- In-app: Settings → Help & Support
- Community: /community
- Crisis: /crisis or 988 (US)

---

**Ready to make a difference in mental health? Let's go! 🚀**

---

Last Updated: October 24, 2025  
Version: 2.0.0  
Status: ✅ Ready for Testing
