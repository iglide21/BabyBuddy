import { Badge } from "../ui/badge";
import { formatTime } from "lib/dayjs";
import { ActivityComponentProps } from "@/types/common";
import EditButton from "../edit-button";
import DeleteButton from "../delete-button";
// import { useDeleteDiaper } from "@/src/hooks/data/mutations";

const DiaperActivity = ({ event, editEvent }: ActivityComponentProps) => {
  // const { mutate: deleteEvent, status } = useDeleteDiaper(event.id);

  return (
    <>
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
        <div className="text-sm text-gray-600">
          {event.occurred_at && formatTime(event.occurred_at)}
        </div>
        {event.note && (
          <div className="text-xs text-gray-500 mt-1">{event.note}</div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* <DeleteButton onClick={() => deleteEvent(event.id)} status={status} /> */}
        <EditButton onClick={() => editEvent?.(event.id ?? 0)} />
      </div>
    </>
  );
};

export default DiaperActivity;
