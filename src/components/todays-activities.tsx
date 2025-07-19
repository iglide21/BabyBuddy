import { Calendar, Baby, Milk, Edit, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import useEvents from "../hooks/data/queries/useEvents";
import { Event } from "@/types/data/events/types";
import { JSX } from "react";
import { SleepingActivity } from "./sleeping";
import { FeedingActivity } from "./feeding";
import { DiaperActivity } from "./diaper";

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
  const { data: events, isLoading, isError } = useEvents("1");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="w-5 h-5" />
          Today's Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
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
          events?.map((event) => {
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
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group"
              >
                <EventComponent
                  event={event}
                  editEvent={() => console.log(event)}
                />

                {/* {event.logType === "sleep" && (
                    <>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Moon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">Sleep</span>
                          {!event.endTime && (
                            <Badge className="bg-blue-100 text-blue-700">
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {event.duration}
                        </div>
                        {event.note && (
                          <div className="text-xs text-gray-500 mt-1">
                            {event.note}
                          </div>
                        )}
                      </div>
                      {event.endTime && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSleep(event)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
  
                  {event.logType === "diaper" && (
                    <>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">💩</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            Diaper
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700"
                          >
                            {event.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatTime(event.timestamp)}
                        </div>
                        {event.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {event.notes}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditDiaper(event)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )} */}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysActivities;
