import { useMemo } from "react";
import { Event } from "@/types/data/events/types";
import dayjs from "dayjs";

export const useOverviewAnalytics = (
  events: Event[] | undefined,
  dateRange?: { from: Date; to: Date }
) => {
  const feedings = useMemo(
    () => events?.filter((event) => event.event_type === "feeding") ?? [],
    [events]
  );

  const sleeps = useMemo(
    () => events?.filter((event) => event.event_type === "sleep") ?? [],
    [events]
  );

  const diapers = useMemo(
    () => events?.filter((event) => event.event_type === "diaper") ?? [],
    [events]
  );

  // Calculate the number of days in the date range
  const daysInRange = useMemo(() => {
    if (!dateRange) return 7; // Default to 7 days
    return dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
  }, [dateRange]);

  // Generate overview data for the specified date range
  const generateOverviewData = (days?: number) => {
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

      const dayFeedings = feedings.filter(
        (log) =>
          log.occurred_at &&
          dayjs(log.occurred_at).isAfter(dayjs(dayStart)) &&
          dayjs(log.occurred_at).isBefore(dayjs(dayEnd))
      );

      const daySleep = sleeps.filter(
        (log) =>
          log.occurred_at &&
          dayjs(log.occurred_at).isAfter(dayjs(dayStart)) &&
          dayjs(log.occurred_at).isBefore(dayjs(dayEnd)) &&
          log.end_date
      );

      const dayDiapers = diapers.filter(
        (log) =>
          log.occurred_at &&
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

      return {
        date: day.displayDate,
        feedings: dayFeedings.length,
        sleepHours: Math.round((totalSleepMinutes / 60) * 10) / 10,
        diapers: dayDiapers.length,
      };
    });
  };

  return {
    feedings,
    sleeps,
    diapers,
    daysInRange,
    generateOverviewData,
  };
};
