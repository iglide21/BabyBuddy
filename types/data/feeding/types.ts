import { Nullable } from "@/types/common";
import { Database } from "@/types/supabase";

export type Feeding = Database["public"]["Tables"]["feedings"]["Row"];

export type CreateFeeding = Omit<Feeding, "id" | "created_at">;

export type UpdateFeeding = Partial<Omit<Feeding, "created_at">>;

export type DeleteFeeding = Pick<Feeding, "id">;
