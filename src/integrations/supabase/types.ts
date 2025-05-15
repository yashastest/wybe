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
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          user_id?: string | null
        }
        Relationships: []
      }
      creators: {
        Row: {
          created_at: string | null
          id: string
          status: string | null
          telegram: string | null
          user_id: string | null
          wallet: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          status?: string | null
          telegram?: string | null
          user_id?: string | null
          wallet: string
        }
        Update: {
          created_at?: string | null
          id?: string
          status?: string | null
          telegram?: string | null
          user_id?: string | null
          wallet?: string
        }
        Relationships: []
      }
      fee_distributions: {
        Row: {
          amount: number
          created_at: string | null
          creator_wallet: string
          distributed: boolean | null
          distribution_timestamp: string | null
          eligible_timestamp: string | null
          id: string
          token_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          creator_wallet: string
          distributed?: boolean | null
          distribution_timestamp?: string | null
          eligible_timestamp?: string | null
          id?: string
          token_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          creator_wallet?: string
          distributed?: boolean | null
          distribution_timestamp?: string | null
          eligible_timestamp?: string | null
          id?: string
          token_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_distributions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          bonding_curve: Json | null
          created_at: string | null
          creator_wallet: string
          id: string
          launch_date: string | null
          launched: boolean | null
          market_cap: number | null
          name: string
          symbol: string
          token_address: string | null
        }
        Insert: {
          bonding_curve?: Json | null
          created_at?: string | null
          creator_wallet: string
          id?: string
          launch_date?: string | null
          launched?: boolean | null
          market_cap?: number | null
          name: string
          symbol: string
          token_address?: string | null
        }
        Update: {
          bonding_curve?: Json | null
          created_at?: string | null
          creator_wallet?: string
          id?: string
          launch_date?: string | null
          launched?: boolean | null
          market_cap?: number | null
          name?: string
          symbol?: string
          token_address?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          fee: number
          id: string
          price: number
          token_id: string | null
          type: string
          wallet: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee: number
          id?: string
          price: number
          token_id?: string | null
          type: string
          wallet: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee?: number
          id?: string
          price?: number
          token_id?: string | null
          type?: string
          wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_token"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "tokens"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: { input_email: string; input_password: string }
        Returns: {
          id: string
          email: string
        }[]
      }
      calculate_token_price: {
        Args: { total_supply: number; amount: number; curve_type?: string }
        Returns: number
      }
      get_creator_wallet_for_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_platform_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
