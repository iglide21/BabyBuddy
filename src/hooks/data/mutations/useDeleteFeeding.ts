import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { deleteFeeding } from "services/feedings";

export const useDeleteFeeding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.FEEDINGS],
    mutationFn: deleteFeeding,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
