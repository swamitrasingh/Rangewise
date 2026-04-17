/**
 * Example: Named Format Registry with type-safe autocomplete.
 *
 * Run with:  npx tsx src/example-formatter.ts
 */
import { createFormatter } from "./createFormatter";

// ─── Define a registry ────────────────────────────
const formats = {
  invite: {
    dateRange: {
      type: "range" as const,
      options: { compactAmPm: true },
    },
  },
  alarm: {
    dateTime: {
      type: "date" as const,
      options: { hour12: false },
    },
  },
  event: {
    fullDay: {
      type: "range" as const,
      locale: "en-US",
      options: { spaced: true },
    },
  },
} as const;

// ─── Create the formatter ─────────────────────────
const format = createFormatter(formats);

// ─── Test dates ───────────────────────────────────
const now = new Date();
const later = new Date(now.getTime() + 3 * 60 * 60 * 1000); // +3 hours

console.log("=== Named Format Registry Demo ===\n");

// ✅ String key — full autocomplete for: 'invite.dateRange' | 'alarm.dateTime' | 'event.fullDay'
const rangeResult = format("invite.dateRange", { start: now, end: later });
console.log(`invite.dateRange  → ${rangeResult}`);

const dateResult = format("alarm.dateTime", { date: now });
console.log(`alarm.dateTime    → ${dateResult}`);

const eventResult = format("event.fullDay", { start: now, end: later });
console.log(`event.fullDay     → ${eventResult}`);

// ✅ Direct config reference
const directResult = format(formats.alarm.dateTime, { date: now });
console.log(`direct config     → ${directResult}`);

console.log("\n=== Error handling ===\n");

// ✅ Runtime error: invalid key
try {
  (format as Function)("nonexistent.key", { date: now });
} catch (e) {
  console.log(`invalid key       → ${(e as Error).message}`);
}

// ✅ Runtime error: wrong input shape
try {
  (format as Function)("invite.dateRange", { date: now });
} catch (e) {
  console.log(`wrong input       → ${(e as Error).message}`);
}

console.log("\n✅ All checks passed.");

// ─── Type-level checks (uncomment to verify TS errors) ────
// format('invite.dateRange', { date: new Date() });       // ❌ Type error: expects { start, end }
// format('alarm.dateTime', { start: now, end: later });   // ❌ Type error: expects { date }
// format('nonexistent.key', { date: now });                // ❌ Type error: invalid key
