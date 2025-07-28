import { BabyEvents } from "@/types/common";

const getEventsForBaby = async (
  babyId: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams({ babyId });

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const response = await fetch(`/api/events?${params.toString()}`);
  return response.json();
};

export { getEventsForBaby };
