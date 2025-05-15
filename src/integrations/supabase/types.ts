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
      battle_rewards: {
        Row: {
          battle_room_id: string | null
          battle_token_id: string | null
          claimed: boolean | null
          claimed_at: string | null
          id: string
          reward_amount: number
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          battle_room_id?: string | null
          battle_token_id?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          id?: string
          reward_amount: number
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          battle_room_id?: string | null
          battle_token_id?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          id?: string
          reward_amount?: number
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_rewards_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "battle_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_rewards_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "view_active_battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_rewards_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "view_token_leaderboard"
            referencedColumns: ["battle_room_id"]
          },
          {
            foreignKeyName: "battle_rewards_battle_token_id_fkey"
            columns: ["battle_token_id"]
            isOneToOne: false
            referencedRelation: "battle_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_rewards_battle_token_id_fkey"
            columns: ["battle_token_id"]
            isOneToOne: false
            referencedRelation: "view_token_leaderboard"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_rooms: {
        Row: {
          battle_end_time: string
          created_at: string | null
          id: string
          max_participants: number
          participant_count: number | null
          platform_fee_percentage: number
          room_id: string
          status: string
          total_fees_collected: number | null
          waiting_time_end: string
          winner_token_id: string | null
        }
        Insert: {
          battle_end_time: string
          created_at?: string | null
          id?: string
          max_participants: number
          participant_count?: number | null
          platform_fee_percentage?: number
          room_id: string
          status: string
          total_fees_collected?: number | null
          waiting_time_end: string
          winner_token_id?: string | null
        }
        Update: {
          battle_end_time?: string
          created_at?: string | null
          id?: string
          max_participants?: number
          participant_count?: number | null
          platform_fee_percentage?: number
          room_id?: string
          status?: string
          total_fees_collected?: number | null
          waiting_time_end?: string
          winner_token_id?: string | null
        }
        Relationships: []
      }
      battle_tokens: {
        Row: {
          battle_room_id: string | null
          created_at: string | null
          creator_wallet: string
          current_market_cap: number | null
          id: string
          initial_supply: number
          is_winner: boolean | null
          token_address: string | null
          token_name: string
          token_symbol: string
          total_fees: number | null
        }
        Insert: {
          battle_room_id?: string | null
          created_at?: string | null
          creator_wallet: string
          current_market_cap?: number | null
          id?: string
          initial_supply: number
          is_winner?: boolean | null
          token_address?: string | null
          token_name: string
          token_symbol: string
          total_fees?: number | null
        }
        Update: {
          battle_room_id?: string | null
          created_at?: string | null
          creator_wallet?: string
          current_market_cap?: number | null
          id?: string
          initial_supply?: number
          is_winner?: boolean | null
          token_address?: string | null
          token_name?: string
          token_symbol?: string
          total_fees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battle_tokens_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "battle_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_tokens_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "view_active_battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_tokens_battle_room_id_fkey"
            columns: ["battle_room_id"]
            isOneToOne: false
            referencedRelation: "view_token_leaderboard"
            referencedColumns: ["battle_room_id"]
          },
        ]
      }
      battle_trades: {
        Row: {
          amount: number
          battle_token_id: string | null
          fee_amount: number
          id: string
          timestamp: string | null
          trade_type: string
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          amount: number
          battle_token_id?: string | null
          fee_amount: number
          id?: string
          timestamp?: string | null
          trade_type: string
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          amount?: number
          battle_token_id?: string | null
          fee_amount?: number
          id?: string
          timestamp?: string | null
          trade_type?: string
          tx_hash?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_trades_battle_token_id_fkey"
            columns: ["battle_token_id"]
            isOneToOne: false
            referencedRelation: "battle_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_trades_battle_token_id_fkey"
            columns: ["battle_token_id"]
            isOneToOne: false
            referencedRelation: "view_token_leaderboard"
            referencedColumns: ["id"]
          },
        ]
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
      trades: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          side: string
          token_symbol: string
          tx_hash: string | null
          wallet_address: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          side: string
          token_symbol: string
          tx_hash?: string | null
          wallet_address: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          side?: string
          token_symbol?: string
          tx_hash?: string | null
          wallet_address?: string
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
      view_active_battles: {
        Row: {
          battle_end_time: string | null
          battle_status: string | null
          id: string | null
          max_participants: number | null
          participant_count: number | null
          room_id: string | null
          seconds_remaining: number | null
          seconds_to_start: number | null
          status: string | null
          waiting_time_end: string | null
        }
        Insert: {
          battle_end_time?: string | null
          battle_status?: never
          id?: string | null
          max_participants?: number | null
          participant_count?: number | null
          room_id?: string | null
          seconds_remaining?: never
          seconds_to_start?: never
          status?: string | null
          waiting_time_end?: string | null
        }
        Update: {
          battle_end_time?: string | null
          battle_status?: never
          id?: string | null
          max_participants?: number | null
          participant_count?: number | null
          room_id?: string | null
          seconds_remaining?: never
          seconds_to_start?: never
          status?: string | null
          waiting_time_end?: string | null
        }
        Relationships: []
      }
      view_token_leaderboard: {
        Row: {
          battle_room_id: string | null
          battle_status: string | null
          creator_wallet: string | null
          current_market_cap: number | null
          id: string | null
          initial_supply: number | null
          is_winner: boolean | null
          room_id: string | null
          room_status: string | null
          token_name: string | null
          token_symbol: string | null
          total_fees: number | null
        }
        Relationships: []
      }
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
