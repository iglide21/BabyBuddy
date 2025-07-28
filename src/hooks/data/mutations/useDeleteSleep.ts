import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { deleteSleep } from "services/sleeps";

export const useDeleteSleep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.SLEEPS],
    mutationFn: deleteSleep,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
