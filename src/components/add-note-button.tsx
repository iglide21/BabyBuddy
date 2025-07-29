import { cn } from "@/src/lib/utils";
import { Button } from "./ui/button";

const AddNoteButton = ({
  setShowNotes,
  className,
}: {
  setShowNotes: (show: boolean) => void;
  className?: string;
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => setShowNotes(true)}
      className={cn(
        "ring-offset-background inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 w-full text-gray-600 rounded-xl h-12 border-2 border-dashed border-gray-300 transition-all duration-200",
        className
      )}
    >
      + Add note (optional)
    </Button>
  );
};

export default AddNoteButton;
