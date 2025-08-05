export type DateRangeValue =
  | "1day"
  | "1week"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "custom";

export type PredefinedRange = {
  label: string;
  value: DateRangeValue;
  getRange: () => DateRange;
};

export type DateRange = {
  label: string;
  value: DateRangeValue;
  from: Date;
  to: Date;
};
