import { Edit2 } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, Skeleton } from "../ui";
import { useBabyFromUrl } from "../../hooks/useBabyFromUrl";

const BabyInformationCard = () => {
  const { currentBaby } = useBabyFromUrl();

  if (!currentBaby) {
    return (
      <Skeleton className="w-full h-20 animate-pulse bg-gray-200 rounded-lg" />
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {currentBaby?.gender === "male" ? "👶🏻" : "👧🏻"}
            </div>
            <div>
              <CardTitle className="text-lg">{currentBaby?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Born{" "}
                {new Date(currentBaby?.birth_date ?? "").toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default BabyInformationCard;
