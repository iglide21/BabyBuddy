import { useMutation } from "@tanstack/react-query";
import { updateFeeding } from "@/src/services/feedings";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateFeeding } from "@/types/data/feeding/types";
import { QUERY_KEYS } from "@/src/lib/constants";

export const useUpdateFeeding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFeeding) => updateFeeding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });
};
