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

// Phase 2 Types - Community Features
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

// Phase 2 Types - CBT Tools
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
  exercise_type: 'worksheet' | 'interactive' | 'reflection' | 'behavioral';
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
  responses: any; // JSONB
  score: number | null;
  notes: string | null;
  created_at: string;
}

// Phase 2 Types - Sleep Resources
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

// Phase 2 Types - Monetization
export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface UserSubscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  stripe_subscription_id: string | null;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
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

// Phase 2 Types - Notifications
export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: 'reminder' | 'engagement' | 'achievement' | 'social';
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
  data: any; // JSONB
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

// Extended types with relations
export interface ForumPostWithDetails extends ForumPost {
  category?: ForumCategory;
  profile?: UsersProfile;
  replies?: ForumReply[];
}

export interface ForumReplyWithDetails extends ForumReply {
  profile?: UsersProfile;
  parent_reply?: ForumReply;
}

export interface CBTExerciseWithCategory extends CBTExercise {
  category?: CBTCategory;
}

export interface CBTProgressWithExercise extends CBTProgress {
  exercise?: CBTExercise;
}

export interface SleepTrackingWithStats extends SleepTracking {
  weekly_average?: number;
  monthly_average?: number;
}

// Insert types for new tables
export type InsertForumCategory = Omit<ForumCategory, 'id' | 'created_at'>;
export type InsertForumPost = Omit<ForumPost, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'replies_count' | 'last_reply_at'>;
export type InsertForumReply = Omit<ForumReply, 'id' | 'created_at' | 'updated_at' | 'likes'>;
export type InsertCBTCategory = Omit<CBTCategory, 'id' | 'created_at'>;
export type InsertCBTExercise = Omit<CBTExercise, 'id' | 'created_at'>;
export type InsertCBTProgress = Omit<CBTProgress, 'id' | 'created_at'>;
export type InsertSleepStory = Omit<SleepStory, 'id' | 'created_at'>;
export type InsertSoundscape = Omit<Soundscape, 'id' | 'created_at'>;
export type InsertSleepTracking = Omit<SleepTracking, 'id' | 'created_at'>;
export type InsertUserSubscription = Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>;
export type InsertPremiumFeature = Omit<PremiumFeature, 'id' | 'created_at'>;
export type InsertUserFeatureAccess = Omit<UserFeatureAccess, 'id' | 'granted_at'>;
export type InsertNotificationTemplate = Omit<NotificationTemplate, 'id' | 'created_at'>;
export type InsertUserNotification = Omit<UserNotification, 'id' | 'created_at'>;

// Update types for new tables
export type UpdateForumCategory = Partial<Omit<ForumCategory, 'id' | 'created_at'>>;
export type UpdateForumPost = Partial<Omit<ForumPost, 'id' | 'user_id' | 'created_at'>>;
export type UpdateForumReply = Partial<Omit<ForumReply, 'id' | 'post_id' | 'user_id' | 'created_at'>>;
export type UpdateCBTCategory = Partial<Omit<CBTCategory, 'id' | 'created_at'>>;
export type UpdateCBTExercise = Partial<Omit<CBTExercise, 'id' | 'created_at'>>;
export type UpdateCBTProgress = Partial<Omit<CBTProgress, 'id' | 'user_id' | 'exercise_id' | 'created_at'>>;
export type UpdateSleepStory = Partial<Omit<SleepStory, 'id' | 'created_at'>>;
export type UpdateSoundscape = Partial<Omit<Soundscape, 'id' | 'created_at'>>;
export type UpdateSleepTracking = Partial<Omit<SleepTracking, 'id' | 'user_id' | 'created_at'>>;
export type UpdateUserSubscription = Partial<Omit<UserSubscription, 'id' | 'user_id' | 'created_at'>>;
export type UpdatePremiumFeature = Partial<Omit<PremiumFeature, 'id' | 'created_at'>>;
export type UpdateUserFeatureAccess = Partial<Omit<UserFeatureAccess, 'id' | 'user_id' | 'feature_id' | 'granted_at'>>;
export type UpdateNotificationTemplate = Partial<Omit<NotificationTemplate, 'id' | 'created_at'>>;
export type UpdateUserNotification = Partial<Omit<UserNotification, 'id' | 'user_id' | 'created_at'>>;
