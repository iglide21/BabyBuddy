import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { deleteDiaper } from "services/diapers";

export const useDeleteDiaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.DIAPERS],
    mutationFn: deleteDiaper,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
