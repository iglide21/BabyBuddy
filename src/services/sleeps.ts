import { CreateSleep, UpdateSleep } from "@/types/data/sleeps/types";

const getSleeps = async () => {
  const response = await fetch("/api/events/sleeps");
  return response.json();
};

const getSleep = async (id: number) => {
  const response = await fetch(`/api/events/sleeps/${id}`);
  return response.json();
};

const createSleep = async (sleep: CreateSleep) => {
  const response = await fetch("/api/events/sleeps", {
    method: "POST",
    body: JSON.stringify(sleep),
  });
  return response.json();
};

const updateSleep = async (sleep: UpdateSleep) => {
  const response = await fetch(`/api/events/sleeps/${sleep.id}`, {
    method: "PUT",
    body: JSON.stringify(sleep),
  });
  return response.json();
};

const deleteSleep = async (id: string) => {
  const response = await fetch(`/api/events/sleeps/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export { getSleeps, getSleep, createSleep, updateSleep, deleteSleep };
