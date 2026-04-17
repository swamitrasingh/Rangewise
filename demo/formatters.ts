/**
 * Formats a single date.
 */
import { formatDate, formatRange } from "../src/formatRange";

export function formatDateTime(date: Date | null): string {
    if (!date || isNaN(date.getTime())) return "None";

    return formatDate(date);
}

/**
 * Formats a start and end date as a range.
 */
export function formatDateTimeRange(start: Date | undefined, end: Date | undefined): string {
    if (start && end) {
        return formatRange(start, end);
    } else if (start) {
        return `${formatDate(start)} — (Select End Date)`;
    } else if (end) {
        return `(Select Start Date) — ${formatDate(end)}`;
    }
    return "None";
}

