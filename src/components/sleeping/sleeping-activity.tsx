import { ActivityComponentProps } from "@/types/common";
import { Moon, Badge } from "lucide-react";
import { formatDuration } from "@/src/lib/utils";
import EditButton from "../edit-button";

const SleepingActivity = ({ event, editEvent }: ActivityComponentProps) => {
  const formattedDuration = formatDuration(
    new Date(event.start_date || ""),
    new Date(event.end_date || "")
  );

  return (
    <>
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <Moon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Sleep</span>
          {!event.end_date && (
            <Badge className="bg-blue-100 text-blue-700">Active</Badge>
          )}
        </div>
        <div className="text-sm text-gray-600">{formattedDuration}</div>
        {event.note && (
          <div className="text-xs text-gray-500 mt-1">{event.note}</div>
        )}
      </div>
      {event.end_date && <EditButton onClick={() => editEvent?.(event)} />}
    </>
  );
};

export default SleepingActivity;
