"use client";

import useEvents from "@/src/hooks/data/queries/useEvents";
import dayjs from "@/src/lib/dayjs";
import { useMemo, useState } from "react";
import { Event, HistoryFilterType } from "@/types/data/events/types";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  History,
  Milk,
  Moon,
} from "lucide-react";
import { formatDateForDisplay } from "@/src/lib/dayjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";
import { eventTypeToComponent } from "@/src/lib/components";
import HistoryFilterSection from "@/src/components/history-filter-section";
import { useApplicationStore } from "@/src/stores";
import { ApplicationModal } from "@/src/lib/types";
import InnerPageHeader from "@/src/components/inner-page-header";

export function HistoryPage() {
  const { currentBaby, isLoading: isBabyLoading } = useBabyFromUrl();
  const showModal = useApplicationStore.use.showModal();

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [activeFilters, setActiveFilters] = useState<Set<HistoryFilterType>>(
    new Set(["feeding", "sleep", "diaper"])
  );
  const { data: events, isLoading: isEventsLoading } = useEvents(
    currentBaby?.id ?? ""
  );

  const feedings = useMemo(
    () => events?.filter((event) => event.event_type === "feeding"),
    [events]
  );
  const sleeps = useMemo(
    () => events?.filter((event) => event.event_type === "sleep"),
    [events]
  );
  const diapers = useMemo(
    () => events?.filter((event) => event.event_type === "diaper"),
    [events]
  );

  const toggleFilter = (filterType: HistoryFilterType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterType)) {
      newFilters.delete(filterType);
    } else {
      newFilters.add(filterType);
    }
    setActiveFilters(newFilters);
  };

  // Group logs by date
  const groupLogsByDate = () => {
    const groups: {
      [key: string]: {
        feedings: Event[];
        sleeps: Event[];
        diapers: Event[];
      };
    } = {};

    if (activeFilters.has("feeding")) {
      feedings?.forEach((log) => {
        const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
        if (!groups[dateKey]) {
          groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
        }
        groups[dateKey].feedings.push(log);
      });
    }

    if (activeFilters.has("sleep")) {
      sleeps?.forEach((log) => {
        const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
        if (!groups[dateKey]) {
          groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
        }
        groups[dateKey].sleeps.push(log);
      });
    }

    if (activeFilters.has("diaper")) {
      diapers?.forEach((log) => {
        const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
        if (!groups[dateKey]) {
          groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
        }
        groups[dateKey].diapers.push(log);
      });
    }

    // Sort by date (newest first)
    return Object.entries(groups).sort(
      ([a], [b]) => dayjs(b).valueOf() - dayjs(a).valueOf()
    );
  };

  const groupedLogs = groupLogsByDate();

  const toggleDay = (dateKey: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dateKey)) {
      newExpanded.delete(dateKey);
    } else {
      newExpanded.add(dateKey);
    }
    setExpandedDays(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString);
  };

  const getDayStats = (
    feedings: Event[],
    sleeps: Event[],
    diapers: Event[]
  ) => {
    const totalFeedings = feedings.length;
    const totalDiapers = diapers.length;
    const totalSleep = sleeps.reduce((total, log) => {
      if (log.end_date) {
        return (
          total +
          dayjs(log.end_date).diff(dayjs(log.occurred_at), "millisecond")
        );
      }
      return total;
    }, 0);
    const totalSleepHours =
      Math.round((totalSleep / (1000 * 60 * 60)) * 10) / 10;

    return { totalFeedings, totalSleepHours, totalDiapers };
  };

  if (isBabyLoading || isEventsLoading) {
    return (
      <div className="flex flex-col gap-4 m-4">
        <Skeleton className="w-full h-8" />
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      <InnerPageHeader
        title="History"
        icon={<History className="w-5 h-5 text-gray-600" />}
      />
      {/* Filter Section */}
      <HistoryFilterSection
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />

      {groupedLogs.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No history found.</p>
            <p className="text-sm text-gray-400 mt-1">
              {activeFilters.size === 0
                ? "Select at least one filter to view history."
                : "No events match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        groupedLogs.map(([dateKey, { feedings, sleeps, diapers }]) => {
          const isExpanded = expandedDays.has(dateKey);
          const { totalFeedings, totalSleepHours, totalDiapers } = getDayStats(
            feedings,
            sleeps,
            diapers
          );

          // Combine and sort activities for the day
          const dayActivities = [
            ...feedings.map((log) => ({
              ...log,
              event_type: "feeding" as const,
            })),
            ...sleeps.map((log) => ({ ...log, event_type: "sleep" as const })),
            ...diapers.map((log) => ({
              ...log,
              event_type: "diaper" as const,
            })),
          ].sort((a, b) => {
            const timeA =
              a.event_type === "feeding"
                ? a.occurred_at
                : a.event_type === "diaper"
                ? a.occurred_at
                : a.occurred_at;
            const timeB =
              b.event_type === "feeding"
                ? b.occurred_at
                : b.event_type === "diaper"
                ? b.occurred_at
                : b.occurred_at;
            return dayjs(timeB).diff(dayjs(timeA), "millisecond");
          });

          return (
            <Card key={dateKey}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleDay(dateKey)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {formatDate(dateKey)}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      {activeFilters.has("feeding") && (
                        <div className="flex items-center gap-1 text-sm text-orange-600">
                          <Milk className="w-4 h-4" />
                          <span>{totalFeedings} feeds</span>
                        </div>
                      )}
                      {activeFilters.has("sleep") && (
                        <div className="flex items-center gap-1 text-sm text-blue-600">
                          <Moon className="w-4 h-4" />
                          <span>{totalSleepHours}h sleep</span>
                        </div>
                      )}
                      {activeFilters.has("diaper") && (
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <span className="text-sm">💩</span>
                          <span>{totalDiapers} diapers</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 space-y-3">
                  {dayActivities.map((activity) => {
                    const EventComponent =
                      eventTypeToComponent[
                        activity.event_type as keyof typeof eventTypeToComponent
                      ];

                    return (
                      <div
                        key={activity.id}
                        className="border px-2 py-2 rounded-md"
                      >
                        <EventComponent
                          event={activity}
                          editEvent={() => {
                            showModal({
                              type: `${activity.event_type}_edit` as ApplicationModal["type"],
                              data: {
                                eventId: activity.id,
                              },
                            });
                          }}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}

export default HistoryPage;
