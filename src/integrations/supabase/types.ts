export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_progress: {
        Row: {
          answers: Json
          assessment_type: string
          current_question: number
          id: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_type: string
          current_question?: number
          id?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_type?: string
          current_question?: number
          id?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_results: {
        Row: {
          assessment_type: string
          completed_at: string
          created_at: string
          id: string
          interpretation: string | null
          recommendations: string[] | null
          resources: string[] | null
          responses: Json
          score: number
          severity: string
          user_id: string
        }
        Insert: {
          assessment_type: string
          completed_at?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          recommendations?: string[] | null
          resources?: string[] | null
          responses?: Json
          score: number
          severity: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          completed_at?: string
          created_at?: string
          id?: string
          interpretation?: string | null
          recommendations?: string[] | null
          resources?: string[] | null
          responses?: Json
          score?: number
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          max_score: number
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          max_score: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          max_score?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cbt_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      cbt_exercises: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          difficulty_level: number | null
          estimated_duration: number | null
          exercise_type: string
          id: string
          instructions: string
          is_premium: boolean | null
          title: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          exercise_type: string
          id?: string
          instructions: string
          is_premium?: boolean | null
          title: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          estimated_duration?: number | null
          exercise_type?: string
          id?: string
          instructions?: string
          is_premium?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cbt_exercises_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cbt_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cbt_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          exercise_id: string
          id: string
          notes: string | null
          responses: Json | null
          score: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          exercise_id: string
          id?: string
          notes?: string | null
          responses?: Json | null
          score?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          exercise_id?: string
          id?: string
          notes?: string | null
          responses?: Json | null
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cbt_progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "cbt_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      content_recommendations: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          recommendation_reason: string | null
          recommendation_score: number
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation_reason?: string | null
          recommendation_score: number
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation_reason?: string | null
          recommendation_score?: number
          user_id?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          downloaded_at: string | null
          evicted: boolean | null
          file_size: number
          id: string
          last_accessed_at: string | null
          meditation_id: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string | null
          evicted?: boolean | null
          file_size: number
          id?: string
          last_accessed_at?: string | null
          meditation_id: string
          user_id: string
        }
        Update: {
          downloaded_at?: string | null
          evicted?: boolean | null
          file_size?: number
          id?: string
          last_accessed_at?: string | null
          meditation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_meditation_id_fkey"
            columns: ["meditation_id"]
            isOneToOne: false
            referencedRelation: "meditations"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          color: string
          created_at: string
          description: string | null
          icon: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          color: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_reply_at: string | null
          likes: number | null
          replies_count: number | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          likes?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          likes?: number | null
          replies_count?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          likes: number | null
          parent_reply_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes?: number | null
          parent_reply_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes?: number | null
          parent_reply_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          mood: number | null
          tags: string[] | null
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: number | null
          tags?: string[] | null
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          mood?: number | null
          tags?: string[] | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meditations: {
        Row: {
          audio_url: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          duration_seconds: number
          id: string
          is_free: boolean | null
          title: string
        }
        Insert: {
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds: number
          id?: string
          is_free?: boolean | null
          title: string
        }
        Update: {
          audio_url?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_free?: boolean | null
          title?: string
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          tier_required: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tier_required: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tier_required?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          topics: string[] | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          topics?: string[] | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          topics?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      sessions_played: {
        Row: {
          completed_at: string | null
          id: string
          meditation_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          meditation_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          meditation_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_played_meditation_id_fkey"
            columns: ["meditation_id"]
            isOneToOne: false
            referencedRelation: "meditations"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_stories: {
        Row: {
          background_sound_url: string | null
          content: string
          cover_url: string | null
          created_at: string
          description: string | null
          duration_seconds: number
          id: string
          is_premium: boolean | null
          narrator: string | null
          title: string
        }
        Insert: {
          background_sound_url?: string | null
          content: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds: number
          id?: string
          is_premium?: boolean | null
          narrator?: string | null
          title: string
        }
        Update: {
          background_sound_url?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number
          id?: string
          is_premium?: boolean | null
          narrator?: string | null
          title?: string
        }
        Relationships: []
      }
      sleep_tracking: {
        Row: {
          bedtime: string | null
          created_at: string
          id: string
          mood_after_sleep: number | null
          mood_before_sleep: number | null
          notes: string | null
          sleep_date: string
          sleep_duration: number | null
          sleep_quality: number | null
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          created_at?: string
          id?: string
          mood_after_sleep?: number | null
          mood_before_sleep?: number | null
          notes?: string | null
          sleep_date: string
          sleep_duration?: number | null
          sleep_quality?: number | null
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          created_at?: string
          id?: string
          mood_after_sleep?: number | null
          mood_before_sleep?: number | null
          notes?: string | null
          sleep_date?: string
          sleep_duration?: number | null
          sleep_quality?: number | null
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      soundscapes: {
        Row: {
          audio_url: string
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          is_loopable: boolean | null
          is_premium: boolean | null
          name: string
        }
        Insert: {
          audio_url: string
          category: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_loopable?: boolean | null
          is_premium?: boolean | null
          name: string
        }
        Update: {
          audio_url?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_loopable?: boolean | null
          is_premium?: boolean | null
          name?: string
        }
        Relationships: []
      }
      sync_queue: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          operation_type: string
          payload: Json
          processed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          operation_type: string
          payload: Json
          processed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          operation_type?: string
          payload?: Json
          processed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string | null
          achievement_key: string
          achievement_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          achievement_key: string
          achievement_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          achievement_key?: string
          achievement_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_id: string | null
          activity_type: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_type: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_id?: string | null
          activity_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_feature_access: {
        Row: {
          expires_at: string | null
          feature_id: string
          granted_at: string
          id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          feature_id: string
          granted_at?: string
          id?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          feature_id?: string
          granted_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feature_access_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "premium_features"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          community_participation_enabled: boolean | null
          created_at: string | null
          data_sharing_enabled: boolean | null
          id: string
          journal_reminders_enabled: boolean | null
          meditation_reminders_enabled: boolean | null
          mood_check_reminders_enabled: boolean | null
          reminder_time: string | null
          updated_at: string | null
          user_id: string
          weekly_insights_enabled: boolean | null
        }
        Insert: {
          community_participation_enabled?: boolean | null
          created_at?: string | null
          data_sharing_enabled?: boolean | null
          id?: string
          journal_reminders_enabled?: boolean | null
          meditation_reminders_enabled?: boolean | null
          mood_check_reminders_enabled?: boolean | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id: string
          weekly_insights_enabled?: boolean | null
        }
        Update: {
          community_participation_enabled?: boolean | null
          created_at?: string | null
          data_sharing_enabled?: boolean | null
          id?: string
          journal_reminders_enabled?: boolean | null
          meditation_reminders_enabled?: boolean | null
          mood_check_reminders_enabled?: boolean | null
          reminder_time?: string | null
          updated_at?: string | null
          user_id?: string
          weekly_insights_enabled?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status: string
          stripe_subscription_id?: string | null
          tier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_achievements: {
        Args: { p_user_id: string }
        Returns: {
          achieved_at: string | null
          achievement_key: string
          achievement_type: string
          id: string
          metadata: Json | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "user_achievements"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      complete_assessment: {
        Args: {
          p_assessment_type: string
          p_interpretation: string
          p_recommendations: string[]
          p_resources: string[]
          p_responses: Json
          p_score: number
          p_severity: string
          p_user_id: string
        }
        Returns: string
      }
      get_assessment_history: {
        Args: { p_assessment_type: string; p_user_id: string }
        Returns: {
          completed_at: string
          id: string
          interpretation: string
          recommendations: string[]
          resources: string[]
          score: number
          severity: string
        }[]
      }
      get_assessment_progress: {
        Args: { p_assessment_type: string; p_user_id: string }
        Returns: {
          answers: Json
          current_question: number
          id: string
          started_at: string
        }[]
      }
      get_user_download_size: { Args: { p_user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_activity_id?: string
          p_activity_type: string
          p_duration_seconds?: number
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
      save_assessment_progress: {
        Args: {
          p_answers: Json
          p_assessment_type: string
          p_current_question: number
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
