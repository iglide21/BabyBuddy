"use client";

import { Moon } from "lucide-react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Legend,
} from "recharts";
import { TabsContent } from "@/src/components/ui/tabs";
import { Card, CardTitle, CardContent, CardHeader } from "@/src/components/ui";
import { useSleepAnalytics } from "@/src/hooks/data/queries";
import { DateRange } from "@/types/date-range";

import dayjs from "dayjs";
import useEvents from "@/src/hooks/data/queries/useEvents";
import { CustomTooltip } from "./custom-tooltip";
import CustomLegend from "./custom-legend";

type SleepAnalyticsProps = {
  currentBabyId: string;
  dateRange: DateRange;
};

const SleepAnalytics = ({ currentBabyId, dateRange }: SleepAnalyticsProps) => {
  const { from, to } = dateRange;

  const startDateString = dayjs(from).toISOString();
  const endDateString = dayjs(to).toISOString();

  const { data: events } = useEvents(
    currentBabyId,
    startDateString,
    endDateString
  );

  const sleepAnalytics = useSleepAnalytics(events, dateRange);

  const { totalSleepHours, totalSleepSessions } = sleepAnalytics;

  const sleepData = sleepAnalytics.generateSleepData();

  return (
    <TabsContent value="sleep" className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(totalSleepHours)}h
            </div>
            <div className="text-xs text-blue-600">Total Sleep</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700">
              {totalSleepSessions}
            </div>
            <div className="text-xs text-indigo-600">Sleep Sessions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="w-4 h-4" />
            Sleep Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6d6d6" />
              <XAxis
                dataKey="date"
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />

              <Area
                dataKey="totalHours"
                stroke="#15499c"
                strokeWidth={2}
                fill="none"
                name="Sleep Hours"
                animationDuration={1200}
                animationBegin={0}
                type="monotone"
              />
              <Area
                dataKey="avgSessionHrs"
                stroke="#336db1"
                strokeWidth={2}
                fill="none"
                name="Avg. duration"
                animationDuration={1200}
                animationBegin={0}
                type="monotone"
              />

              <Area
                dataKey="sessions"
                stroke="#7037f5"
                strokeWidth={2}
                fill="none"
                name="Sessions"
                type="monotone"
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                content={(props) => (
                  <CustomLegend payload={props.payload ?? []} />
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SleepAnalytics;
