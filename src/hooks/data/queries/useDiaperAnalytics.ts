import { useMemo } from "react";
import { Event } from "@/types/data/events/types";
import dayjs from "dayjs";

export const useDiaperAnalytics = (
  events: Event[] | undefined,
  dateRange?: { from: Date; to: Date }
) => {
  const diapers = useMemo(
    () => events?.filter((event) => event.event_type === "diaper") ?? [],
    [events]
  );

  // Basic stats
  const totalDiapers = diapers.length;
  const wetDiapers = diapers.filter(
    (log) => log.diaper_type === "wet" || log.diaper_type === "both"
  ).length;
  const dirtyDiapers = diapers.filter(
    (log) => log.diaper_type === "dirty" || log.diaper_type === "both"
  ).length;

  // Calculate days in range
  const daysInRange = useMemo(() => {
    if (!dateRange) return 7; // Default to 7 days
    return dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
  }, [dateRange]);

  // Generate diaper data for charts
  const generateDiaperData = (days?: number) => {
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

      const dayDiapers = diapers.filter(
        (log) =>
          log.occurred_at &&
          dayjs(log.occurred_at).isAfter(dayjs(dayStart)) &&
          dayjs(log.occurred_at).isBefore(dayjs(dayEnd))
      );

      const wetCount = dayDiapers.filter(
        (log) => log.diaper_type === "wet" || log.diaper_type === "both"
      ).length;
      const dirtyCount = dayDiapers.filter(
        (log) => log.diaper_type === "dirty" || log.diaper_type === "both"
      ).length;

      return {
        date: day.displayDate,
        wet: wetCount,
        dirty: dirtyCount,
        total: dayDiapers.length,
      };
    });
  };

  return {
    diapers,
    totalDiapers,
    wetDiapers,
    dirtyDiapers,
    daysInRange,
    generateDiaperData,
  };
};
