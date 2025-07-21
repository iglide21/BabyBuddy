import { Baby } from "@/types/data/babies/types";
import { Card, CardContent, Button } from "../ui";
import { Calendar } from "lucide-react";
import dayjs from "@/src/lib/dayjs";

type BabyCardProps = {
  baby: Baby;
};

const BabyCard = ({ baby }: BabyCardProps) => {
  const calculateAge = (birthDate: string): string => {
    const birth = dayjs(birthDate);
    const now = dayjs();
    const diffDays = now.diff(birth, "day");

    if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} old`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? "" : "s"} old`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months === 1 ? "" : "s"} old`;
    }
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} year${years === 1 ? "" : "s"}${
      remainingMonths > 0
        ? ` and ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`
        : ""
    } old`;
  };

  return (
    <Card
      key={baby.id}
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-pink-300"
      // onClick={() => onSelectBaby(baby)}
    >
      <CardContent className="p-6 text-center">
        <div className="text-6xl mb-4">{baby.name}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{baby.name}</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{calculateAge(baby.birth_date)}</span>
        </div>
        <div className="text-xs text-gray-500">
          Born: {new Date(baby.birth_date).toLocaleDateString()}
        </div>
        <Button className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white">
          Select {baby.name}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BabyCard;
