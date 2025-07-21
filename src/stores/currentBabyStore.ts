import { create } from "zustand";

import type { Nullable } from "@/types/common";
import type { Baby } from "@/types/data/babies/types";
import { createSelectors } from "../lib/createSelectors";
import { immer } from "zustand/middleware/immer";

type CurrentBabyStoreState = {
  currentBaby: Nullable<Baby>;
  setCurrentBaby: (baby: Baby) => void;
  resetState: () => void;
};

export const useCurrentBabyStoreBase = create<CurrentBabyStoreState>()(
  immer((set) => ({
    currentBaby: null,
    setCurrentBaby: (baby) =>
      set((state) => {
        state.currentBaby = baby;
      }),
    resetState: () =>
      set((state) => {
        state.currentBaby = null;
      }),
  }))
);

export const useCurrentBabyStore = createSelectors(useCurrentBabyStoreBase);
