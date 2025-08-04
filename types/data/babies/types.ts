import { Database } from "@/types/supabase";

export type Baby = Database["public"]["Tables"]["babies"]["Row"];

export type CreateBaby = Omit<Baby, "id" | "created_at">;

export type UpdateBaby = Partial<Omit<Baby, "created_at">>;

export type DeleteBaby = Pick<Baby, "id">;

// New types for normalized baby updates
export type BabyMeasurement =
  Database["public"]["Tables"]["baby_measurements"]["Row"];
export type BabyProfileHistory =
  Database["public"]["Tables"]["baby_profile_history"]["Row"];

export type UpdateBabyWithHistory = {
  babyId: string;
  currentValues: Partial<UpdateBaby>;
  previousValues: Partial<Baby>;
};
