import { Calendar, Baby, Milk, Edit, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import useEvents from "../hooks/data/queries/useEvents";
import { Event } from "@/types/data/events/types";
import { JSX } from "react";
import { SleepingActivity } from "./sleeping";
import { FeedingActivity } from "./feeding";
import { DiaperActivity } from "./diaper";
import { getTodayString } from "lib/dayjs";

const eventTypeToComponent: Record<
  "diaper" | "nap" | "feeding",
  ({
    event,
    editEvent,
  }: {
    event: Event;
    editEvent?: (event: Event) => void;
  }) => JSX.Element
> = {
  feeding: FeedingActivity,
  nap: SleepingActivity,
  diaper: DiaperActivity,
};

const TodaysActivities = () => {
  const today = getTodayString();
  const { data: events, isLoading, isError } = useEvents("1", today);

  return (
    <>
      <div className="flex items-center gap-2 text-gray-800 mb-4">
        <Calendar className="w-5 h-5" />
        <h2 className="text-xl font-medium">Today's Activities</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <Loader2 className="w-12 h-12 mx-auto mb-3 text-gray-300 animate-spin" />
          <p className="text-sm">Loading activities...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">
            There was an error while loading activities.
          </p>
        </div>
      ) : events?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Baby className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No activities logged yet today.</p>
          <p className="text-xs mt-1">
            Tap the buttons above to get started! 🍼
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events?.map((event) => {
            const EventComponent =
              eventTypeToComponent[
                event.event_type as keyof typeof eventTypeToComponent
              ];

            if (!EventComponent) {
              return null;
            }

            return (
              <div
                key={`${event.event_type}-${event.id}`}
                className="flex items-center gap-3 p-4 rounded-lg bg-white group border border-gray-200"
              >
                <EventComponent
                  event={event}
                  editEvent={() => console.log(event)}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TodaysActivities;
