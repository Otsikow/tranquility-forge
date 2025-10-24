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
