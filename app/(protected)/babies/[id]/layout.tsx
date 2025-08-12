import { LogDiaperModal, EditDiaperModal } from "@/src/components/diaper";
import { LogFeedingModal, EditFeedingModal } from "@/src/components/feeding";
import { LogSleepModal, EditSleepModal } from "@/src/components/sleeping";
import BottomTabBar from "@/src/components/baby/bottom-tab-bar";

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

      <BottomTabBar />
    </div>
  );
};

export default BabyLayout;
