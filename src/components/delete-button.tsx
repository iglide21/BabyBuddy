import { QueryStatus } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
  status: QueryStatus;
};

const DeleteButton = ({ onClick, status }: DeleteButtonProps) => {
  return (
    <Button
      type="button"
      variant="destructive"
      onClick={onClick}
      className="px-3"
      disabled={status === "pending"}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
};

export default DeleteButton;
