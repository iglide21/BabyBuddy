import { useQuery } from "@tanstack/react-query";
import { getEventsForBaby } from "@/src/services/events";
import { Event } from "@/types/data/events/types";

const useEvents = (babyId: string, date?: string) => {
  return useQuery<Event[]>({
    queryKey: ["events", babyId, date],
    queryFn: () => getEventsForBaby(babyId, date),
    enabled: !!babyId,
  });
};

export default useEvents;
