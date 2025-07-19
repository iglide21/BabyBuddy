import { LogEntry } from "@/types/common";

type ActivityCardProps = {
  activity: LogEntry;
  color: string;
  onEdit: (activity: LogEntry) => void;
};

const ActivityCard = ({ activity, onEdit, color }: ActivityCardProps) => {
  return (
    <>
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <Milk className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800">Feeding</span>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {activity.type}
          </Badge>
        </div>
        <div className="text-sm text-gray-600">
          {formatTime(activity.timestamp)}
          {activity.amount && ` • ${activity.amount}oz`}
          {activity.duration && ` • ${activity.duration}min`}
        </div>
        {activity.notes && (
          <div className="text-xs text-gray-500 mt-1">{activity.notes}</div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditFeeding(activity)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit className="w-4 h-4" />
      </Button>
    </>
  );
};

export default ActivityCard;
