import { CreateFeeding, Feeding } from "./data/feeding/types";
import { CreateSleep, Sleep } from "./data/sleeps/types";
import { CreateDiaper, Diaper } from "./data/diapers/types";
import { Event } from "./data/events/types";

export type LogEntry = Feeding | Sleep | Diaper;

export type ActivityComponentProps = {
  event: Event;
  editEvent?: (event: Event) => void;
};

export type Nullable<T> = T | null;

export type BabyEvents = {
  create: CreateFeeding | CreateSleep | CreateDiaper;
};
