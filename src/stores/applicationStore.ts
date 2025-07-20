import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../lib/createSelectors";

type CurrentView = "dashboard" | "history" | "settings" | "notifications";

type ApplicationStoreState = {
  isModalOpen: boolean;
  currentModal: "feeding" | "sleep" | "diaper" | null;
  showModal: (modal: "feeding" | "sleep" | "diaper") => void;
  closeModal: () => void;
};

export const useApplicationStoreBase = create<ApplicationStoreState>()(
  immer((set) => ({
    isModalOpen: false,
    currentModal: null,
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
