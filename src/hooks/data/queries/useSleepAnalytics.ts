import { useMemo } from "react";
import { Event } from "@/types/data/events/types";
import dayjs from "dayjs";

export const useSleepAnalytics = (
  events: Event[] | undefined,
  dateRange?: { from: Date; to: Date }
) => {
  const sleeps = useMemo(
    () => events?.filter((event) => event.event_type === "sleep") ?? [],
    [events]
  );

  // Basic stats
  const totalSleepHours = sleeps.reduce((total, log) => {
    if (log.end_date && log.occurred_at) {
      return total + dayjs(log.end_date).diff(dayjs(log.occurred_at), "hour");
    }
    return total;
  }, 0);

  const completedSleeps = sleeps.filter((log) => log.end_date);
  const totalSleepSessions = completedSleeps.length;

  // Calculate average sleep duration
  const avgSleepDuration =
    completedSleeps.length > 0
      ? Math.round(
          completedSleeps.reduce((total, log) => {
            if (log.end_date && log.occurred_at) {
              return (
                total +
                dayjs(log.end_date).diff(dayjs(log.occurred_at), "minute")
              );
            }
            return total;
          }, 0) / completedSleeps.length
        )
      : 0;

  // Calculate days in range for daily averages
  const daysInRange = useMemo(() => {
    if (!dateRange) return 7; // Default to 7 days
    return dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
  }, [dateRange]);

  // Daily averages (for overview)
  const avgSleepPerDay = totalSleepHours / daysInRange;

  // Generate sleep data for charts
  const generateSleepData = (days?: number) => {
    const daysToShow = days || daysInRange;

    // Generate dates based on the actual date range
    const dateArray = [];
    if (dateRange) {
      let currentDate = dayjs(dateRange.from);
      const endDate = dayjs(dateRange.to);

      while (
        currentDate.isBefore(endDate) ||
        currentDate.isSame(endDate, "day")
      ) {
        dateArray.push({
          date: currentDate.format("YYYY-MM-DD"),
          displayDate: currentDate.format("MMM D"),
          fullDate: currentDate.toDate(),
        });
        currentDate = currentDate.add(1, "day");
      }
    } else {
      // Fallback to last N days if no date range
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = dayjs().subtract(i, "day");
        dateArray.push({
          date: date.format("YYYY-MM-DD"),
          displayDate: date.format("MMM D"),
          fullDate: date.toDate(),
        });
      }
    }

    return dateArray.map((day) => {
      const dayStart = new Date(day.fullDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day.fullDate);
      dayEnd.setHours(23, 59, 59, 999);

      const daySleep = sleeps.filter(
        (log) =>
          log.occurred_at &&
          log.end_date &&
          dayjs(log.occurred_at).isAfter(dayjs(dayStart)) &&
          dayjs(log.occurred_at).isBefore(dayjs(dayEnd))
      );

      const totalSleepMinutes = daySleep.reduce((total, log) => {
        if (log.end_date) {
          return (
            total + dayjs(log.end_date).diff(dayjs(log.occurred_at), "minute")
          );
        }
        return total;
      }, 0);

      const sessions = daySleep.length;
      const avgSessionLength = sessions > 0 ? totalSleepMinutes / sessions : 0;

      return {
        date: day.displayDate,
        totalHours: (totalSleepMinutes / 60).toFixed(2),
        sessions: sessions,
        avgSessionHrs: (avgSessionLength / 60).toFixed(2),
      };
    });
  };

  return {
    sleeps,
    totalSleepHours,
    totalSleepSessions,
    avgSleepDuration,
    avgSleepPerDay,
    daysInRange,
    generateSleepData,
  };
};
