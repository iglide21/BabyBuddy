import { Feeding } from "./data/feeding/types";
import { Sleep } from "./data/sleeps/types";
import { Diaper } from "./data/diapers/types";
import { Event } from "./data/events/types";

export type LogEntry =
  | Feeding
  | Sleep
  | (Diaper & { logType: "feeding" | "sleep" | "diaper" });

export type ActivityComponentProps = {
  event: Event;
  editEvent?: (event: Event) => void;
};
