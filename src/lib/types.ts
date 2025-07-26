export type ApplicationModal = {
  type:
    | "createBaby"
    | "feeding_log"
    | "feeding_edit"
    | "sleep_log"
    | "sleep_edit"
    | "diaper_log"
    | "diaper_edit";
  data: Record<string, any>;
};
