"use client";

import { useFeedings, useSleeps, useDiapers } from "../hooks/data/queries";
import useEvents from "../hooks/data/queries/useEvents";
import { getEndOfDay, getStartOfDay, getTodayString } from "../lib/dayjs";
import StatsCard from "./stats-card";
import { Milk, Moon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "../hooks/useAuth";
import { useCurrentBabyStore } from "../stores/currentBabyStore";

const QuickStats = () => {
  const currentBaby = useCurrentBabyStore.use.currentBaby();

  const today = getTodayString();
  const startDate = getStartOfDay(today);
  const endDate = getEndOfDay(today);

  const { data: events, isLoading } = useEvents(
    currentBaby?.id,
    startDate.toISOString(),
    endDate.toISOString()
  );

  const feedings = events?.filter((event) => event.event_type === "feeding");
  const sleeps = events?.filter((event) => event.event_type === "sleep");
  const diapers = events?.filter((event) => event.event_type === "diaper");

  if (!events?.length || isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="w-full h-40 rounded-lg bg-gray-200" />
        <Skeleton className="w-full h-40 rounded-lg bg-gray-200" />
        <Skeleton className="w-full h-40 rounded-lg bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatsCard
        events={feedings}
        icon={<Milk className="w-8 h-8 text-orange-600" />}
        title="Feedings"
        color="orange"
      />

      <StatsCard
        events={sleeps}
        icon={<Moon className="w-8 h-8 text-blue-600" />}
        title="Sleep"
        color="blue"
      />

      <StatsCard
        events={diapers}
        icon={<span className="text-2xl">💩</span>}
        title="Diapers"
        color="green"
      />
    </div>
  );
};

export default QuickStats;
