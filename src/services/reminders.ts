import type {
  Reminder,
  CreateReminder,
  UpdateReminder,
} from "@/types/data/reminders/types";

export const getReminders = async (babyId: string): Promise<Reminder[]> => {
  const response = await fetch(`/api/reminders?babyId=${babyId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch reminders");
  }

  return response.json();
};

export const createReminder = async (
  reminder: CreateReminder
): Promise<Reminder> => {
  const response = await fetch("/api/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create reminder");
  }

  return response.json();
};

export const updateReminder = async (
  id: string,
  reminder: UpdateReminder
): Promise<Reminder> => {
  const response = await fetch(`/api/reminders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update reminder");
  }

  return response.json();
};

export const deleteReminder = async (id: string): Promise<void> => {
  const response = await fetch(`/api/reminders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete reminder");
  }
};
