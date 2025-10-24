/**
 * Database types for Peace app
 * Generated from Supabase schema
 */

export type MentalHealthGoal =
  | "stress_relief"
  | "anxiety_management"
  | "sleep_improvement"
  | "mood_enhancement"
  | "focus_concentration"
  | "emotional_regulation"
  | "self_compassion"
  | "mindfulness_practice";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type SessionLength = "short" | "medium" | "long";
export type NotificationFrequency = "none" | "daily" | "weekly" | "custom";

/* -------------------------------------------------------------
   Core User and Journal Types
-------------------------------------------------------------- */

export interface UsersProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
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

/* -------------------------------------------------------------
   Insert and Update Base Types
-------------------------------------------------------------- */

export type InsertUsersProfile = Omit<UsersProfile, "id" | "created_at"> & {
  id: string;
};
export type InsertJournalEntry = Omit<JournalEntry, "id" | "created_at" | "tags"> & {
  tags?: string[];
};
export type InsertMeditation = Omit<Meditation, "id" | "created_at" | "is_free"> & {
  is_free?: boolean;
};
export type InsertSessionPlayed = Omit<SessionPlayed, "id" | "started_at">;

export type UpdateUsersProfile = Partial<Omit<UsersProfile, "id" | "created_at">>;
export type UpdateJournalEntry = Partial<Omit<JournalEntry, "id" | "user_id" | "created_at">>;
export type UpdateMeditation = Partial<Omit<Meditation, "id" | "created_at">>;
export type UpdateSessionPlayed = Partial<
  Omit<SessionPlayed, "id" | "user_id" | "meditation_id" | "started_at">
>;

/* -------------------------------------------------------------
   Relations
-------------------------------------------------------------- */

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

/* -------------------------------------------------------------
   Community Forum
-------------------------------------------------------------- */

export interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface ForumPost {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  likes: number;
  replies_count: number;
  last_reply_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_reply_id: string | null;
  likes: number;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------
   CBT Tools
-------------------------------------------------------------- */

export interface CBTCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface CBTExercise {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  instructions: string;
  exercise_type: "worksheet" | "interactive" | "reflection" | "behavioral";
  estimated_duration: number | null;
  difficulty_level: number | null;
  is_premium: boolean;
  created_at: string;
}

export interface CBTProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_at: string | null;
  responses: any;
  score: number | null;
  notes: string | null;
  created_at: string;
}

/* -------------------------------------------------------------
   Sleep and Relaxation
-------------------------------------------------------------- */

export interface SleepStory {
  id: string;
  title: string;
  description: string | null;
  content: string;
  duration_seconds: number;
  narrator: string | null;
  background_sound_url: string | null;
  cover_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface Soundscape {
  id: string;
  name: string;
  description: string | null;
  audio_url: string;
  cover_url: string | null;
  category: string;
  is_loopable: boolean;
  is_premium: boolean;
  created_at: string;
}

export interface SleepTracking {
  id: string;
  user_id: string;
  sleep_date: string;
  bedtime: string | null;
  wake_time: string | null;
  sleep_duration: number | null;
  sleep_quality: number | null;
  mood_before_sleep: number | null;
  mood_after_sleep: number | null;
  notes: string | null;
  created_at: string;
}

/* -------------------------------------------------------------
   Subscriptions and Premium Features
-------------------------------------------------------------- */

export type SubscriptionTier = "free" | "premium" | "pro";

export interface UserSubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  stripe_subscription_id: string | null;
  status: "active" | "cancelled" | "past_due" | "unpaid";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string | null;
  tier_required: SubscriptionTier;
  created_at: string;
}

export interface UserFeatureAccess {
  id: string;
  user_id: string;
  feature_id: string;
  granted_at: string;
  expires_at: string | null;
}

/* -------------------------------------------------------------
   Notifications
-------------------------------------------------------------- */

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: "reminder" | "engagement" | "achievement" | "social";
  is_active: boolean;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  body: string;
  type: string;
  data: any;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

/* -------------------------------------------------------------
   User Preferences and Analytics (from main branch)
-------------------------------------------------------------- */

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

/* -------------------------------------------------------------
   Insert and Update Types for Advanced Tables
-------------------------------------------------------------- */

export type InsertUserPreferences = Omit<
  UserPreferences,
  "id" | "created_at" | "updated_at"
>;
export type InsertUserAchievement = Omit<UserAchievement, "id" | "achieved_at">;
export type InsertUserActivityLog = Omit<UserActivityLog, "id" | "created_at">;
export type InsertContentRecommendation = Omit<
  ContentRecommendation,
  "id" | "created_at"
>;

export type UpdateUserPreferences = Partial<
  Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">
>;
export type UpdateUserAchievement = Partial<
  Omit<UserAchievement, "id" | "user_id" | "achieved_at">
>;
export type UpdateUserActivityLog = Partial<
  Omit<UserActivityLog, "id" | "user_id" | "created_at">
>;
export type UpdateContentRecommendation = Partial<
  Omit<ContentRecommendation, "id" | "user_id" | "created_at">
>;
