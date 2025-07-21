import { Card, CardContent } from "@/src/components/ui/card";
import { getTimeSince } from "lib/dayjs";
import { Skeleton } from "./ui/skeleton";
import { Nullable } from "@/types/common";

type BaseEvent = {
  id: Nullable<number>;
  occurred_at: Nullable<string>;
};

type StatsCardProps<T extends BaseEvent> = {
  events: T[] | undefined;
  icon: React.ReactNode;
  title: string;
  color: string;
};

const StatsCard = <T extends BaseEvent>({
  events,
  icon,
  title,
  color,
}: StatsCardProps<T>) => {
  return (
    <Card className={`bg-${color}-50 border-${color}-200`}>
      <CardContent className="p-4 text-center">
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          {icon}
          <span className={`text-sm font-medium ${color}`}>{title}</span>
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {events?.length ?? 0}
        </div>
        {events && events.length > 0 && (
          <div className={`text-xs ${color} mt-1`}>
            {getTimeSince(events[0].occurred_at!)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
