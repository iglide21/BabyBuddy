import { QUERY_KEYS } from "@/src/lib/constants";
import { getBabies } from "@/src/services/babies";
import { useQuery } from "@tanstack/react-query";
import { Baby } from "@/types/data/babies/types";

const useBabies = (userId: string) => {
  const { data, isLoading, isError } = useQuery<Baby[]>({
    queryKey: [QUERY_KEYS.BABIES, userId],
    queryFn: () => getBabies(userId),
    enabled: !!userId,
  });

  return { data, isLoading, isError };
};

export default useBabies;
