import { Diaper } from "@/types/data/diapers/types";

const getDiapers = async () => {
  const response = await fetch("/api/events/diapers");
  return response.json();
};

const createDiaper = async (diaper: Diaper) => {
  const response = await fetch("/api/events/diapers", {
    method: "POST",
    body: JSON.stringify(diaper),
  });
  return response.json();
};

const updateDiaper = async (diaper: Diaper) => {
  const response = await fetch(`/api/events/diapers/${diaper.id}`, {
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

export { getDiapers, createDiaper, updateDiaper, deleteDiaper };
