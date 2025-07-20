"use client";

import { useFeedings, useSleeps, useDiapers } from "../hooks/data/queries";
import useEvents from "../hooks/data/queries/useEvents";
import { getTodayString } from "../lib/dayjs";
import StatsCard from "./stats-card";
import { Milk, Moon } from "lucide-react";

const QuickStats = () => {
  const { data: events, isLoading } = useEvents("1", getTodayString());

  const feedings = events?.filter((event) => event.event_type === "feeding");
  const sleeps = events?.filter((event) => event.event_type === "sleep");
  const diapers = events?.filter((event) => event.event_type === "diaper");

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
        isLoading={isLoading}
      />

      <StatsCard
        events={diapers}
        icon={<span className="text-2xl">💩</span>}
        title="Diapers"
        color="green"
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuickStats;
