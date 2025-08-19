import { ActivityComponentProps } from "@/types/common";
import { Moon, Badge, ArrowRight } from "lucide-react";
import dayjs, { formatDuration, formatTime } from "lib/dayjs";
import EditButton from "../edit-button";
import { useDeleteSleep } from "@/src/hooks/data/mutations";
import DeleteButton from "../delete-button";
import { cn } from "@/src/lib/utils";

const SleepingActivity = ({ event, editEvent }: ActivityComponentProps) => {
  const { mutate: deleteEvent, status } = useDeleteSleep();

  const formattedDuration = formatDuration(event.duration || 0, "minutes");

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full",
        status === "pending" && "animate-pulse opacity-50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Moon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Sleep</span>
            {!event.end_date && (
              <Badge className="bg-blue-100 text-blue-700">Active</Badge>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              {event.occurred_at && (
                <div className="text-sm text-gray-600">
                  {formatTime(event.occurred_at)}
                </div>
              )}

              {event.end_date && (
                <>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <div className="text-sm text-gray-600">
                    {formatTime(event.end_date)}
                  </div>
                </>
              )}
            </div>
            {event.end_date && (
              <div className="text-sm text-blue-400">{formattedDuration}</div>
            )}
          </div>

          {event.note && (
            <div className="text-xs text-gray-500 mt-1">{event.note}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {event.end_date && (
          <EditButton
            onClick={() => event.id && editEvent?.(event.id)}
            disabled={status === "pending"}
          />
        )}
        <DeleteButton
          onClick={() => event.id && deleteEvent(event.id.toString())}
          disabled={status === "pending"}
        />
      </div>
    </div>
  );
};

export default SleepingActivity;
