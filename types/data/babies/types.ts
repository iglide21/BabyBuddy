import { Database } from "@/types/supabase";

export type Baby = Database["public"]["Tables"]["babies"]["Row"];

export type CreateBaby = Omit<Baby, "id" | "created_at">;

export type UpdateBaby = Partial<Omit<Baby, "created_at">>;

export type DeleteBaby = Pick<Baby, "id">;
