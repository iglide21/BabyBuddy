import { useQuery } from "@tanstack/react-query";
import { getEventsForBaby } from "@/src/services/events";
import { Event } from "@/types/data/events/types";

const useEvents = (babyId: string) => {
  return useQuery<Event[]>({
    queryKey: ["events", babyId],
    queryFn: () => getEventsForBaby(babyId),
    enabled: !!babyId,
  });
};

export default useEvents;
