import { FeedingActivity } from "../components/feeding";
import { DiaperActivity } from "../components/diaper";
import { SleepingActivity } from "../components/sleeping";
import { Event } from "@/types/data/events/types";
import { JSX } from "react";

export const eventTypeToComponent: Record<
  "diaper" | "sleep" | "feeding",
  ({
    event,
    editEvent,
  }: {
    event: Event;
    editEvent?: (eventId: number) => void;
  }) => JSX.Element
> = {
  feeding: FeedingActivity,
  sleep: SleepingActivity,
  diaper: DiaperActivity,
};
