# Peace App - Database Schema

## Overview
This document describes the database schema for the Peace mental wellbeing application.

## Tables

### `users_profile`
Stores extended user profile information (1:1 with auth.users).

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | - | Primary key, references auth.users(id) |
| display_name | text | YES | - | User's display name |
| avatar_url | text | YES | - | URL to user's avatar image |
| timezone | text | YES | 'UTC' | User's timezone |
| created_at | timestamptz | NO | now() | Profile creation timestamp |

**Relationships:**
- One-to-one with `auth.users` (auto-created on user signup via trigger)

**Indexes:**
- Primary key on `id`

---

### `journal_entries`
Stores user journal entries with mood tracking.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | - | References auth.users(id) |
| mood | int | YES | - | Mood rating (1-10) |
| title | text | YES | - | Entry title |
| content | text | YES | - | Entry content |
| tags | text[] | YES | '{}' | Array of tags |
| created_at | timestamptz | NO | now() | Entry creation timestamp |

**Relationships:**
- Many-to-one with `auth.users`

**Constraints:**
- `mood` must be between 1 and 10

**Indexes:**
- Primary key on `id`
- `idx_journal_entries_user_id` on `user_id`
- `idx_journal_entries_created_at` on `created_at DESC`

---

### `meditations`
Stores meditation content library.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| title | text | NO | - | Meditation title |
| description | text | YES | - | Meditation description |
| duration_seconds | int | NO | - | Duration in seconds |
| cover_url | text | YES | - | Cover image URL |
| audio_url | text | YES | - | Audio file URL |
| is_free | boolean | YES | true | Whether meditation is free |
| created_at | timestamptz | NO | now() | Creation timestamp |

**Indexes:**
- Primary key on `id`

---

### `sessions_played`
Tracks user meditation sessions.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | - | References auth.users(id) |
| meditation_id | uuid | NO | - | References meditations(id) |
| started_at | timestamptz | NO | now() | Session start timestamp |
| completed_at | timestamptz | YES | - | Session completion timestamp |

**Relationships:**
- Many-to-one with `auth.users`
- Many-to-one with `meditations`

**Indexes:**
- Primary key on `id`
- `idx_sessions_played_user_id` on `user_id`
- `idx_sessions_played_meditation_id` on `meditation_id`

---

## Database Functions

### `handle_new_user()`
**Type:** Trigger function  
**Security:** SECURITY DEFINER  
**Purpose:** Automatically creates a user profile when a new user signs up

**Trigger:**
- `on_auth_user_created` - Fires AFTER INSERT on `auth.users`

**Logic:**
- Inserts a new row in `users_profile` with the user's ID
- Sets `display_name` to the user's name from metadata or email

---

## Security

### Row Level Security (RLS)
RLS is **enabled** on all tables but policies need to be added:
- ⚠️ `users_profile` - No policies yet
- ⚠️ `journal_entries` - No policies yet
- ⚠️ `meditations` - No policies yet (public read should be allowed)
- ⚠️ `sessions_played` - No policies yet

### Recommended RLS Policies

**users_profile:**
```sql
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users_profile
  FOR UPDATE USING (auth.uid() = id);
```

**journal_entries:**
```sql
-- Users can only access their own journal entries
CREATE POLICY "Users can view own entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);
```

**meditations:**
```sql
-- Anyone can view meditations
CREATE POLICY "Anyone can view meditations" ON meditations
  FOR SELECT USING (true);

-- Only admins can modify meditations (add admin check)
CREATE POLICY "Admins can insert meditations" ON meditations
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update meditations" ON meditations
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete meditations" ON meditations
  FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

**sessions_played:**
```sql
-- Users can only access their own sessions
CREATE POLICY "Users can view own sessions" ON sessions_played
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON sessions_played
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON sessions_played
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## Demo Data

6 demo meditations are seeded in the database:

1. **Morning Clarity** (10 min) - Free
2. **Stress Release** (8 min) - Free
3. **Deep Sleep Journey** (20 min) - Free
4. **Mindful Breathing** (5 min) - Free
5. **Gratitude Practice** (7 min) - Free
6. **Inner Peace** (15 min) - Premium

---

## TypeScript Types

TypeScript types are available in `src/types/db.ts` for type-safe database operations.

### Usage Example

```typescript
import { supabase } from '@/integrations/supabase/client';
import type { InsertJournalEntry, JournalEntry } from '@/types/db';

// Insert a new journal entry
const newEntry: InsertJournalEntry = {
  user_id: userId,
  mood: 8,
  title: 'A peaceful day',
  content: 'Today was wonderful...',
  tags: ['gratitude', 'mindfulness']
};

const { data, error } = await supabase
  .from('journal_entries')
  .insert(newEntry)
  .select()
  .single();

// Query entries with type safety
const { data: entries } = await supabase
  .from('journal_entries')
  .select('*')
  .eq('user_id', userId)
  .returns<JournalEntry[]>();
```

---

## Migration History

- **Initial Migration** (2024-10-20): Created core schema with users_profile, journal_entries, meditations, and sessions_played tables
- **Seed Data** (2024-10-20): Added 6 demo meditations

---

## Next Steps

1. ✅ Schema created
2. ✅ Types generated
3. ✅ Demo data seeded
4. ⚠️ **TODO:** Add RLS policies for security
5. ⚠️ **TODO:** Create storage buckets for audio/images
6. ⚠️ **TODO:** Add database functions for analytics
7. ⚠️ **TODO:** Configure auth password protection
