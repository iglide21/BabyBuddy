export type Feeding = {
  id: string;
  timestamp: Date;
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
