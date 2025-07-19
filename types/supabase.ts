export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      babies: {
        Row: {
          birth_date: string
          created_at: string
          gender: Database["public"]["Enums"]["Gender"]
          id: number
          name: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          gender: Database["public"]["Enums"]["Gender"]
          id?: number
          name: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          gender?: Database["public"]["Enums"]["Gender"]
          id?: number
          name?: string
        }
        Relationships: []
      }
      diapers: {
        Row: {
          baby_id: number
          changed_at: string
          color: Database["public"]["Enums"]["DiaperColor"] | null
          created_at: string
          id: number
          note: string
          type: Database["public"]["Enums"]["DiaperType"]
        }
        Insert: {
          baby_id: number
          changed_at: string
          color?: Database["public"]["Enums"]["DiaperColor"] | null
          created_at?: string
          id?: number
          note: string
          type: Database["public"]["Enums"]["DiaperType"]
        }
        Update: {
          baby_id?: number
          changed_at?: string
          color?: Database["public"]["Enums"]["DiaperColor"] | null
          created_at?: string
          id?: number
          note?: string
          type?: Database["public"]["Enums"]["DiaperType"]
        }
        Relationships: [
          {
            foreignKeyName: "diapers_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      feedings: {
        Row: {
          amount_ml: number | null
          baby_id: number
          created_at: string
          duration_minutes: number | null
          id: number
          note: string | null
          type: Database["public"]["Enums"]["Feeding type"]
        }
        Insert: {
          amount_ml?: number | null
          baby_id: number
          created_at?: string
          duration_minutes?: number | null
          id?: number
          note?: string | null
          type: Database["public"]["Enums"]["Feeding type"]
        }
        Update: {
          amount_ml?: number | null
          baby_id?: number
          created_at?: string
          duration_minutes?: number | null
          id?: number
          note?: string | null
          type?: Database["public"]["Enums"]["Feeding type"]
        }
        Relationships: [
          {
            foreignKeyName: "feedings_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      naps: {
        Row: {
          baby_id: number
          created_at: string
          duration_minutes: number
          end_date: string
          id: number
          note: string | null
          start_date: string
        }
        Insert: {
          baby_id: number
          created_at?: string
          duration_minutes: number
          end_date: string
          id?: number
          note?: string | null
          start_date: string
        }
        Update: {
          baby_id?: number
          created_at?: string
          duration_minutes?: number
          end_date?: string
          id?: number
          note?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "naps_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      all_events_today: {
        Row: {
          amount_ml: number | null
          created_at: string | null
          duration_minutes: number | null
          id: number | null
          note: string | null
          type: Database["public"]["Enums"]["Feeding type"] | null
        }
        Relationships: []
      }
      all_events_view: {
        Row: {
          amount: number | null
          baby_id: number | null
          changed_at: string | null
          color: string | null
          created_at: string | null
          diaper_type: string | null
          duration: number | null
          end_date: string | null
          event_type: string | null
          feeding_type: string | null
          id: number | null
          note: string | null
          start_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      DiaperColor:
        | "yellow"
        | "green"
        | "brown"
        | "orange"
        | "black"
        | "red"
        | "white_gray"
        | "pink_specks"
      DiaperType: "wet" | "dirty" | "both"
      "Feeding type": "breast" | "bottle" | "solid"
      Gender: "male" | "female" | "other"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      DiaperColor: [
        "yellow",
        "green",
        "brown",
        "orange",
        "black",
        "red",
        "white_gray",
        "pink_specks",
      ],
      DiaperType: ["wet", "dirty", "both"],
      "Feeding type": ["breast", "bottle", "solid"],
      Gender: ["male", "female", "other"],
    },
  },
} as const
