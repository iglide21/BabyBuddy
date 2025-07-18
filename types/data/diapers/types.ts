export type Diaper = {
  id: string;
  timestamp: Date;
  type: "wet" | "dirty" | "both";
  notes?: string;
};

export type CreateDiaper = Omit<Diaper, "id">;

export type UpdateDiaper = Partial<Diaper>;

export type DeleteDiaper = {
  id: string;
};
