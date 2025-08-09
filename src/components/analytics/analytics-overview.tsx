"use client";

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TabsContent } from "@/src/components/ui/tabs";
import { Card, CardTitle, CardContent, CardHeader } from "@/src/components/ui";
import {
  useFeedingAnalytics,
  useSleepAnalytics,
} from "@/src/hooks/data/queries";
import useEvents from "@/src/hooks/data/queries/useEvents";
import { DateRange } from "@/types/date-range";
import dayjs from "dayjs";
import { useOverviewAnalytics } from "@/src/hooks/data/queries/useOverviewAnalytics";
import { CustomTooltip } from "./custom-tooltip";
import { formatDuration } from "@/src/lib/dayjs";

type AnalyticsOverviewProps = {
  currentBabyId: string;
  dateRange: DateRange;
};

const AnalyticsOverview = ({
  currentBabyId,
  dateRange,
}: AnalyticsOverviewProps) => {
  const { from, to } = dateRange;

  const startDateString = dayjs(from).toISOString();
  const endDateString = dayjs(to).toISOString();

  const { data: events } = useEvents(
    currentBabyId,
    startDateString,
    endDateString
  );

  const {
    totalFeedings,
    avgFeedingsPerDay,
    avgFeedingDuration,
    avgFeedingAmount,
  } = useFeedingAnalytics(events, dateRange);

  const { totalSleepHours, avgSleepPerDay, avgSleepDuration } =
    useSleepAnalytics(events, dateRange);

  const overviewAnalytics = useOverviewAnalytics(events, dateRange);
  const overviewData = overviewAnalytics.generateOverviewData();

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 flex flex-col gap-2">
            <div>
              <div className="text-2xl font-bold text-orange-700">
                {totalFeedings}
              </div>
              <div className="text-xs text-orange-600">Total Feedings</div>
            </div>
            <div className="flex flex-col justify-start gap-1">
              <div className="text-xs text-gray-500/80">
                {avgFeedingsPerDay}/day avg.
              </div>
              <div className="text-xs text-gray-500/80">
                {formatDuration(avgFeedingDuration, "minutes")} avg. duration
              </div>
              <div className="text-xs text-gray-500/80">
                {avgFeedingAmount}ml avg. amount
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(totalSleepHours)}h
            </div>
            <div className="flex flex-col justify-start gap-1">
              <div className="text-xs text-blue-600">Total Sleep</div>
              <div className="text-xs text-blue-500">
                {formatDuration(avgSleepPerDay, "hours")} avg/day
              </div>
            </div>
            <div className="flex flex-col justify-start gap-1">
              <div className="text-xs text-gray-500/80">
                {formatDuration(avgSleepDuration, "hours")} avg. duration
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            {dateRange.label} overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={overviewData}>
              <defs>
                <linearGradient
                  id="feedingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="feedings"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#feedingGradient)"
                name="Feedings"
                animationDuration={1000}
                animationBegin={0}
              />
              <Area
                type="monotone"
                dataKey="sleepHours"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#sleepGradient)"
                name="Sleep Hours"
                animationDuration={1000}
                animationBegin={200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AnalyticsOverview;
