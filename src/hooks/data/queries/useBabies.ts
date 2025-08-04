import { QUERY_KEYS } from "@/src/lib/constants";
import { getBabies } from "@/src/services/babies";
import { useQuery } from "@tanstack/react-query";
import { Baby } from "@/types/data/babies/types";

const useBabies = () => {
  const { data, isLoading, isError } = useQuery<Baby[]>({
    queryKey: [QUERY_KEYS.BABIES],
    queryFn: () => getBabies(),
  });

  return { data, isLoading, isError };
};

export default useBabies;
