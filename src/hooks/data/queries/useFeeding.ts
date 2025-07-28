import { useQuery } from "@tanstack/react-query";
import { getFeeding } from "@/src/services/feedings";
import { useMemo } from "react";

export const useFeeding = (id: number | undefined, isOpened: boolean) => {
  const isEnabled = useMemo(() => !!id && isOpened, [id, isOpened]);

  return useQuery({
    queryKey: ["feeding", id],
    queryFn: () => getFeeding(id!),
    enabled: isEnabled,
  });
};
