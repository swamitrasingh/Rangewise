import { formatDate, formatRange } from "./src/formatRange";

let passed = 0;
let failed = 0;

// ✅ Fixed "current time"
const NOW = new Date("2026-04-16T09:00:00");

function runTest(
  label: string,
  start: Date,
  end: Date,
  expected: string,
  options: any = {},
  locale = "en-IN"
) {
  try {
    const result = formatRange(start, end, locale, {
      ...options,
      now: NOW,
    });

    const isPass = result === expected;

    console.log(`\n=== ${label} ===`);
    console.log("Output  :", result);
    console.log("Expected:", expected);
    console.log(isPass ? "✅ PASS" : "❌ FAIL");

    if (isPass) passed++;
    else failed++;
  } catch (e: any) {
    console.log(`\n=== ${label} (ERROR) ===`);
    console.log("Error:", e.message);
    failed++;
  }
}

// 🧪 BASE TIME
const base = new Date("2026-04-16T10:00:00");
const sameDayEnd = new Date("2026-04-16T12:00:00");

// --------------------------------------------------
// SAME DAY
// --------------------------------------------------

runTest(
  "Same Day (default en-IN)",
  base,
  sameDayEnd,
  "Today, 10:00–12:00"
);

runTest(
  "Same Day (en-US auto 12h)",
  base,
  sameDayEnd,
  "Today, 10:00 AM–12:00 PM",
  {},
  "en-US"
);

runTest(
  "Same Day (force 24h)",
  base,
  sameDayEnd,
  "Today, 10:00–12:00",
  { hour12: false },
  "en-US"
);

// --------------------------------------------------
// LOCALIZATION
// --------------------------------------------------

runTest(
  "Spanish Today",
  base,
  sameDayEnd,
  "Hoy, 10:00–12:00",
  {},
  "es-ES"
);

runTest(
  "French Today",
  base,
  sameDayEnd,
  "Aujourd’hui, 10:00–12:00",
  {},
  "fr-FR"
);

runTest(
  "German Today",
  base,
  sameDayEnd,
  "Heute, 10:00–12:00",
  {},
  "de-DE"
);

// --------------------------------------------------
// TOMORROW / YESTERDAY
// --------------------------------------------------

runTest(
  "Tomorrow",
  new Date("2026-04-17T10:00:00"),
  new Date("2026-04-17T12:00:00"),
  "Tomorrow, 10:00–12:00"
);

runTest(
  "Yesterday",
  new Date("2026-04-15T10:00:00"),
  new Date("2026-04-15T12:00:00"),
  "Yesterday, 10:00–12:00"
);

// --------------------------------------------------
// SAME MONTH / YEAR / CROSS YEAR
// --------------------------------------------------

runTest(
  "Same Month",
  new Date("2026-04-10T10:00:00"),
  new Date("2026-04-15T12:00:00"),
  "10–15 Apr 2026"
);

runTest(
  "Same Year",
  new Date("2026-04-15T10:00:00"),
  new Date("2026-06-20T12:00:00"),
  "15 Apr–20 Jun 2026"
);

runTest(
  "Cross Year",
  new Date("2026-12-31T10:00:00"),
  new Date("2027-01-02T12:00:00"),
  "31 Dec 2026–2 Jan 2027"
);

// --------------------------------------------------
// AM/PM COLLAPSE (VALID CASE ONLY)
// --------------------------------------------------

runTest(
  "AM/PM Collapse (valid AM case)",
  new Date("2026-04-16T10:00:00"),
  new Date("2026-04-16T11:00:00"),
  "Today, 10:00–11:00 AM",
  {},
  "en-US"
);

runTest(
  "AM/PM Collapse (valid PM case)",
  new Date("2026-04-16T13:00:00"),
  new Date("2026-04-16T15:00:00"),
  "Today, 01:00–03:00 PM",
  {},
  "en-US"
);

// --------------------------------------------------
// NO COLLAPSE (AM → PM)
// --------------------------------------------------

runTest(
  "No Collapse (AM → PM)",
  new Date("2026-04-16T08:00:00"),
  new Date("2026-04-16T14:00:00"),
  "Today, 08:00 AM–02:00 PM",
  {},
  "en-US"
);

// --------------------------------------------------
// COMPACT AM/PM
// --------------------------------------------------

runTest(
  "Compact AM/PM (no collapse)",
  base,
  sameDayEnd,
  "Today, 10:00am–12:00pm",
  { compactAmPm: true },
  "en-US"
);

runTest(
  "Compact + AM collapse",
  new Date("2026-04-16T10:00:00"),
  new Date("2026-04-16T11:00:00"),
  "Today, 10:00–11:00am",
  { compactAmPm: true },
  "en-US"
);

// --------------------------------------------------
// FORCE 24H
// --------------------------------------------------

runTest(
  "Force 24h ignores AM/PM",
  base,
  sameDayEnd,
  "Today, 10:00–12:00",
  { hour12: false },
  "en-US"
);

// --------------------------------------------------
// NON-EN LOCALE
// --------------------------------------------------

runTest(
  "French locale (no AM/PM)",
  base,
  sameDayEnd,
  "Aujourd’hui, 10:00–12:00",
  {},
  "fr-FR"
);

// --------------------------------------------------
// ERROR CASE
// --------------------------------------------------

try {
  formatRange(
    new Date("2026-04-16T12:00:00"),
    new Date("2026-04-16T10:00:00"),
    "en-IN",
    { now: NOW }
  );

  // ❌ If no error thrown → fail
  console.log("\n❌ FAIL: Invalid range did not throw error");
  failed++;

} catch (e: any) {

  // ✅ Expected behavior
  console.log("\n=== Invalid Range ===");
  console.log("Error:", e.message);
  console.log("✅ PASS");

  passed++;
}

// --------------------------------------------------
// FORMAT DATE (SINGLE DATETIME)
// --------------------------------------------------

function runDateTest(
  label: string,
  date: Date,
  expected: string,
  options: any = {},
  locale = "en-IN"
) {
  try {
    const result = formatDate(date, locale, {
      ...options,
      now: NOW,
    });

    const isPass = result === expected;

    console.log(`\n=== ${label} ===`);
    console.log("Output  :", result);
    console.log("Expected:", expected);
    console.log(isPass ? "✅ PASS" : "❌ FAIL");

    if (isPass) passed++;
    else failed++;
  } catch (e: any) {
    console.log(`\n=== ${label} (ERROR) ===`);
    console.log("Error:", e.message);
    failed++;
  }
}

// --------------------------------------------------
// BASIC CASES
// --------------------------------------------------

runDateTest(
  "Today (default en-IN)",
  new Date("2026-04-16T10:00:00"),
  "Today, 10:00"
);

runDateTest(
  "Today (en-US 12h)",
  new Date("2026-04-16T10:00:00"),
  "Today, 10:00 AM",
  {},
  "en-US"
);

runDateTest(
  "Today (force 24h)",
  new Date("2026-04-16T10:00:00"),
  "Today, 10:00",
  { hour12: false },
  "en-US"
);

// --------------------------------------------------
// TOMORROW / YESTERDAY
// --------------------------------------------------

runDateTest(
  "Tomorrow",
  new Date("2026-04-17T10:00:00"),
  "Tomorrow, 10:00"
);

runDateTest(
  "Yesterday",
  new Date("2026-04-15T10:00:00"),
  "Yesterday, 10:00"
);

// --------------------------------------------------
// SAME WEEK (weekday label)
// --------------------------------------------------

runDateTest(
  "Same week (weekday)",
  new Date("2026-04-14T10:00:00"),
  "Tue, 10:00"
);

// --------------------------------------------------
// OLDER DATE (full date)
// --------------------------------------------------

runDateTest(
  "Older date (full format)",
  new Date("2026-03-10T10:00:00"),
  "10 Mar 2026, 10:00"
);

// --------------------------------------------------
// COMPACT AM/PM
// --------------------------------------------------

runDateTest(
  "Compact AM/PM",
  new Date("2026-04-16T10:00:00"),
  "Today, 10:00am",
  { compactAmPm: true },
  "en-US"
);

// --------------------------------------------------
// HIDE MINUTES
// --------------------------------------------------

runDateTest(
  "Hide minutes",
  new Date("2026-04-16T10:00:00"),
  "Today, 10",
  { hideMinutes: true }
);

// --------------------------------------------------
// COMBINED OPTIONS
// --------------------------------------------------

runDateTest(
  "Compact + hideMinutes",
  new Date("2026-04-16T10:00:00"),
  "Today, 10am",
  { hideMinutes: true, compactAmPm: true },
  "en-US"
);

// --------------------------------------------------
// LOCALES
// --------------------------------------------------

runDateTest(
  "Spanish",
  new Date("2026-04-16T10:00:00"),
  "Hoy, 10:00",
  {},
  "es-ES"
);

runDateTest(
  "French",
  new Date("2026-04-16T10:00:00"),
  "Aujourd’hui, 10:00",
  {},
  "fr-FR"
);

runDateTest(
  "German",
  new Date("2026-04-16T10:00:00"),
  "Heute, 10:00",
  {},
  "de-DE"
);
// --------------------------------------------------
// CREATE FORMATTER
// --------------------------------------------------

import { createFormatter } from "./src/createFormatter";

const testRegistry = {
  events: {
    meeting: {
      type: "date" as const,
      options: { hour12: false, now: NOW }
    },
    conference: {
      type: "range" as const,
      locale: "en-US",
      options: { spaced: true, compactAmPm: true, now: NOW }
    }
  }
} as const;

const formatFn = createFormatter(testRegistry);

function runFormatterTest(
  label: string,
  key: "events.meeting" | "events.conference",
  input: any,
  expected: string
) {
  try {
    const result = formatFn(key, input);

    const isPass = result === expected;

    console.log(`\n=== ${label} ===`);
    console.log("Output  :", result);
    console.log("Expected:", expected);
    console.log(isPass ? "✅ PASS" : "❌ FAIL");

    if (isPass) passed++;
    else failed++;
  } catch (e: any) {
    console.log(`\n=== ${label} (ERROR) ===`);
    console.log("Error:", e.message);
    failed++;
  }
}

runFormatterTest(
  "createFormatter (date)",
  "events.meeting",
  { date: new Date("2026-04-16T10:00:00") },
  "Today, 10:00"
);

runFormatterTest(
  "createFormatter (range)",
  "events.conference",
  { start: new Date("2026-04-16T10:00:00"), end: new Date("2026-04-16T12:00:00") },
  "Today, 10:00am – 12:00pm"
);

try {
  const result = formatFn(testRegistry.events.meeting, { date: new Date("2026-04-16T10:00:00") });
  const isPass = result === "Today, 10:00";
  console.log(`\n=== createFormatter (direct config) ===`);
  console.log("Output  :", result);
  console.log("Expected: Today, 10:00");
  console.log(isPass ? "✅ PASS" : "❌ FAIL");
  if (isPass) passed++;
  else failed++;
} catch (e: any) {
  console.log(`\n=== createFormatter (direct config) (ERROR) ===`);
  console.log("Error:", e.message);
  failed++;
}

// --------------------------------------------------
// SUMMARY
// --------------------------------------------------

console.log("\n============================");
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log("============================");