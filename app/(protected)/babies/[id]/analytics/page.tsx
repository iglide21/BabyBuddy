"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Skeleton } from "@/src/components/ui";
import { Button } from "@/src/components/ui/button";
import { DateRangePicker } from "@/src/components/date-range-picker";
import useEvents from "@/src/hooks/data/queries/useEvents";
import { useBabyFromUrl } from "@/src/hooks";
import dayjs, { getStartOfDay, getEndOfDay } from "lib/dayjs";
import { useRouter } from "next/navigation";
import { DateRange } from "@/types/date-range";
import AnalyticsOverview from "@/src/components/analytics/analytics-overview";
import FeedingAnalytics from "@/src/components/analytics/feeding-analytics";
import SleepAnalytics from "@/src/components/analytics/sleep-analytics";
import DiaperAnalytics from "@/src/components/analytics/diaper-analytics";

const AnalyticsView = () => {
  const router = useRouter();
  const { currentBaby } = useBabyFromUrl();

  // Default to last 7 days
  const defaultDateRange: DateRange = useMemo(
    () => ({
      label: "Last 7 days",
      value: "1week",
      from: getStartOfDay(dayjs().subtract(7, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
    []
  );

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  const startDate = useMemo(
    () => dayjs(dateRange.from).toISOString(),
    [dateRange.from]
  );
  const endDate = useMemo(
    () => dayjs(dateRange.to).toISOString(),
    [dateRange.to]
  );

  const { data: events, isPending } = useEvents(
    currentBaby?.id ?? "",
    startDate,
    endDate
  );

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-20 z-10">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h1 className="text-lg font-bold text-gray-800">Analytics</h1>
              </div>
              <p className="text-sm text-gray-600 ">
                {currentBaby?.name ?? "Baby"}'s activity insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="feeding" className="text-xs">
              Feeding
            </TabsTrigger>
            <TabsTrigger value="sleep" className="text-xs">
              Sleep
            </TabsTrigger>
            <TabsTrigger value="diapers" className="text-xs">
              Diapers
            </TabsTrigger>
          </TabsList>

          <div>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              disabled={isPending}
            />
          </div>

          {isPending ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
                <Skeleton className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <Skeleton className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
            </>
          ) : (
            <>
              {/* Overview tab */}
              <AnalyticsOverview
                currentBabyId={currentBaby?.id ?? ""}
                dateRange={dateRange}
              />

              <FeedingAnalytics
                currentBabyId={currentBaby?.id ?? ""}
                dateRange={dateRange}
              />

              <SleepAnalytics
                currentBabyId={currentBaby?.id ?? ""}
                dateRange={dateRange}
              />

              <DiaperAnalytics
                currentBabyId={currentBaby?.id ?? ""}
                dateRange={dateRange}
              />
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsView;
