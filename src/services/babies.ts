import type { CreateBaby } from "@/types/data/babies/types";
import { useAuth } from "../hooks/useAuth";

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

export { getBabies, createBaby };
