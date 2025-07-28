import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useCurrentBabyStore } from "../stores/currentBabyStore";

type QuickActionButtonProps = {
  onClick: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
};

const QuickActionButton = ({
  onClick,
  title,
  icon,
  description,
  className,
}: QuickActionButtonProps) => {
  const currentBaby = useCurrentBabyStore.use.currentBaby();

  return (
    <Button
      variant="default"
      size="xl"
      onClick={() => onClick()}
      className={cn(
        "flex-col h-24 gap-2 text-foreground shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-pulse",
        className
      )}
      disabled={!currentBaby}
    >
      <div className="flex items-center gap-2">
        {icon}
        <Plus className="h-4 w-4" />
      </div>
      <span className="text-base font-semibold">{title}</span>
      <span className="text-xs opacity-90">{description}</span>
    </Button>
  );
};

export default QuickActionButton;
