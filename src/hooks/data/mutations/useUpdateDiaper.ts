import { useMutation } from "@tanstack/react-query";
import { updateDiaper } from "@/src/services/diapers";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/lib/constants";

export const useUpdateDiaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiaper,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EVENTS],
      });
    },
  });
};
