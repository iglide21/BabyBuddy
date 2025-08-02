import { Database } from "@/types/supabase";

export type Event = Database["public"]["Views"]["all_events_view"]["Row"];

export type HistoryFilterType = "feeding" | "sleep" | "diaper";
