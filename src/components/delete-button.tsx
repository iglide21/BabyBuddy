import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

const DeleteButton = ({ onClick, disabled }: DeleteButtonProps) => {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={onClick}
      className="px-3"
      disabled={disabled}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export default DeleteButton;
