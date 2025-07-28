import { useQuery } from "@tanstack/react-query";
import { getEventsForBaby } from "@/src/services/events";
import { Event } from "@/types/data/events/types";
import { QUERY_KEYS } from "@/src/lib/constants";

const useEvents = (babyId?: string, startDate?: string, endDate?: string) => {
  const isEnabled = !!babyId;

  return useQuery<Event[]>({
    queryKey: [QUERY_KEYS.EVENTS, babyId, startDate, endDate],
    queryFn: () => getEventsForBaby(babyId!, startDate, endDate),
    enabled: isEnabled,
  });
};

export default useEvents;
