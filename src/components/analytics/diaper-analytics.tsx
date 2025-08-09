"use client";

import { Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TabsContent } from "@/src/components/ui/tabs";
import { Card, CardTitle, CardContent, CardHeader } from "@/src/components/ui";
import { useDiaperAnalytics } from "@/src/hooks/data/queries";
import { CustomTooltip } from "./custom-tooltip";
import useEvents from "@/src/hooks/data/queries/useEvents";
import dayjs from "dayjs";
import { DateRange } from "@/types/date-range";

type DiaperAnalyticsProps = {
  currentBabyId: string;
  dateRange: DateRange;
};

const DiaperAnalytics = ({
  currentBabyId,
  dateRange,
}: DiaperAnalyticsProps) => {
  const { from, to } = dateRange;

  const startDateString = dayjs(from).toISOString();
  const endDateString = dayjs(to).toISOString();

  const { data: events } = useEvents(
    currentBabyId,
    startDateString,
    endDateString
  );
  const diaperAnalytics = useDiaperAnalytics(events, dateRange);

  const diaperData = diaperAnalytics.generateDiaperData();
  const totalDiapers = diaperAnalytics.totalDiapers;

  return (
    <TabsContent value="diapers" className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-700">
              {diaperAnalytics.wetDiapers}
            </div>
            <div className="text-xs text-blue-600">Wet</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-yellow-700">
              {diaperAnalytics.dirtyDiapers}
            </div>
            <div className="text-xs text-yellow-600">Dirty</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-700">
              {diaperAnalytics.bothDiapers}
            </div>
            <div className="text-xs text-green-600">Both</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-indigo-700">
              {totalDiapers}
            </div>
            <div className="text-xs text-indigo-600">Total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4" />
            Diaper Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={diaperData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="wet"
                stackId="a"
                fill="#3b82f6"
                name="Wet"
                animationDuration={800}
                animationBegin={0}
              />
              <Bar
                dataKey="dirty"
                stackId="a"
                fill="#eab308"
                name="Dirty"
                animationDuration={800}
                animationBegin={100}
              />
              <Bar
                dataKey="both"
                stackId="a"
                fill="#10b981"
                name="Both"
                animationDuration={800}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DiaperAnalytics;
