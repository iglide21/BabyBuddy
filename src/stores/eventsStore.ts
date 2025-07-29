import { create } from "zustand";
import type { Nullable } from "@/types/common";
import type { Event } from "@/types/data/events/types";
import { createSelectors } from "../lib/createSelectors";
import { immer } from "zustand/middleware/immer";

type EventsStoreState = {
  currentSelectedEvent: Nullable<Event>;
  setCurrentSelectedEvent: (event: Event) => void;
  resetState: () => void;
};

export const eventsStore = create<EventsStoreState>()(
  immer((set) => ({
    currentSelectedEvent: null,
    setCurrentSelectedEvent: (event) =>
      set((state) => {
        state.currentSelectedEvent = event;
      }),
    resetState: () =>
      set((state) => {
        state.currentSelectedEvent = null;
      }),
  }))
);

export const useEventsStore = createSelectors(eventsStore);
