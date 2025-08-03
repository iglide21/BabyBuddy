import type { CreateBaby, UpdateBaby } from "@/types/data/babies/types";

export const getBaby = async (babyId: string) => {
  const response = await fetch(`/api/babies/${babyId}`);
  return response.json();
};

const getBabies = async (userId: string) => {
  const response = await fetch(`/api/babies?userId=${userId}`);
  return response.json();
};

const createBaby = async (
  baby: CreateBaby,
  userId: string,
  accessToken: string
) => {
  const response = await fetch(`/api/babies?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(baby),
  });
  return response.json();
};

const updateBaby = async (
  babyId: string,
  baby: UpdateBaby,
  accessToken: string
) => {
  const response = await fetch(`/api/babies/${babyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(baby),
  });
  return response.json();
};

export { getBabies, createBaby, updateBaby };
