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
      clients_credit: {
        Row: {
          created_at: string
          email: string
          id: string
          nom: string | null
          prenom: string | null
          telephone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      demandes_credit: {
        Row: {
          client_id: string
          date_decision: string | null
          date_demande: string
          devise: string
          duree_mois: number | null
          id: string
          montant: number
          motif: string | null
          statut: string
          type_credit: string
        }
        Insert: {
          client_id: string
          date_decision?: string | null
          date_demande?: string
          devise?: string
          duree_mois?: number | null
          id?: string
          montant: number
          motif?: string | null
          statut?: string
          type_credit: string
        }
        Update: {
          client_id?: string
          date_decision?: string | null
          date_demande?: string
          devise?: string
          duree_mois?: number | null
          id?: string
          montant?: number
          motif?: string | null
          statut?: string
          type_credit?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_demande_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_credit"
            referencedColumns: ["id"]
          },
        ]
      }
      logs_suivi_scoring: {
        Row: {
          created_at: string
          demande_id: string
          details: Json | null
          id: string
          type_log: string
        }
        Insert: {
          created_at?: string
          demande_id: string
          details?: Json | null
          id?: string
          type_log: string
        }
        Update: {
          created_at?: string
          demande_id?: string
          details?: Json | null
          id?: string
          type_log?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_log_demande"
            columns: ["demande_id"]
            isOneToOne: false
            referencedRelation: "demandes_credit"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_transaction: {
        Row: {
          client_id: string
          created_at: string
          id: string
          message: string | null
          sent_at: string | null
          statut: string
          transaction_id: string | null
          type_notif: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          message?: string | null
          sent_at?: string | null
          statut?: string
          transaction_id?: string | null
          type_notif: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          message?: string | null
          sent_at?: string | null
          statut?: string
          transaction_id?: string | null
          type_notif?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_notif_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_credit"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          trial_ends_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      scores_credit: {
        Row: {
          commentaire: string | null
          date_scoring: string
          demande_id: string
          id: string
          montant_accorde: number | null
          proba_remboursement: number | null
          score_comportement: number | null
          score_octroi: number
          score_recouvrement: number | null
        }
        Insert: {
          commentaire?: string | null
          date_scoring?: string
          demande_id: string
          id?: string
          montant_accorde?: number | null
          proba_remboursement?: number | null
          score_comportement?: number | null
          score_octroi: number
          score_recouvrement?: number | null
        }
        Update: {
          commentaire?: string | null
          date_scoring?: string
          demande_id?: string
          id?: string
          montant_accorde?: number | null
          proba_remboursement?: number | null
          score_comportement?: number | null
          score_octroi?: number
          score_recouvrement?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_score_demande"
            columns: ["demande_id"]
            isOneToOne: false
            referencedRelation: "demandes_credit"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_api_integrations: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          nom_source: string | null
          type_source: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          nom_source?: string | null
          type_source: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          nom_source?: string | null
          type_source?: string
        }
        Relationships: []
      }
      simulation_scoring: {
        Row: {
          created_at: string
          fichier_excel_url: string | null
          id: string
          params: Json | null
          resultat: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          fichier_excel_url?: string | null
          id?: string
          params?: Json | null
          resultat?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          fichier_excel_url?: string | null
          id?: string
          params?: Json | null
          resultat?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_api_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          config: Json
          connected: boolean
          created_at: string
          id: string
          system: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config: Json
          connected?: boolean
          created_at?: string
          id?: string
          system: string
          updated_at?: string
          user_id: string
        }
        Update: {
          config?: Json
          connected?: boolean
          created_at?: string
          id?: string
          system?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
