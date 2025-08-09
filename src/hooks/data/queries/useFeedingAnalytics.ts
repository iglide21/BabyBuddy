import { useMemo } from "react";
import { Event } from "@/types/data/events/types";
import dayjs from "dayjs";
import { DateRange } from "@/types/date-range";

export const useFeedingAnalytics = (
  events: Event[] | undefined,
  dateRange: DateRange
) => {
  const feedings = useMemo(
    () => events?.filter((event) => event.event_type === "feeding") ?? [],
    [events]
  );

  // Basic stats
  const totalFeedings = feedings.length;

  // Filter feedings with valid data
  const feedingsWithDuration = feedings.filter(
    (f) => f.duration && f.duration > 0
  );
  const feedingsWithAmount = feedings.filter((f) => f.amount && f.amount > 0);

  // Averages
  const avgFeedingDuration =
    feedingsWithDuration.length > 0
      ? feedingsWithDuration.reduce((sum, f) => sum + (f.duration ?? 0), 0) /
        feedingsWithDuration.length
      : 0;

  const avgFeedingAmount =
    feedingsWithAmount.length > 0
      ? (
          feedingsWithAmount.reduce((sum, f) => sum + (f.amount ?? 0), 0) /
          feedingsWithAmount.length
        ).toFixed(1)
      : "0.0";

  // Type breakdown
  const breastCount = feedings.filter(
    (log) => log.feeding_type === "breast"
  ).length;
  const bottleCount = feedings.filter(
    (log) => log.feeding_type === "bottle"
  ).length;
  const solidCount = feedings.filter(
    (log) => log.feeding_type === "solid"
  ).length;

  // Calculate days in range for daily averages
  const daysInRange = useMemo(() => {
    if (!dateRange) return 7; // Default to 7 days
    return dayjs(dateRange.to).diff(dayjs(dateRange.from), "day") + 1;
  }, [dateRange]);

  // Daily averages (for overview)
  const avgFeedingsPerDay = (totalFeedings / daysInRange).toFixed(1);

  // Generate feeding data for charts
  const generateFeedingData = (days?: number) => {
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

      const breastFeedings = dayFeedings.filter(
        (log) => log.feeding_type === "breast"
      ).length;
      const bottleFeedings = dayFeedings.filter(
        (log) => log.feeding_type === "bottle"
      ).length;
      const solidFeedings = dayFeedings.filter(
        (log) => log.feeding_type === "solid"
      ).length;

      const totalAmount = dayFeedings.reduce((sum, log) => {
        if (log.amount && log.amount > 0) {
          return sum + log.amount;
        }
        return sum;
      }, 0);

      const totalDuration = dayFeedings.reduce((sum, log) => {
        if (log.duration && log.duration > 0) {
          return sum + log.duration;
        }
        return sum;
      }, 0);

      return {
        date: day.displayDate,
        breast: breastFeedings,
        bottle: bottleFeedings,
        solid: solidFeedings,
        total: dayFeedings.length,
        amount: Math.round(totalAmount * 10) / 10,
        duration: totalDuration,
      };
    });
  };

  // Generate feeding type distribution for pie chart
  const generateFeedingTypeData = () => {
    return [
      { name: "Breast", value: breastCount, color: "#f97316" },
      { name: "Bottle", value: bottleCount, color: "#3b82f6" },
      { name: "Solid", value: solidCount, color: "#10b981" },
    ].filter((item) => item.value && item.value > 0);
  };

  return {
    feedings,
    totalFeedings,
    avgFeedingDuration,
    avgFeedingAmount,
    avgFeedingsPerDay,
    breastCount,
    bottleCount,
    solidCount,
    daysInRange,
    generateFeedingData,
    generateFeedingTypeData,
  };
};
