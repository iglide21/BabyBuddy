import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/lib/constants";
import { createBaby } from "@/src/services/babies";
import type { CreateBaby } from "@/types/data/babies/types";
import { toast } from "sonner";
import { useApplicationStore } from "@/src/stores/applicationStore";

export const useCreateBaby = () => {
  const queryClient = useQueryClient();

  const closeModal = useApplicationStore.use.closeModal();
  const showModal = useApplicationStore.use.showModal();

  return useMutation({
    mutationKey: [QUERY_KEYS.BABIES],
    mutationFn: (baby: CreateBaby) => createBaby(baby),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BABIES],
      });
      closeModal();
      showModal({
        type: "onboarding_quiz",
        data: {
          baby: data,
        },
      });
      toast.success("Baby profile added!", {
        description: "Your baby's profile was added successfully.",
      });
    },
    onError: (error: any) => {
      closeModal();
      toast.error(error?.message || "Failed to add the baby profile.", {
        description: "Please try again.",
      });
    },
  });
};
