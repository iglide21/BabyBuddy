import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../lib/createSelectors";

type CurrentView = "dashboard" | "history" | "settings" | "notifications";

type ApplicationStoreState = {
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
};

export const useApplicationStoreBase = create<ApplicationStoreState>()(
  immer((set) => ({
    currentView: "dashboard",
    setCurrentView: (view) =>
      set((state) => {
        state.currentView = view;
      }),
  }))
);

export const useApplicationStore = createSelectors(useApplicationStoreBase);
