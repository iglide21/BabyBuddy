import { Sleep } from "@/types/data/sleeps/types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "lib/constants";
import { getSleeps } from "services/sleeps";

export const useSleeps = () => {
  return useQuery<Sleep[]>({
    queryKey: [QUERY_KEYS.SLEEP],
    queryFn: getSleeps,
  });
};
