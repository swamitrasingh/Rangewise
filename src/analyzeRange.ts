import type { RangeAnalysis, RangeContext } from "./types";

function isSameMinute(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate() &&
    start.getHours() === end.getHours() &&
    start.getMinutes() === end.getMinutes()
  );
}

function isSameHour(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate() &&
    start.getHours() === end.getHours()
  );
}

export function analyzeRange(start: Date, end: Date): RangeAnalysis {
  if (end < start) {
    throw new Error("End date must be after start date.");
  }

  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const sameDay = sameMonth && start.getDate() === end.getDate();
  const sameHour = isSameHour(start, end);
  const sameMinute = isSameMinute(start, end);

  let context: RangeContext = "cross-year";

  if (sameMinute) context = "same-minute";
  else if (sameHour) context = "same-hour";
  else if (sameDay) context = "same-day";
  else if (sameMonth) context = "same-month";
  else if (sameYear) context = "same-year";

  return {
    context,
    sameMinute,
    sameHour,
    sameDay,
    sameMonth,
    sameYear,
  };
}