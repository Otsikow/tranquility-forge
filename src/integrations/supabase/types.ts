export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      users_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak_days: number | null
          date_of_birth: string | null
          display_name: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_level: string | null
          gender: string | null
          id: string
          last_active_at: string | null
          location_city: string | null
          location_country: string | null
          longest_streak_days: number | null
          mental_health_goals: string[] | null
          notification_frequency: string | null
          onboarding_completed: boolean | null
          preferred_content_categories: string[] | null
          preferred_session_length: string | null
          timezone: string | null
          timezone_offset: number | null
          total_journal_entries: number | null
          total_meditation_minutes: number | null
          goals: string[] | null
          preferences: Json | null
          demographics: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak_days?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level?: string | null
          gender?: string | null
          id: string
          last_active_at?: string | null
          location_city?: string | null
          location_country?: string | null
          longest_streak_days?: number | null
          mental_health_goals?: string[] | null
          notification_frequency?: string | null
          onboarding_completed?: boolean | null
          preferred_content_categories?: string[] | null
          preferred_session_length?: string | null
          timezone?: string | null
          timezone_offset?: number | null
          total_journal_entries?: number | null
          total_meditation_minutes?: number | null
          goals?: string[] | null
          preferences?: Json | null
          demographics?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak_days?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level?: string | null
          gender?: string | null
          id?: string
          last_active_at?: string | null
          location_city?: string | null
          location_country?: string | null
          longest_streak_days?: number | null
          mental_health_goals?: string[] | null
          notification_frequency?: string | null
          onboarding_completed?: boolean | null
          preferred_content_categories?: string[] | null
          preferred_session_length?: string | null
          timezone?: string | null
          timezone_offset?: number | null
          total_journal_entries?: number | null
          total_meditation_minutes?: number | null
          goals?: string[] | null
          preferences?: Json | null
          demographics?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {}
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
