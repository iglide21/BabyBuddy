import { CreateFeeding, UpdateFeeding } from "@/types/data/feeding/types";

const getFeedings = async () => {
  const response = await fetch("/api/events/feedings");
  return response.json();
};

const getFeeding = async (id: number) => {
  const response = await fetch(`/api/events/feedings/${id}`);
  return response.json();
};

const getFeedingsForBaby = async (babyId: string) => {
  const response = await fetch(`/api/events/feedings?babyId=${babyId}`);
  return response.json();
};

const createFeeding = async (feeding: CreateFeeding) => {
  const response = await fetch("/api/events/feedings", {
    method: "POST",
    body: JSON.stringify(feeding),
  });
  return response.json();
};

const updateFeeding = async (feeding: UpdateFeeding) => {
  const response = await fetch(`/api/events/feedings/${feeding.id}`, {
    method: "PUT",
    body: JSON.stringify(feeding),
  });
  return response.json();
};

const deleteFeeding = async (id: string) => {
  const response = await fetch(`/api/events/feedings/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export {
  getFeedings,
  getFeeding,
  createFeeding,
  updateFeeding,
  deleteFeeding,
  getFeedingsForBaby,
};
