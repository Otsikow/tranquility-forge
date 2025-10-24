/**
 * Database types for Peace app
 * Generated from Supabase schema
 */

export interface UsersProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  onboarding_completed?: boolean;
  primary_goal?: string | null;
  secondary_goals?: string[];
  preferred_session_length?: number;
  notification_enabled?: boolean;
  notification_time?: string;
  experience_level?: string;
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
  difficulty_level?: string;
  instructor_name?: string;
  type?: string;
  created_at: string;
}

export interface SessionPlayed {
  id: string;
  user_id: string;
  meditation_id: string;
  started_at: string;
  completed_at: string | null;
}

export interface MeditationCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface UserStatistics {
  user_id: string;
  total_meditation_minutes: number;
  total_sessions_completed: number;
  total_journal_entries: number;
  current_meditation_streak: number;
  longest_meditation_streak: number;
  current_journal_streak: number;
  longest_journal_streak: number;
  last_meditation_date: string | null;
  last_journal_date: string | null;
  points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  requirement_type: string;
  requirement_value: number | null;
  points_reward: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export interface CBTExercise {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: any; // JSONB
  duration_minutes: number | null;
  difficulty_level: string;
  created_at: string;
}

export interface UserCBTProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  responses: any; // JSONB
  completed: boolean;
  started_at: string;
  completed_at: string | null;
  exercise?: CBTExercise;
}

export interface Assessment {
  id: string;
  name: string;
  type: string;
  description: string | null;
  questions: any; // JSONB
  scoring: any; // JSONB
  created_at: string;
}

export interface UserAssessment {
  id: string;
  user_id: string;
  assessment_id: string;
  responses: any; // JSONB
  score: number;
  interpretation: string | null;
  taken_at: string;
  assessment?: Assessment;
}

export interface SleepTrack {
  id: string;
  title: string;
  description: string | null;
  type: string;
  duration_seconds: number;
  audio_url: string;
  cover_url: string | null;
  is_free: boolean;
  created_at: string;
}

export interface CommunityTopic {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  profile?: UsersProfile;
}

export interface CommunityComment {
  id: string;
  topic_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profile?: UsersProfile;
}

export interface CommunityReaction {
  id: string;
  user_id: string;
  topic_id: string | null;
  comment_id: string | null;
  reaction_type: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: string;
  goal_value: number;
  goal_unit: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  current_progress: number;
  completed: boolean;
  joined_at: string;
  completed_at: string | null;
  challenge?: Challenge;
}

export interface EducationalArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  author: string | null;
  read_time_minutes: number | null;
  cover_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface UserBookmark {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
  article?: EducationalArticle;
}

export interface CrisisResource {
  id: string;
  country_code: string;
  organization_name: string;
  phone_number: string | null;
  website_url: string | null;
  chat_url: string | null;
  description: string | null;
  available_24_7: boolean;
  created_at: string;
}

export interface Therapist {
  id: string;
  user_id: string | null;
  full_name: string;
  credentials: string;
  specializations: string[];
  bio: string | null;
  avatar_url: string | null;
  hourly_rate: number | null;
  is_accepting_clients: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  therapist_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  meeting_url: string | null;
  notes: string | null;
  created_at: string;
  therapist?: Therapist;
}

export interface HealthData {
  id: string;
  user_id: string;
  data_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  source: string | null;
  created_at: string;
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

export type InsertUserAssessment = Omit<UserAssessment, 'id' | 'taken_at'>;

export type InsertUserCBTProgress = Omit<UserCBTProgress, 'id' | 'started_at'>;

export type InsertCommunityTopic = Omit<CommunityTopic, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'is_pinned' | 'is_locked'>;

export type InsertCommunityComment = Omit<CommunityComment, 'id' | 'created_at' | 'updated_at' | 'is_edited'>;

export type InsertHealthData = Omit<HealthData, 'id' | 'created_at'>;

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

export interface UserStatisticsWithAchievements extends UserStatistics {
  achievements?: UserAchievement[];
}
