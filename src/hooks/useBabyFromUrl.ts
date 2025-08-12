import { useParams } from "next/navigation";
import useBaby from "@/src/hooks/data/queries/useBaby";
import type { Baby } from "@/types/data/babies/types";

export const useBabyFromUrl = () => {
  const params = useParams();
  const babyId = params.id as string;

  const { data: currentBaby, isLoading, isError } = useBaby(babyId);

  return {
    currentBaby: currentBaby as Baby,
    isLoading,
    isError,
  };
};
