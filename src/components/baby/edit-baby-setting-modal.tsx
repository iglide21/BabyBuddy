import { Edit, X, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  Button,
} from "../ui";
import { useApplicationStore } from "@/src/stores";
import { useMemo, useState } from "react";
import { useUpdateBaby } from "@/src/hooks/data/mutations";
import {
  EditBirthInformationSection,
  EditCurrentMeasurementsSection,
  EditMedicalInformationSection,
  EditNotesSection,
} from "./setting-sectionts";
import { BabySettingSection } from "@/types/baby";
import type { UpdateBaby } from "@/types/data/babies/types";
import { useBabyFromUrl } from "@/src/hooks/useBabyFromUrl";

const EditBabySettingModal = () => {
  const modal = useApplicationStore.use.currentModal() as {
    type: "edit_baby_setting";
    data: {
      babyId: string;
      sectionType: BabySettingSection;
    };
  };
  const closeModal = useApplicationStore.use.closeModal();
  const { currentBaby } = useBabyFromUrl();

  const { mutate: updateBabySetting, isPending } = useUpdateBaby();

  const handleFormSubmit = (data: Partial<UpdateBaby>) => {
    if (Object.keys(data).length === 0) {
      closeModal();
      return;
    }

    if (!currentBaby) {
      console.error("No current baby data available");
      return;
    }

    updateBabySetting(
      {
        babyId: modal?.data?.babyId,
        currentValues: data,
        previousValues: currentBaby,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  const isOpen = useMemo(() => modal?.type === "edit_baby_setting", [modal]);

  const getSectionTitle = (section: BabySettingSection | undefined) => {
    switch (section) {
      case "birth":
        return "Birth Information";
      case "current_measurements":
        return "Current Measurements";
      case "medical":
        return "Medical Information";
      case "notes":
        return "Notes";
      default:
        return "Edit Baby";
    }
  };

  const renderSectionContent = () => {
    switch (modal?.data?.sectionType) {
      case "birth":
        return (
          <EditBirthInformationSection
            onSubmit={handleFormSubmit}
            isSavePending={isPending}
          />
        );

      case "current_measurements":
        return (
          <EditCurrentMeasurementsSection
            onSubmit={handleFormSubmit}
            isSavePending={isPending}
          />
        );

      case "medical":
        return (
          <EditMedicalInformationSection
            onSubmit={handleFormSubmit}
            isSavePending={isPending}
          />
        );

      case "notes":
        return (
          <EditNotesSection
            onSubmit={handleFormSubmit}
            isSavePending={isPending}
          />
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Edit {getSectionTitle(modal?.data?.sectionType)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">{renderSectionContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBabySettingModal;
