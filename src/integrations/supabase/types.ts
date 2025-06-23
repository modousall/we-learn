export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string | null
          badge_type: string | null
          course_id: string | null
          description: string | null
          earned_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          badge_icon?: string | null
          badge_type?: string | null
          course_id?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          badge_icon?: string | null
          badge_type?: string | null
          course_id?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      class_memberships: {
        Row: {
          class_id: string | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          student_id: string | null
        }
        Insert: {
          class_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          student_id?: string | null
        }
        Update: {
          class_id?: string | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_memberships_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "virtual_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          audio_url: string | null
          category: string
          content: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_premium: boolean | null
          level: string
          price_fcfa: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          category: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_premium?: boolean | null
          level: string
          price_fcfa?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_premium?: boolean | null
          level?: string
          price_fcfa?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      parent_child_relationships: {
        Row: {
          child_id: string | null
          created_at: string | null
          id: string
          parent_id: string | null
          relationship_type: string | null
        }
        Insert: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          relationship_type?: string | null
        }
        Update: {
          child_id?: string | null
          created_at?: string | null
          id?: string
          parent_id?: string | null
          relationship_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          language_preference: string | null
          region: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          school_level: string | null
          school_name: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language_preference?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          school_level?: string | null
          school_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          school_level?: string | null
          school_name?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          answers: Json
          completed_at: string | null
          id: string
          quiz_session_id: string | null
          score: number | null
          time_taken_seconds: number | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          completed_at?: string | null
          id?: string
          quiz_session_id?: string | null
          score?: number | null
          time_taken_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          id?: string
          quiz_session_id?: string | null
          score?: number | null
          time_taken_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_quiz_session_id_fkey"
            columns: ["quiz_session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          class_id: string | null
          course_id: string | null
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          ended_at: string | null
          id: string
          is_live: boolean | null
          questions: Json
          started_at: string | null
          title: string
        }
        Insert: {
          class_id?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          questions: Json
          started_at?: string | null
          title: string
        }
        Update: {
          class_id?: string | null
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: number | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          questions?: Json
          started_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "virtual_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          completed_modules: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          progress_percentage: number | null
          quiz_scores: Json | null
          time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_modules?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress_percentage?: number | null
          quiz_scores?: Json | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_modules?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress_percentage?: number | null
          quiz_scores?: Json | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      virtual_classes: {
        Row: {
          class_code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          level: string | null
          max_students: number | null
          name: string
          region: string | null
          school_name: string | null
          teacher_id: string | null
        }
        Insert: {
          class_code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: string | null
          max_students?: number | null
          name: string
          region?: string | null
          school_name?: string | null
          teacher_id?: string | null
        }
        Update: {
          class_code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: string | null
          max_students?: number | null
          name?: string
          region?: string | null
          school_name?: string | null
          teacher_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_highest_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "teacher", "student"],
    },
  },
} as const
