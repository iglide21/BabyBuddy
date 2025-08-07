"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Milk,
  Moon,
  BarChart3,
  PieChartIcon as PieIcon,
  Activity,
} from "lucide-react";
import {
  LineChart,
  AreaChart,
  Area,
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
} from "recharts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  Skeleton,
} from "@/src/components/ui";
import { Button } from "@/src/components/ui/button";
import { DateRangePicker } from "@/src/components/date-range-picker";
import useEvents from "@/src/hooks/data/queries/useEvents";
import {
  useFeedingAnalytics,
  useSleepAnalytics,
  useDiaperAnalytics,
  useOverviewAnalytics,
} from "@/src/hooks/data/queries";
import { useBabyFromUrl } from "@/src/hooks";
import dayjs, { getStartOfDay, getEndOfDay } from "lib/dayjs";
import { useRouter } from "next/navigation";
import { DateRange } from "@/types/date-range";

const AnalyticsView = () => {
  const router = useRouter();
  const { currentBaby } = useBabyFromUrl();

  // Default to last 7 days
  const defaultDateRange: DateRange = useMemo(
    () => ({
      label: "Last 7 days",
      value: "1week",
      from: getStartOfDay(dayjs().subtract(7, "day")).toDate(),
      to: getEndOfDay(dayjs()).toDate(),
    }),
    []
  );

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  const startDate = useMemo(
    () => dayjs(dateRange.from).toISOString(),
    [dateRange.from]
  );
  const endDate = useMemo(
    () => dayjs(dateRange.to).toISOString(),
    [dateRange.to]
  );

  const { data: events, isPending } = useEvents(
    currentBaby?.id ?? "",
    startDate,
    endDate
  );

  // Use custom analytics hooks
  const feedingAnalytics = useFeedingAnalytics(events, dateRange);
  const sleepAnalytics = useSleepAnalytics(events, dateRange);
  const diaperAnalytics = useDiaperAnalytics(events, dateRange);
  const overviewAnalytics = useOverviewAnalytics(events, dateRange);

  const [activeTab, setActiveTab] = useState("overview");

  // Generate chart data
  const overviewData = overviewAnalytics.generateOverviewData();
  const feedingData = feedingAnalytics.generateFeedingData();
  const sleepData = sleepAnalytics.generateSleepData();
  const diaperData = diaperAnalytics.generateDiaperData();
  const feedingTypeData = feedingAnalytics.generateFeedingTypeData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === "sleepHours" || entry.dataKey === "totalHours"
                ? "h"
                : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate summary stats
  const totalFeedings = feedingAnalytics.totalFeedings;
  const totalSleepHours = sleepAnalytics.totalSleepHours;
  const avgSleepDuration = sleepAnalytics.avgSleepDuration;
  const totalDiapers = diaperAnalytics.totalDiapers;

  // Use values from hooks directly
  const avgFeedingDuration = feedingAnalytics.avgFeedingDuration;
  const avgFeedingAmount = feedingAnalytics.avgFeedingAmount;
  const avgFeedingsPerDay = feedingAnalytics.avgFeedingsPerDay;
  const avgSleepPerDay = sleepAnalytics.avgSleepPerDay;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-20 z-10">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h1 className="text-lg font-bold text-gray-800">Analytics</h1>
              </div>
              <p className="text-sm text-gray-600 ">
                {currentBaby?.name ?? "Baby"}'s activity insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="feeding" className="text-xs">
              Feeding
            </TabsTrigger>
            <TabsTrigger value="sleep" className="text-xs">
              Sleep
            </TabsTrigger>
            <TabsTrigger value="diapers" className="text-xs">
              Diapers
            </TabsTrigger>
          </TabsList>

          <div>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              disabled={isPending}
            />
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            {isPending ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <Skeleton className="h-40 w-full bg-gray-200 rounded-lg animate-pulse" />
                </div>
                <Skeleton className="h-64 w-full bg-gray-200 rounded-lg animate-pulse" />
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div>
                        <div className="text-2xl font-bold text-orange-700">
                          {totalFeedings}
                        </div>
                        <div className="text-xs text-orange-600">
                          Total Feedings
                        </div>
                      </div>
                      <div className="flex flex-col justify-start gap-1">
                        <div className="text-xs text-gray-500/80">
                          {avgFeedingsPerDay}/day avg.
                        </div>
                        <div className="text-xs text-gray-500/80">
                          {avgFeedingDuration}min avg. duration
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
                          {avgSleepPerDay}h/day avg
                        </div>
                      </div>
                      <div className="flex flex-col justify-start gap-1">
                        <div className="text-xs text-gray-500/80">
                          {avgSleepDuration}min avg. duration
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
                            <stop
                              offset="5%"
                              stopColor="#f97316"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f97316"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="sleepGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
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
              </>
            )}
          </TabsContent>

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
                    {sleepAnalytics.totalSleepSessions}
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
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={sleepData}>
                    <defs>
                      <linearGradient
                        id="sleepLineGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                    <Area
                      type="monotone"
                      dataKey="totalHours"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#sleepLineGradient)"
                      name="Sleep Hours"
                      animationDuration={1200}
                      animationBegin={0}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diapers" className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
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
                    {totalDiapers}
                  </div>
                  <div className="text-xs text-green-600">Total</div>
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
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsView;
