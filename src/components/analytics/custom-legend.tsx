import { Payload } from "recharts/types/component/DefaultLegendContent";

const CustomLegend = ({ payload }: any) => {
  return (
    <ul className="flex items-center gap-2">
      {(payload as Payload[]).map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <p className="text-xs">{entry.value}</p>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
