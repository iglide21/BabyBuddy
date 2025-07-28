import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { createDiaper } from "services/diapers";

export const useCreateDiaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DIAPERS],
    mutationFn: createDiaper,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
