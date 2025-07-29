import type { Database } from "@/types/supabase";

export type Reminder = Database["public"]["Tables"]["reminders"]["Row"];
export type CreateReminder =
  Database["public"]["Tables"]["reminders"]["Insert"];
export type UpdateReminder =
  Database["public"]["Tables"]["reminders"]["Update"];
export type ReminderType = Database["public"]["Enums"]["Reminder type"];
