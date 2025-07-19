"use client";

import { useFeedings, useSleeps, useDiapers } from "../hooks/data/queries";
import StatsCard from "./stats-card";
import { Milk, Moon } from "lucide-react";

const QuickStats = () => {
  const { data: feedings, isLoading } = useFeedings();
  const { data: sleeps, isLoading: isLoadingSleeps } = useSleeps();
  const { data: diapers, isLoading: isLoadingDiapers } = useDiapers();

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatsCard
        events={feedings}
        icon={<Milk className="w-8 h-8 text-orange-600" />}
        title="Feedings"
        color="orange"
        isLoading={isLoading}
      />

      <StatsCard
        events={sleeps}
        icon={<Moon className="w-8 h-8 text-blue-600" />}
        title="Sleep"
        color="blue"
        isLoading={isLoadingSleeps}
      />

      <StatsCard
        events={diapers}
        icon={<span className="text-2xl">💩</span>}
        title="Diapers"
        color="green"
        isLoading={isLoadingDiapers}
      />
    </div>
  );
};

export default QuickStats;
