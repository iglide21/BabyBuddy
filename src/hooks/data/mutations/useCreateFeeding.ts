import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { createFeeding } from "services/feedings";

export const useCreateFeeding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.FEEDINGS],
    mutationFn: createFeeding,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
