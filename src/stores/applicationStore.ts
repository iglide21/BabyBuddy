import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../lib/createSelectors";
import type { Nullable } from "@/types/common";
import type { ApplicationModal } from "@/src/lib/types";

type ApplicationStoreState = {
  isModalOpen: boolean;
  currentModal: Nullable<ApplicationModal>;
  showModal: (modal: ApplicationModal) => void;
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
