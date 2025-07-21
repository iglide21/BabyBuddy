"use client";

import useEvents from "@/src/hooks/data/queries/useEvents";
import dayjs, {
  formatDateForDisplay,
  formatDuration,
  formatTime,
  getTodayString,
} from "@/src/lib/dayjs";
import { useMemo, useState } from "react";
import { Event } from "@/types/data/events/types";
import { Button } from "@/src/components/ui/button";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  Loader2,
  Milk,
  Moon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

export function HistoryPage() {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const { data: events, isLoading, isError } = useEvents("1", getTodayString());

  const feedings = useMemo(
    () => events?.filter((event) => event.event_type === "feeding"),
    [events]
  );
  const sleeps = useMemo(
    () => events?.filter((event) => event.event_type === "nap"),
    [events]
  );
  const diapers = useMemo(
    () => events?.filter((event) => event.event_type === "diaper"),
    [events]
  );

  // Group logs by date
  const groupLogsByDate = () => {
    const groups: {
      [key: string]: {
        feedings: Event[];
        sleeps: Event[];
        diapers: Event[];
      };
    } = {};

    feedings?.forEach((log) => {
      const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
      }
      groups[dateKey].feedings.push(log);
    });

    sleeps?.forEach((log) => {
      const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
      }
      groups[dateKey].sleeps.push(log);
    });

    diapers?.forEach((log) => {
      const dateKey = dayjs(log.occurred_at).format("YYYY-MM-DD");
      if (!groups[dateKey]) {
        groups[dateKey] = { feedings: [], sleeps: [], diapers: [] };
      }
      groups[dateKey].diapers.push(log);
    });

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

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      ) : groupedLogs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No history yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Start logging feeds and sleep to see your history here! 📊
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
            ...sleeps.map((log) => ({ ...log, event_type: "nap" as const })),
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
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <Milk className="w-4 h-4" />
                        <span>{totalFeedings} feeds</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <Moon className="w-4 h-4" />
                        <span>{totalSleepHours}h sleep</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <span className="text-sm">💩</span>
                        <span>{totalDiapers} diapers</span>
                      </div>
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
                  {dayActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group"
                    >
                      {activity.event_type === "feeding" ? (
                        <>
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Milk className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 text-sm">
                                Feeding
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-700 text-xs"
                              >
                                {activity.feeding_type}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTime(activity.occurred_at!)}
                              {activity.amount && ` • ${activity.amount}oz`}
                              {activity.duration &&
                                ` • ${activity.duration}min`}
                            </div>
                            {activity.note && (
                              <div className="text-xs text-gray-500 mt-1">
                                {activity.note}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => onEditFeeding(activity)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </>
                      ) : activity.event_type === "nap" ? (
                        <>
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Moon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 text-sm">
                                Sleep
                              </span>
                              {!activity.end_date && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTime(activity.occurred_at!)}
                              {activity.end_date && (
                                <>
                                  {" - "}
                                  {formatTime(activity.end_date)}
                                  {" • "}
                                  {formatDuration(
                                    activity.occurred_at!,
                                    activity.end_date!
                                  )}
                                </>
                              )}
                            </div>
                            {activity.note && (
                              <div className="text-xs text-gray-500 mt-1">
                                {activity.note}
                              </div>
                            )}
                          </div>
                          {activity.end_date && (
                            <Button
                              variant="ghost"
                              size="sm"
                              // onClick={() => onEditSleep(activity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">💩</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800 text-sm">
                                Diaper
                              </span>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700 text-xs"
                              >
                                {activity.diaper_type}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-600">
                              {formatTime(activity.occurred_at!)}
                            </div>
                            {activity.note && (
                              <div className="text-xs text-gray-500 mt-1">
                                {activity.note}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            // onClick={() => onEditDiaper(activity)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
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
