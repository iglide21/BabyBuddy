import { CreateDiaper, Diaper, UpdateDiaper } from "@/types/data/diapers/types";

const getDiaper = async (id: number) => {
  const response = await fetch(`/api/events/diapers/${id}`);
  return response.json();
};

const getDiapers = async () => {
  const response = await fetch("/api/events/diapers");
  return response.json();
};

const createDiaper = async (diaper: CreateDiaper) => {
  const response = await fetch("/api/events/diapers", {
    method: "POST",
    body: JSON.stringify(diaper),
  });
  return response.json();
};

const updateDiaper = async (diaper: UpdateDiaper) => {
  const response = await fetch(`/api/events/diapers/${diaper.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(diaper),
  });
  return response.json();
};

const deleteDiaper = async (id: string) => {
  const response = await fetch(`/api/events/diapers/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export { getDiaper, getDiapers, createDiaper, updateDiaper, deleteDiaper };
