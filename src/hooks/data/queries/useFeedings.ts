import { Feeding } from "@/types/data/feeding/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { getFeedings } from "services/feedings";

export const useFeedings = () => {
  return useQuery<Feeding[]>({
    queryKey: [QUERY_KEYS.FEEDINGS],
    queryFn: getFeedings,
  });
};
