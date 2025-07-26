import { useQuery } from "@tanstack/react-query";
import { getDiaper } from "@/src/services/diapers";

const useDiaper = (id: number | undefined) => {
  return useQuery({
    queryKey: ["diaper", id],
    queryFn: () => getDiaper(id!),
    enabled: !!id,
  });
};

export default useDiaper;
