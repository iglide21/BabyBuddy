import { Badge } from "../ui/badge";
import { formatTime } from "lib/dayjs";
import { ActivityComponentProps } from "@/types/common";
import EditButton from "../edit-button";
import DeleteButton from "../delete-button";
import { useDeleteDiaper } from "@/src/hooks/data/mutations";
import { cn } from "@/src/lib/utils";

const DiaperActivity = ({ event, editEvent }: ActivityComponentProps) => {
  const { mutate: deleteEvent, status } = useDeleteDiaper();

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full",
        status === "pending" && "animate-pulse opacity-50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-lg">💩</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 capitalize">
              {event.diaper_type}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Diaper
            </Badge>
          </div>
          {event.occurred_at && (
            <span className="text-sm text-gray-700">
              {formatTime(event.occurred_at)}
            </span>
          )}
          {event.note && (
            <div className="text-xs text-gray-500 mt-1">{event.note}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EditButton
          onClick={() => event.id && editEvent?.(event.id)}
          disabled={status === "pending"}
        />
        <DeleteButton
          onClick={() => event.id && deleteEvent(event.id.toString())}
          disabled={status === "pending"}
        />
      </div>
    </div>
  );
};

export default DiaperActivity;
