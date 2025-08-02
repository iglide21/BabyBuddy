import { Filter, Milk, Moon } from "lucide-react";
import { Badge } from "./ui/badge";
import { HistoryFilterType } from "@/types/data/events/types";

const HistoryFilterSection = ({
  activeFilters,
  toggleFilter,
}: {
  activeFilters: Set<HistoryFilterType>;
  toggleFilter: (filter: HistoryFilterType) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium text-gray-700">Filter by</h3>
      <div className="flex gap-2">
        <Badge
          variant={activeFilters.has("feeding") ? "default" : "outline"}
          className={`cursor-pointer lg:hover:bg-orange-100 ${
            activeFilters.has("feeding")
              ? "bg-orange-400 hover:bg-orange-400"
              : "border-orange-400 "
          }`}
          onClick={() => toggleFilter("feeding")}
        >
          <Milk className="w-3 h-3 mr-1" />
          Feedings
        </Badge>
        <Badge
          variant={activeFilters.has("sleep") ? "default" : "outline"}
          className={`cursor-pointer lg:hover:bg-blue-100 ${
            activeFilters.has("sleep")
              ? "bg-blue-400 hover:bg-blue-400"
              : "border-blue-400 "
          }`}
          onClick={() => toggleFilter("sleep")}
        >
          <Moon className="w-3 h-3 mr-1" />
          Sleep
        </Badge>
        <Badge
          variant={activeFilters.has("diaper") ? "default" : "outline"}
          className={`cursor-pointer lg:hover:bg-green-100 ${
            activeFilters.has("diaper")
              ? "bg-green-400 hover:bg-green-400"
              : "border-green-400"
          }`}
          onClick={() => toggleFilter("diaper")}
        >
          <span className="mr-1">💩</span>
          Diapers
        </Badge>
      </div>
    </div>
  );
};

export default HistoryFilterSection;
