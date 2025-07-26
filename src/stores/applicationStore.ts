import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createSelectors } from "../lib/createSelectors";
import type { Nullable } from "@/types/common";
import type { ApplicationModal } from "@/src/lib/types";

type ApplicationStoreState = {
  isHamburgerMenuOpen: boolean;
  toggleHamburgerMenu: () => void;
  isModalOpen: boolean;
  currentModal: Nullable<ApplicationModal>;
  showModal: (modal: ApplicationModal) => void;
  closeModal: () => void;
};

export const useApplicationStoreBase = create<ApplicationStoreState>()(
  immer((set) => ({
    isHamburgerMenuOpen: false,

    isModalOpen: false,
    currentModal: null,
    toggleHamburgerMenu: () =>
      set((state) => {
        state.isHamburgerMenuOpen = !state.isHamburgerMenuOpen;
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
