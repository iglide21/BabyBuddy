import { useMutation } from "@tanstack/react-query";
import { updateDiaper } from "@/src/services/diapers";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateDiaper = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiaper,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diapers"] });
    },
  });
};

export default useUpdateDiaper;
