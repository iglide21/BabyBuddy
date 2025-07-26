import { create } from "zustand";

import type { Nullable } from "@/types/common";
import type { Baby } from "@/types/data/babies/types";
import type { Event } from "@/types/data/events/types";
import { createSelectors } from "../lib/createSelectors";
import { immer } from "zustand/middleware/immer";

type CurrentBabyStoreState = {
  currentBaby: Nullable<Baby>;
  currentSelectedEvent: Nullable<Event>;
  setCurrentBaby: (baby: Baby) => void;
  setCurrentSelectedEvent: (event: Event) => void;
  resetState: () => void;
};

export const useCurrentBabyStoreBase = create<CurrentBabyStoreState>()(
  immer((set) => ({
    currentBaby: null,
    currentSelectedEvent: null,
    setCurrentBaby: (baby) =>
      set((state) => {
        state.currentBaby = baby;
      }),
    setCurrentSelectedEvent: (event) =>
      set((state) => {
        state.currentSelectedEvent = event;
      }),
    resetState: () =>
      set((state) => {
        state.currentBaby = null;
      }),
  }))
);

export const useCurrentBabyStore = createSelectors(useCurrentBabyStoreBase);
