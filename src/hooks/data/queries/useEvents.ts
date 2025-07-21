import { useQuery } from "@tanstack/react-query";
import { getEventsForBaby } from "@/src/services/events";
import { Event } from "@/types/data/events/types";

const useEvents = (babyId?: string, date?: string) => {
  const isEnabled = !!babyId;

  return useQuery<Event[]>({
    queryKey: ["events", babyId, date],
    queryFn: () => getEventsForBaby(babyId!, date),
    enabled: isEnabled,
  });
};

export default useEvents;
