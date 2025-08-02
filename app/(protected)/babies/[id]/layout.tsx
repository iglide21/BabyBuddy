import PageHeader from "@/src/components/baby/page-header";
import { LogDiaperModal, EditDiaperModal } from "@/src/components/diaper";
import { LogFeedingModal, EditFeedingModal } from "@/src/components/feeding";
import { LogSleepModal, EditSleepModal } from "@/src/components/sleeping";
import LocalizationProvider from "@/src/providers/localization-provider";

const BabyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      {children}

      <LogFeedingModal />
      <LogSleepModal />
      <LogDiaperModal />

      <EditSleepModal />
      <EditFeedingModal />
      <EditDiaperModal />
    </div>
  );
};

export default BabyLayout;
