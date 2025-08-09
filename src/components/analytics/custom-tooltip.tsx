import { formatDuration } from "@/src/lib/dayjs";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const durationKeys = ["sleepHours", "totalHours", "avgSessionHrs"];

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => {
          const formattedValue = durationKeys.includes(entry.dataKey)
            ? formatDuration(entry.value, "hours")
            : entry.value;

          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};
