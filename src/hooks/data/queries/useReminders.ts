import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { getReminders } from "services/reminders";

export const useReminders = (babyId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REMINDERS, babyId],
    queryFn: () => getReminders(babyId),
    enabled: !!babyId,
  });
};
