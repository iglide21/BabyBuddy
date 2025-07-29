import { Button } from "./ui/button";
import { Trash } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const DeleteButton = ({ onClick, disabled }: DeleteButtonProps) => {
  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      onClick={onClick}
      disabled={disabled}
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
};

export default DeleteButton;
