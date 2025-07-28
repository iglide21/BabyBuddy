import { Milk } from "lucide-react";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "../ui/dialog";
import { useApplicationStore } from "@/src/stores/applicationStore";
import { useMemo } from "react";

const FeedingModal = ({
  onClose,
  action,
  children,
}: {
  onClose: () => void;
  action: "log" | "edit";
  children: React.ReactNode;
}) => {
  const openedModal = useApplicationStore.use.currentModal();
  const isOpen = useMemo(
    () => openedModal?.type === `feeding_${action}`,
    [openedModal, action]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-0 p-0 rounded-xl">
        <DialogHeader className="p-4 bg-gradient-to-tr from-orange-400 to-orange-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-orange-300 to-orange-400 rounded-xl p-2">
              <Milk className="w-5 h-5" />
            </span>
            <span className="text-white text-xl font-bold">
              <span className="capitalize">{action}</span> feeding
            </span>
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default FeedingModal;
