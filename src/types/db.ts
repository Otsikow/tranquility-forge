/**
 * Database types for Peace app
 * Generated from Supabase schema
 */

export interface UsersProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  goals?: string[]; // e.g., ['stress', 'sleep', 'anxiety']
  preferences?: Record<string, unknown>; // jsonb map for personalization
  demographics?: Record<string, unknown>; // jsonb map (age_range, region, etc.)
}

export interface JournalEntry {
  id: string;
  user_id: string;
  mood: number | null;
  title: string | null;
  content: string | null;
  tags: string[];
  created_at: string;
}

export interface Meditation {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number;
  cover_url: string | null;
  audio_url: string | null;
  is_free: boolean;
  created_at: string;
  categories?: string[];
  tags?: string[];
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SessionPlayed {
  id: string;
  user_id: string;
  meditation_id: string;
  started_at: string;
  completed_at: string | null;
}

// Insert types (for creating new records)
export type InsertUsersProfile = Omit<UsersProfile, 'id' | 'created_at'> & {
  id: string;
};

export type InsertJournalEntry = Omit<JournalEntry, 'id' | 'created_at' | 'tags'> & {
  tags?: string[];
};

export type InsertMeditation = Omit<Meditation, 'id' | 'created_at' | 'is_free'> & {
  is_free?: boolean;
};

export type InsertSessionPlayed = Omit<SessionPlayed, 'id' | 'started_at'>;

// Update types (for updating existing records)
export type UpdateUsersProfile = Partial<Omit<UsersProfile, 'id' | 'created_at'>>;
export type UpdateJournalEntry = Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>>;
export type UpdateMeditation = Partial<Omit<Meditation, 'id' | 'created_at'>>;
export type UpdateSessionPlayed = Partial<Omit<SessionPlayed, 'id' | 'user_id' | 'meditation_id' | 'started_at'>>;

// Extended types with relations
export interface JournalEntryWithProfile extends JournalEntry {
  profile?: UsersProfile;
}

export interface SessionWithMeditation extends SessionPlayed {
  meditation?: Meditation;
}

export interface MeditationWithStats extends Meditation {
  total_plays?: number;
  avg_completion_rate?: number;
}
