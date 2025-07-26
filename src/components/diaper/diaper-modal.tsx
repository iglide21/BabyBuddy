"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { useApplicationStore } from "@/src/stores/applicationStore";

const DiaperModal = ({
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
    () => openedModal?.type === `diaper_${action}`,
    [openedModal, action]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-0 p-0 rounded-xl">
        <DialogHeader className="p-4 bg-gradient-to-tr from-green-400 to-green-500 text-white rounded-t-xl">
          <DialogTitle className="flex items-center gap-3">
            <span className="bg-gradient-to-tr from-green-300 to-green-400 rounded-xl p-2">
              <span className="text-lg">💩</span>
            </span>
            <span className="text-white text-xl font-bold">
              <span className="capitalize">{action}</span> diaper
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DiaperModal;
