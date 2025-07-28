import { useQuery } from "@tanstack/react-query";
import { getSleep } from "@/src/services/sleeps";
import { useMemo } from "react";

export const useSleep = (id: number | undefined, isOpened: boolean) => {
  const isEnabled = useMemo(() => !!id && isOpened, [id, isOpened]);

  return useQuery({
    queryKey: ["sleep", id],
    queryFn: () => getSleep(id!),
    enabled: isEnabled,
  });
};
