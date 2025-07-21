import { Database } from "@/types/supabase";

export type Sleep = Database["public"]["Tables"]["naps"]["Row"];

export type CreateSleep = Omit<Sleep, "id" | "created_at">;

export type UpdateSleep = Partial<Omit<Sleep, "created_at">>;

export type DeleteSleep = Pick<Sleep, "id">;
