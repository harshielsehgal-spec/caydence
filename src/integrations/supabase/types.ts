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
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      athlete_private_notes: {
        Row: {
          athlete_id: string
          created_at: string
          id: string
          private_notes: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          athlete_id: string
          created_at?: string
          id?: string
          private_notes?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          created_at?: string
          id?: string
          private_notes?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_private_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_analytics: {
        Row: {
          avg_form_score: number | null
          bookings_count: number
          coach_id: string
          created_at: string
          id: string
          masterclass_views: number
          revenue_inr: number
          sport: string
          week_start: string
        }
        Insert: {
          avg_form_score?: number | null
          bookings_count?: number
          coach_id: string
          created_at?: string
          id?: string
          masterclass_views?: number
          revenue_inr?: number
          sport: string
          week_start: string
        }
        Update: {
          avg_form_score?: number | null
          bookings_count?: number
          coach_id?: string
          created_at?: string
          id?: string
          masterclass_views?: number
          revenue_inr?: number
          sport?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "coach_analytics_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string
          end_time: string
          id: string
          start_time: string
          updated_at: string
          weekday: number
        }
        Insert: {
          coach_id: string
          created_at?: string
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
          weekday: number
        }
        Update: {
          coach_id?: string
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "coach_availability_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          bio: string | null
          cities: string[]
          created_at: string | null
          id: string
          languages: string[]
          mode: string[]
          name: string
          per_session_fee: number | null
          photo_url: string | null
          rating: number | null
          reviews_count: number | null
          setup_complete: boolean
          sports: string[]
          updated_at: string | null
          user_id: string
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          cities?: string[]
          created_at?: string | null
          id?: string
          languages?: string[]
          mode?: string[]
          name: string
          per_session_fee?: number | null
          photo_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          setup_complete?: boolean
          sports?: string[]
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          cities?: string[]
          created_at?: string | null
          id?: string
          languages?: string[]
          mode?: string[]
          name?: string
          per_session_fee?: number | null
          photo_url?: string | null
          rating?: number | null
          reviews_count?: number | null
          setup_complete?: boolean
          sports?: string[]
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      masterclass_enrollments: {
        Row: {
          athlete_id: string
          enrolled_at: string
          id: string
          masterclass_id: string
          payment_amount: number
          payment_status: string
        }
        Insert: {
          athlete_id: string
          enrolled_at?: string
          id?: string
          masterclass_id: string
          payment_amount?: number
          payment_status?: string
        }
        Update: {
          athlete_id?: string
          enrolled_at?: string
          id?: string
          masterclass_id?: string
          payment_amount?: number
          payment_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "masterclass_enrollments_masterclass_id_fkey"
            columns: ["masterclass_id"]
            isOneToOne: false
            referencedRelation: "masterclasses"
            referencedColumns: ["id"]
          },
        ]
      }
      masterclasses: {
        Row: {
          coach_id: string
          created_at: string
          description: string | null
          duration_min: number
          enrolled_count: number
          id: string
          mode: string
          price_inr: number
          rating: number | null
          scheduled_at: string | null
          seats: number
          sport: string
          status: string
          tags: string[] | null
          title: string
          trailer_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string
          description?: string | null
          duration_min?: number
          enrolled_count?: number
          id?: string
          mode: string
          price_inr?: number
          rating?: number | null
          scheduled_at?: string | null
          seats?: number
          sport: string
          status?: string
          tags?: string[] | null
          title: string
          trailer_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string
          description?: string | null
          duration_min?: number
          enrolled_count?: number
          id?: string
          mode?: string
          price_inr?: number
          rating?: number | null
          scheduled_at?: string | null
          seats?: number
          sport?: string
          status?: string
          tags?: string[] | null
          title?: string
          trailer_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "masterclasses_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          attachments: string[] | null
          coach_id: string
          created_at: string
          description: string | null
          duration_min: number
          id: string
          includes_ai_check: boolean
          level: string
          mode: string[]
          price_inr: number
          slots_per_week: number
          sport: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          coach_id: string
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          includes_ai_check?: boolean
          level: string
          mode?: string[]
          price_inr?: number
          slots_per_week?: number
          sport: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          coach_id?: string
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          includes_ai_check?: boolean
          level?: string
          mode?: string[]
          price_inr?: number
          slots_per_week?: number
          sport?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          athlete_id: string
          athlete_notes: string | null
          coach_decline_reason: string | null
          coach_id: string
          created_at: string
          end_time: string
          id: string
          mode: string
          offer_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          athlete_id: string
          athlete_notes?: string | null
          coach_decline_reason?: string | null
          coach_id: string
          created_at?: string
          end_time: string
          id?: string
          mode: string
          offer_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          athlete_id?: string
          athlete_notes?: string | null
          coach_decline_reason?: string | null
          coach_id?: string
          created_at?: string
          end_time?: string
          id?: string
          mode?: string
          offer_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_coach_leaderboard: {
        Args: { sport_filter?: string }
        Returns: {
          avg_rating: number
          coach_id: string
          coach_name: string
          coach_photo_url: string
          masterclass_views: number
          rank: number
          score: number
          sport: string
          total_bookings: number
        }[]
      }
      check_rate_limit: {
        Args: {
          _action: string
          _max_requests?: number
          _window_minutes?: number
        }
        Returns: boolean
      }
      get_athlete_sessions: {
        Args: { athlete_uuid: string }
        Returns: {
          athlete_id: string
          athlete_notes: string
          coach_decline_reason: string
          coach_id: string
          created_at: string
          end_time: string
          id: string
          mode: string
          offer_id: string
          start_time: string
          status: string
          updated_at: string
        }[]
      }
      get_athlete_sessions_with_notes: {
        Args: { athlete_uuid: string }
        Returns: {
          athlete_id: string
          coach_decline_reason: string
          coach_id: string
          created_at: string
          end_time: string
          id: string
          mode: string
          offer_id: string
          private_notes: string
          start_time: string
          status: string
          updated_at: string
        }[]
      }
      get_coach_sessions: {
        Args: { coach_uuid: string }
        Returns: {
          athlete_id: string
          athlete_notes: string
          coach_decline_reason: string
          coach_id: string
          created_at: string
          end_time: string
          id: string
          mode: string
          offer_id: string
          start_time: string
          status: string
          updated_at: string
        }[]
      }
      get_masterclass_enrollment_summary: {
        Args: { masterclass_uuid: string }
        Returns: {
          confirmed_count: number
          pending_count: number
          total_enrolled: number
        }[]
      }
      get_public_coach_profiles: {
        Args: never
        Returns: {
          bio: string
          cities: string[]
          created_at: string
          id: string
          languages: string[]
          mode: string[]
          name: string
          per_session_fee: number
          photo_url: string
          rating: number
          reviews_count: number
          setup_complete: boolean
          sports: string[]
          updated_at: string
          verified: boolean
          years_experience: number
        }[]
      }
      get_public_coaches: {
        Args: {
          city_filter?: string
          sport_filter?: string
          verified_only?: boolean
        }
        Returns: {
          bio: string
          cities: string[]
          id: string
          languages: string[]
          mode: string[]
          name: string
          per_session_fee: number
          photo_url: string
          rating: number
          reviews_count: number
          sports: string[]
          verified: boolean
          years_experience: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      log_security_event: {
        Args: {
          _action: string
          _details?: Json
          _resource_id?: string
          _resource_type: string
        }
        Returns: undefined
      }
      setup_first_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "athlete" | "coach"
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
      app_role: ["athlete", "coach"],
    },
  },
} as const
