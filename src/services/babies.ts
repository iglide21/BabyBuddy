import type {
  Baby,
  CreateBaby,
  UpdateBaby,
  UpdateBabyWithHistory,
} from "@/types/data/babies/types";

export const getBaby = async (babyId: string) => {
  const response = await fetch(`/api/babies/${babyId}`);
  return response.json();
};

const getBabies = async () => {
  const response = await fetch("/api/babies");
  return response.json();
};

const createBaby = async (baby: CreateBaby): Promise<Baby> => {
  const response = await fetch("/api/babies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(baby),
  });

  return response.json();
};

const updateBaby = async (babyId: string, baby: UpdateBaby) => {
  const response = await fetch(`/api/babies/${babyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(baby),
  });
  return response.json();
};

const updateBabyWithHistory = async (updateData: UpdateBabyWithHistory) => {
  const response = await fetch(`/api/babies/${updateData.babyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentValues: updateData.currentValues,
      previousValues: updateData.previousValues,
    }),
  });
  return response.json();
};

export { getBabies, createBaby, updateBaby, updateBabyWithHistory };
