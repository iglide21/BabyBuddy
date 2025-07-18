"use client";

import { useFeedings } from "../hooks/data/queries";
import StatsCard from "./stats-card";
import { Milk } from "lucide-react";

const QuickStats = () => {
  const { data: feedings, isLoading } = useFeedings();
  // const { data: sleeps, isLoading: isLoadingSleeps } = useSleeps();
  // const { data: diapers, isLoading: isLoadingDiapers } = useDiapers();

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatsCard
        events={feedings}
        icon={<Milk className="w-5 h-5 text-orange-600" />}
        title="Feedings Today"
        color="orange"
        isLoading={isLoading}
      />

      <StatsCard
        events={feedings}
        icon={<Milk className="w-5 h-5 text-orange-600" />}
        title="Feedings Today"
        color="orange"
        isLoading={isLoading}
      />

      <StatsCard
        events={feedings}
        icon={<Milk className="w-5 h-5 text-orange-600" />}
        title="Feedings Today"
        color="orange"
        isLoading={isLoading}
      />
      {/* <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Sleep Today
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {totalSleepHours}h
          </div>
          {lastSleep && (
            <div className="text-xs text-blue-600 mt-1">
              {lastSleep.endTime
                ? `Last: ${getTimeSince(lastSleep.endTime)}`
                : "Sleeping now 😴"}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-lg">💩</span>
            <span className="text-xs font-medium text-green-800">Diapers</span>
          </div>
          <div className="text-xl font-bold text-green-700">
            {totalDiapersToday}
          </div>
          {lastDiaper && (
            <div className="text-xs text-green-600 mt-1">
              Last: {getTimeSince(lastDiaper.timestamp)}
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
};

export default QuickStats;
