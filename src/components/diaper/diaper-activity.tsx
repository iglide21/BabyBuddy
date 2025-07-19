import { Badge } from "../ui/badge";
import { formatTime } from "@/src/lib/utils";
import { ActivityComponentProps } from "@/types/common";
import EditButton from "../edit-button";

const DiaperActivity = ({ event, editEvent }: ActivityComponentProps) => {
  return (
    <>
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <span className="text-lg">💩</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Diaper</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {event.diaper_type}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          {event.created_at && formatTime(new Date(event.created_at))}
        </div>
        {event.note && (
          <div className="text-xs text-gray-500 mt-1">{event.note}</div>
        )}
      </div>
      <EditButton onClick={() => editEvent?.(event)} />
    </>
  );
};

export default DiaperActivity;
