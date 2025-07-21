import { QUERY_KEYS } from "@/src/lib/constants";
import { getBaby } from "@/src/services/babies";
import { useQuery } from "@tanstack/react-query";

const useBaby = (babyId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.BABY, babyId],
    queryFn: () => getBaby(babyId),
  });

  return { data, isLoading, isError };
};

export default useBaby;
