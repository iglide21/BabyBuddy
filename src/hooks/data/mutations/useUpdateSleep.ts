import { useMutation } from "@tanstack/react-query";
import { updateSleep } from "@/src/services/sleeps";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateSleep } from "@/types/data/sleeps/types";
import { QUERY_KEYS } from "@/src/lib/constants";

export const useUpdateSleep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSleep) => updateSleep(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] });
    },
  });
};
