export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
          allergies: string[] | null
          birth_date: string
          birth_length: number | null
          birth_weight: number | null
          blood_type: Database["public"]["Enums"]["BloodType"] | null
          created_at: string
          current_length: number | null
          current_weight: number | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          gender: Database["public"]["Enums"]["Gender"]
          head_circumference: number | null
          id: string
          medications: string[] | null
          name: string
          notes: string | null
          pediatrician_email: string | null
          pediatrician_name: string | null
          pediatrician_phone: string | null
        }
        Insert: {
          allergies?: string[] | null
          birth_date: string
          birth_length?: number | null
          birth_weight?: number | null
          blood_type?: Database["public"]["Enums"]["BloodType"] | null
          created_at?: string
          current_length?: number | null
          current_weight?: number | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender: Database["public"]["Enums"]["Gender"]
          head_circumference?: number | null
          id?: string
          medications?: string[] | null
          name: string
          notes?: string | null
          pediatrician_email?: string | null
          pediatrician_name?: string | null
          pediatrician_phone?: string | null
        }
        Update: {
          allergies?: string[] | null
          birth_date?: string
          birth_length?: number | null
          birth_weight?: number | null
          blood_type?: Database["public"]["Enums"]["BloodType"] | null
          created_at?: string
          current_length?: number | null
          current_weight?: number | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender?: Database["public"]["Enums"]["Gender"]
          head_circumference?: number | null
          id?: string
          medications?: string[] | null
          name?: string
          notes?: string | null
          pediatrician_email?: string | null
          pediatrician_name?: string | null
          pediatrician_phone?: string | null
        }
        Relationships: []
      }
      baby_guardians: {
        Row: {
          baby_id: string
          created_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "baby_guardians_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      baby_measurements: {
        Row: {
          baby_id: string
          "head-circumference_cm": number | null
          id: number
          length_cm: number | null
          measured_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          baby_id: string
          "head-circumference_cm"?: number | null
          id?: number
          length_cm?: number | null
          measured_at: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          baby_id?: string
          "head-circumference_cm"?: number | null
          id?: number
          length_cm?: number | null
          measured_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "baby_measurements_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      baby_profile_history: {
        Row: {
          baby_id: string
          changed_at: string
          field: string
          id: string
          new_value: Json
          old_value: Json | null
          section: Database["public"]["Enums"]["BabySettingsSections"]
          user_id: string
          value_type: Database["public"]["Enums"]["SettingValueType"]
        }
        Insert: {
          baby_id: string
          changed_at: string
          field: string
          id?: string
          new_value: Json
          old_value?: Json | null
          section: Database["public"]["Enums"]["BabySettingsSections"]
          user_id: string
          value_type?: Database["public"]["Enums"]["SettingValueType"]
        }
        Update: {
          baby_id?: string
          changed_at?: string
          field?: string
          id?: string
          new_value?: Json
          old_value?: Json | null
          section?: Database["public"]["Enums"]["BabySettingsSections"]
          user_id?: string
          value_type?: Database["public"]["Enums"]["SettingValueType"]
        }
        Relationships: [
          {
            foreignKeyName: "baby_profile_history_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      breastfeeding_segments: {
        Row: {
          baby_id: string
          created_at: string
          end_at: string
          feeding_id: number | null
          id: number
          side: Database["public"]["Enums"]["BreastSide"] | null
          start_at: string
        }
        Insert: {
          baby_id: string
          created_at: string
          end_at: string
          feeding_id?: number | null
          id?: number
          side?: Database["public"]["Enums"]["BreastSide"] | null
          start_at: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          end_at?: string
          feeding_id?: number | null
          id?: number
          side?: Database["public"]["Enums"]["BreastSide"] | null
          start_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "breastfeeding_segments_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breastfeeding_segments_feeding_id_fkey"
            columns: ["feeding_id"]
            isOneToOne: false
            referencedRelation: "feedings"
            referencedColumns: ["id"]
          },
        ]
      }
      diapers: {
        Row: {
          baby_id: string
          color: Database["public"]["Enums"]["DiaperColor"] | null
          created_at: string
          id: number
          note: string
          occurred_at: string
          type: Database["public"]["Enums"]["DiaperType"]
        }
        Insert: {
          baby_id: string
          color?: Database["public"]["Enums"]["DiaperColor"] | null
          created_at?: string
          id?: number
          note: string
          occurred_at?: string
          type: Database["public"]["Enums"]["DiaperType"]
        }
        Update: {
          baby_id?: string
          color?: Database["public"]["Enums"]["DiaperColor"] | null
          created_at?: string
          id?: number
          note?: string
          occurred_at?: string
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
          baby_id: string
          created_at: string
          duration_minutes: number | null
          id: number
          note: string | null
          occurred_at: string
          type: Database["public"]["Enums"]["Feeding type"]
        }
        Insert: {
          amount_ml?: number | null
          baby_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: number
          note?: string | null
          occurred_at?: string
          type: Database["public"]["Enums"]["Feeding type"]
        }
        Update: {
          amount_ml?: number | null
          baby_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: number
          note?: string | null
          occurred_at?: string
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
      reminders: {
        Row: {
          baby_id: string
          created_at: string
          end_time: string
          id: string
          interval_minutes: number | null
          is_active: boolean
          label: string
          last_triggered: string | null
          start_time: string
          time_of_day: string | null
          type: Database["public"]["Enums"]["Reminder type"]
        }
        Insert: {
          baby_id: string
          created_at: string
          end_time: string
          id?: string
          interval_minutes?: number | null
          is_active: boolean
          label: string
          last_triggered?: string | null
          start_time: string
          time_of_day?: string | null
          type: Database["public"]["Enums"]["Reminder type"]
        }
        Update: {
          baby_id?: string
          created_at?: string
          end_time?: string
          id?: string
          interval_minutes?: number | null
          is_active?: boolean
          label?: string
          last_triggered?: string | null
          start_time?: string
          time_of_day?: string | null
          type?: Database["public"]["Enums"]["Reminder type"]
        }
        Relationships: [
          {
            foreignKeyName: "reminders_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "babies"
            referencedColumns: ["id"]
          },
        ]
      }
      sleeps: {
        Row: {
          baby_id: string
          created_at: string
          duration_minutes: number
          end_date: string | null
          id: number
          note: string | null
          start_date: string
        }
        Insert: {
          baby_id: string
          created_at?: string
          duration_minutes: number
          end_date?: string | null
          id?: number
          note?: string | null
          start_date: string
        }
        Update: {
          baby_id?: string
          created_at?: string
          duration_minutes?: number
          end_date?: string | null
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
      all_events_view: {
        Row: {
          amount: number | null
          baby_id: string | null
          color: string | null
          diaper_type: string | null
          duration: number | null
          end_date: string | null
          event_type: string | null
          feeding_type: string | null
          id: number | null
          note: string | null
          occurred_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      BabySettingsSections: "birth" | "measurements" | "medical" | "notes"
      BloodType:
        | "A"
        | "B"
        | "AB"
        | "O"
        | "A+"
        | "A-"
        | "B+"
        | "B-"
        | "AB+"
        | "AB-"
        | "O+"
        | "O-"
      BreastSide: "left" | "right"
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
      "Reminder type": "daily" | "interval"
      SettingValueType: "string" | "array" | "number"
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
      BabySettingsSections: ["birth", "measurements", "medical", "notes"],
      BloodType: [
        "A",
        "B",
        "AB",
        "O",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      BreastSide: ["left", "right"],
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
      "Reminder type": ["daily", "interval"],
      SettingValueType: ["string", "array", "number"],
    },
  },
} as const