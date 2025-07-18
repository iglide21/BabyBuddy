export type Feeding = {
  id: string;
  created_at: string; // Supabase returns timestamps as ISO strings
  type: "breast" | "bottle" | "solid";
  amount?: number;
  duration?: number;
  notes?: string;
};

export type CreateFeeding = Omit<Feeding, "id">;

export type UpdateFeeding = Partial<Feeding>;

export type DeleteFeeding = {
  id: string;
};
