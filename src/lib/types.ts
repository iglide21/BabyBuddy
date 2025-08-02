export type ApplicationModal = {
  type:
    | "create_baby"
    | "feeding_log"
    | "feeding_edit"
    | "sleep_log"
    | "sleep_edit"
    | "diaper_log"
    | "diaper_edit"
    | "reminder_log";
  data?: Record<string, any>;
};
