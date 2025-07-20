import { Baby, Moon, Plus } from "lucide-react";
import { useApplicationStore } from "../stores/applicationStore";
import QuickActionButton from "./quick-action-button";

const QuickActions = () => {
  const showModal = useApplicationStore.use.showModal();

  return (
    <div className="grid grid-cols-3 gap-3">
      <QuickActionButton
        title="Feeding"
        description="Log a feed"
        icon={<Baby className="h-6 w-6" />}
        onClick={() => showModal("feeding")}
        className="bg-gradient-to-r from-amber-200 to-amber-400"
      />

      <QuickActionButton
        title="Sleep"
        description="Log sleep"
        icon={<Moon className="h-6 w-6" />}
        onClick={() => showModal("sleep")}
        className="bg-gradient-to-r from-blue-200 to-blue-400"
      />

      <QuickActionButton
        title="Diaper"
        description="Log change"
        icon={<span className="text-md">💩</span>}
        onClick={() => showModal("diaper")}
        className="bg-gradient-to-r from-green-200 to-green-400"
      />
    </div>
  );
};

export default QuickActions;
