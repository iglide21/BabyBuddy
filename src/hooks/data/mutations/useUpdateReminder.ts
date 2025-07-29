import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { updateReminder } from "services/reminders";
import type { UpdateReminder } from "@/types/data/reminders/types";

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REMINDERS],
    mutationFn: ({ id, reminder }: { id: string; reminder: UpdateReminder }) =>
      updateReminder(id, reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REMINDERS],
      });
    },
  });
};
