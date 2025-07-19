import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../lib/createSelectors";

type CurrentView = "dashboard" | "history" | "settings" | "notifications";

type ApplicationStoreState = {
  currentView: CurrentView;
  isModalOpen: boolean;
  currentModal: "feeding" | "sleep" | "diaper" | null;
  setCurrentView: (view: CurrentView) => void;
  showModal: (modal: "feeding" | "sleep" | "diaper") => void;
  closeModal: () => void;
};

export const useApplicationStoreBase = create<ApplicationStoreState>()(
  immer((set) => ({
    currentView: "dashboard",
    isModalOpen: false,
    currentModal: null,
    setCurrentView: (view) =>
      set((state) => {
        state.currentView = view;
      }),
    showModal: (modal) =>
      set((state) => {
        state.isModalOpen = true;
        state.currentModal = modal;
      }),
    closeModal: () =>
      set((state) => {
        state.isModalOpen = false;
        state.currentModal = null;
      }),
  }))
);

export const useApplicationStore = createSelectors(useApplicationStoreBase);
