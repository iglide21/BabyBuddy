import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

const EditButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const isMobile = useIsMobile();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`transition-opacity ${
        isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      disabled={disabled}
    >
      <Edit className="w-4 h-4" />
    </Button>
  );
};

export default EditButton;
