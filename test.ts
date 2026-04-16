import { formatRangeUX } from "./src/formatRangeUX";

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
    const result = formatRangeUX(start, end, locale, {
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
  formatRangeUX(
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
// SUMMARY
// --------------------------------------------------

console.log("\n============================");
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log("============================");