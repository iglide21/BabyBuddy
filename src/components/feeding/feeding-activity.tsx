import { ActivityComponentProps } from "@/types/common";
import { formatDuration, formatTime } from "lib/dayjs";
import { Badge } from "../ui/badge";
import EditButton from "../edit-button";
import { Milk } from "lucide-react";

const FeedingActivity = ({ event, editEvent }: ActivityComponentProps) => {
  return (
    <>
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Milk className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 capitalize">
            {event.feeding_type}
          </span>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-700 p-2 capitalize"
          >
            {event.event_type}
          </Badge>
        </div>
        <div className="text-sm text-gray-600 flex flex-col gap-0.5">
          {event.occurred_at && (
            <div>
              <span className="font-medium text-gray-700">Time: </span>
              <span>{formatTime(event.occurred_at)}</span>
            </div>
          )}
          {event.amount && (
            <div>
              <span className="font-medium text-gray-700">Amount: </span>
              <span>{event.amount}ml</span>
            </div>
          )}
          {event.duration && (
            <div>
              <span className="font-medium text-gray-700">Duration: </span>
              <span>{event.duration}m</span>
            </div>
          )}
        </div>
        {event.note && (
          <div className="text-xs text-gray-500 mt-1">{event.note}</div>
        )}
      </div>
      <EditButton onClick={() => editEvent?.(event)} />
    </>
  );
};

export default FeedingActivity;
