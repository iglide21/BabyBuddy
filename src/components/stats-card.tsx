import { Card, CardContent } from "@/src/components/ui/card";
import { getTimeSince } from "@/src/lib/utils";
import { Skeleton } from "./ui/skeleton";

type BaseEvent = {
  id: number;
  created_at: string;
};

type StatsCardProps<T extends BaseEvent> = {
  events: T[] | undefined;
  icon: React.ReactNode;
  title: string;
  color: string;
  isLoading: boolean;
};

const StatsCard = <T extends BaseEvent>({
  events,
  icon,
  title,
  color,
  isLoading,
}: StatsCardProps<T>) => {
  if (isLoading) {
    return <Skeleton className="w-full h-32 rounded-lg bg-gray-200" />;
  }

  if (!events) return null;

  return (
    <Card className={`bg-${color}-50 border-${color}-200`}>
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {icon}
          <span className={`text-sm font-medium ${color}`}>{title}</span>
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {/* this should be only for today, not all feedings ever */}
          {events.length}
        </div>
        {events.length > 0 && (
          <div className={`text-xs ${color} mt-1`}>
            Last: {getTimeSince(new Date(events[events.length - 1].created_at))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
