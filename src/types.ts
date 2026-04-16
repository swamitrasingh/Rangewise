export type RangeContext =
  | "same-minute"
  | "same-hour"
  | "same-day"
  | "same-week"
  | "same-month"
  | "same-year"
  | "cross-year";

export interface RangeAnalysis {
  context: RangeContext;
  sameMinute: boolean;
  sameHour: boolean;
  sameDay: boolean;
  sameMonth: boolean;
  sameYear: boolean;
}