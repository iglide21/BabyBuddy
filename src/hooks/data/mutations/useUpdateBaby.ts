import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/lib/constants";
import { updateBaby } from "@/src/services/babies";
import type { UpdateBaby } from "@/types/data/babies/types";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";

export const useUpdateBaby = () => {
  const queryClient = useQueryClient();
  const session = useAuth();
  const userId = session?.user?.id;
  const accessToken = session?.access_token;

  return useMutation({
    mutationFn: ({ babyId, baby }: { babyId: string; baby: UpdateBaby }) =>
      updateBaby(babyId, baby, userId || "", accessToken || ""),
    onSuccess: (_, { babyId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BABY, babyId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BABIES, userId],
      });
      toast.success("Baby profile updated!", {
        description: "Your baby's profile was updated successfully.",
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update the baby profile.", {
        description: "Please try again.",
      });
    },
  });
};
