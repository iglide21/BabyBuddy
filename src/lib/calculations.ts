import dayjs from "dayjs";
import { type FeedingFormData } from "@/src/components/feeding/log-feeding-modal";
import { CreateBreastFeeding } from "@/types/breast-feedings";

export const calculateDurationInMinutes = (data: FeedingFormData): number => {
  const { duration_minutes, breast_feed } = data;

  if (duration_minutes) {
    return Number(duration_minutes);
  }

   return calculateBreastFeedingDuration(breast_feed);
};

export const calculateBreastFeedingDuration = (breastFeedings: CreateBreastFeeding[]): number =>  breastFeedings.reduce((acc: number, curr: CreateBreastFeeding) => {
    const start = dayjs(curr.start_at);
    const end = dayjs(curr.end_at);
    return acc + end.diff(start, "minute");
  }, 0);