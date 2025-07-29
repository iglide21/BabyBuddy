import { QUERY_KEYS } from "@/src/lib/constants";
import { getBaby } from "@/src/services/babies";
import { useQuery } from "@tanstack/react-query";

const useBaby = (babyId?: string, enabled = true) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.BABY, babyId],
    queryFn: () => getBaby(babyId!),
    enabled: !!babyId && enabled,
    staleTime: 1000 * 60 * 60 * 1, // 1 hour - baby data rarely changes
    gcTime: 1000 * 60 * 60 * 24 * 1, // 1 day - keep in cache for a day
  });

  return { data, isLoading, isError };
};

export default useBaby;
