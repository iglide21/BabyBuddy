import { Database } from "@/types/supabase";

export type Diaper = Database["public"]["Tables"]["diapers"]["Row"];

export type CreateDiaper = Omit<Diaper, "id" | "created_at">;

export type UpdateDiaper = Partial<Omit<Diaper, "created_at">>;

export type DeleteDiaper = Pick<Diaper, "id">;
