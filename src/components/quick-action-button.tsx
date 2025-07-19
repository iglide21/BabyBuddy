import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Baby, Plus } from "lucide-react";

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
  return (
    <Button
      variant="default"
      size="xl"
      onClick={() => onClick()}
      className={cn("flex-col h-24 gap-2 text-foreground shadow-sm", className)}
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
