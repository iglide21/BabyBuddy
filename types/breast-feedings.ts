import { Database } from "./supabase";

export type BreastFeedingSegments =
  Database["public"]["Tables"]["breastfeeding_segments"]["Row"];

export type CreateBreastFeeding = Omit<BreastFeedingSegments, "id" | "created_at" | 'feeding_id' | "baby_id">;