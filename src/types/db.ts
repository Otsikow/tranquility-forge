/**
 * Database types for Peace app
 * Generated from Supabase schema
 */

export type MentalHealthGoal = 
  | 'stress_relief'
  | 'anxiety_management' 
  | 'sleep_improvement'
  | 'mood_enhancement'
  | 'focus_concentration'
  | 'emotional_regulation'
  | 'self_compassion'
  | 'mindfulness_practice';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type SessionLength = 'short' | 'medium' | 'long';
export type NotificationFrequency = 'none' | 'daily' | 'weekly' | 'custom';

export interface UsersProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  // Enhanced personalization fields
  mental_health_goals: MentalHealthGoal[];
  experience_level: ExperienceLevel;
  preferred_session_length: SessionLength;
  notification_frequency: NotificationFrequency;
  timezone_offset: number;
  onboarding_completed: boolean;
  last_active_at: string;
  total_meditation_minutes: number;
  total_journal_entries: number;
  current_streak_days: number;
  longest_streak_days: number;
  preferred_content_categories: string[];
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  location_country: string | null;
  location_city: string | null;
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

// New types for enhanced features
export interface UserPreferences {
  id: string;
  user_id: string;
  meditation_reminders_enabled: boolean;
  journal_reminders_enabled: boolean;
  mood_check_reminders_enabled: boolean;
  reminder_time: string;
  weekly_insights_enabled: boolean;
  community_participation_enabled: boolean;
  data_sharing_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_key: string;
  achieved_at: string;
  metadata: Record<string, any>;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_id: string | null;
  duration_seconds: number | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ContentRecommendation {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  recommendation_score: number;
  recommendation_reason: string | null;
  created_at: string;
  expires_at: string | null;
}

// Insert types for new tables
export type InsertUserPreferences = Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserAchievement = Omit<UserAchievement, 'id' | 'achieved_at'>;
export type InsertUserActivityLog = Omit<UserActivityLog, 'id' | 'created_at'>;
export type InsertContentRecommendation = Omit<ContentRecommendation, 'id' | 'created_at'>;

// Update types for new tables
export type UpdateUserPreferences = Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type UpdateUserProfile = Partial<Omit<UsersProfile, 'id' | 'created_at'>>;
