import { Diaper } from "@/types/data/diapers/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { getDiapers } from "services/diapers";

export const useDiapers = () => {
  return useQuery<Diaper[]>({
    queryKey: [QUERY_KEYS.DIAPERs],
    queryFn: getDiapers,
  });
};
