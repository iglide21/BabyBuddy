"use client";

import { Milk, PieChartIcon as PieIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
  Area,
  AreaChart,
} from "recharts";
import { TabsContent } from "@/src/components/ui/tabs";
import { Card, CardTitle, CardContent, CardHeader } from "@/src/components/ui";
import { useFeedingAnalytics } from "@/src/hooks/data/queries";
import { DateRange } from "@/types/date-range";

import dayjs from "dayjs";
import useEvents from "@/src/hooks/data/queries/useEvents";
import { CustomTooltip } from "./custom-tooltip";
import CustomLegend from "./custom-legend";

type FeedingAnalyticsProps = {
  currentBabyId: string;
  dateRange: DateRange;
};

const FeedingAnalytics = ({
  currentBabyId,
  dateRange,
}: FeedingAnalyticsProps) => {
  const { from, to } = dateRange;

  const startDateString = dayjs(from).toISOString();
  const endDateString = dayjs(to).toISOString();

  const { data: events } = useEvents(
    currentBabyId,
    startDateString,
    endDateString
  );

  const feedingAnalytics = useFeedingAnalytics(events, dateRange);
  const feedingData = feedingAnalytics.generateFeedingData();
  const feedingTypeData = feedingAnalytics.generateFeedingTypeData();

  return (
    <TabsContent value="feeding" className="space-y-6">
      {/* Feeding Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-orange-700">
              {feedingAnalytics.breastCount}
            </div>
            <div className="text-xs text-orange-600">Breast</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-blue-700">
              {feedingAnalytics.bottleCount}
            </div>
            <div className="text-xs text-blue-600">Bottle</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-green-700">
              {feedingAnalytics.solidCount}
            </div>
            <div className="text-xs text-green-600">Solid</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Milk className="w-4 h-4" />
            Feedings per day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={feedingData}>
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

              <Area
                dataKey="total"
                stroke="#f5903e"
                strokeWidth={2}
                fill="none"
                name="Total"
                type="monotone"
              />

              <Tooltip content={<CustomTooltip />} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Milk className="w-4 h-4" />
            Feeding Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feedingData}>
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
                dataKey="breast"
                stackId="a"
                fill="#f97316"
                name="Breast"
                animationDuration={800}
                animationBegin={0}
              />
              <Bar
                dataKey="bottle"
                stackId="a"
                fill="#3b82f6"
                name="Bottle"
                animationDuration={800}
                animationBegin={100}
              />
              <Bar
                dataKey="solid"
                stackId="a"
                fill="#10b981"
                name="Solid"
                animationDuration={800}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feeding Type Distribution */}
      {feedingTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieIcon className="w-4 h-4" />
              Feeding Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={feedingTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={0}
                >
                  {feedingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  );
};

export default FeedingAnalytics;
