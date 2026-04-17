# Rangewise

[![npm version](https://img.shields.io/npm/v/rangewise)](https://www.npmjs.com/package/rangewise)
[![license](https://img.shields.io/npm/l/rangewise)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rangewise)](https://bundlephobia.com/package/rangewise)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)](https://www.typescriptlang.org/)

**UX-first date & time formatting for JavaScript / TypeScript.**

Rangewise turns raw `Date` objects into clean, human-friendly strings — adapting automatically to context, locale, and time format.

```diff
-  16 Apr 2026, 10:00 AM – 16 Apr 2026, 12:00 PM
+  Today, 10:00–12:00 PM
```

---

## Why Rangewise?

Most date libraries optimise for **correctness** — they'll give you a perfectly formatted ISO string or locale date, but the output is often verbose and hard to scan at a glance.

Rangewise optimises for **readability and UX clarity**:

- If both times are in the morning, the redundant "AM" is collapsed — `10:00–11:00 AM`
- If the date is today, you see `Today` — not `16 Apr 2026`
- If start and end share the same month, the month isn't repeated — `10–15 Apr 2026`
- If the minutes are `:00`, you can hide them entirely — `10–12 PM`

It does the thinking so your users don't have to.

---

## Features

| Feature | Description |
|---|---|
| **Named Format Registry** | Define all your date formats in one config, use them everywhere with full TypeScript autocomplete |
| **Context-aware** | Adapts output based on whether the range is same-day, same-month, same-year, or cross-year |
| **Relative labels** | Automatically uses *Today*, *Tomorrow*, *Yesterday*, and weekday names |
| **Locale support** | Built-in labels for English, Spanish, French, and German; date formatting via `Intl.DateTimeFormat` |
| **AM/PM collapsing** | Removes redundant period markers when both times share AM or PM |
| **Compact AM/PM** | Lowercase, attached period markers (`10:00am`) for tighter UI layouts |
| **Hide minutes** | Drops `:00` when minutes are zero for a cleaner look |
| **Spaced separator** | Toggle between `–` and ` – ` |
| **Deterministic testing** | Override `now` for reproducible test output |
| **Zero dependencies** | Pure JS/TS — only uses the built-in `Intl` API |
| **Dual format** | Ships as ESM and CJS with full TypeScript declarations |

---

## Installation

```bash
# npm
npm install rangewise

# yarn
yarn add rangewise

# pnpm
pnpm add rangewise
```

---

## Quick Start — Named Format Registry

The **recommended way** to use Rangewise is through the Named Format Registry. Define all your application's date formats in a single configuration file, then use them anywhere with a one-liner.

### Step 1: Define your formats

Create a centralized config file — this is the single source of truth for every date format in your application.

```ts
// formatConfig.ts
import { createFormatter } from "rangewise";

const formats = {
  invite: {
    dateRange: {
      type: "range",
      locale: "en-US",
      options: {
        spaced: true,
        hour12: true,
        compactAmPm: true,
        hideMinutes: false,
      }
    }
  },
  alarm: {
    dateTime: {
      type: "date",
      options: { hour12: false }
    }
  },
  calendar: {
    event: {
      type: "range",
      options: { compactAmPm: true }
    },
    reminder: {
      type: "date",
      options: { hideMinutes: true, compactAmPm: true }
    }
  }
} as const;

export const format = createFormatter(formats);
```

### Step 2: Use it anywhere

Import the `format` function wherever you need it. Every call is **one line**, fully type-safe, and backed by the centralized config.

```ts
import { format } from "./formatConfig";

// String key — with full autocomplete in your IDE
format("invite.dateRange", { start, end });
// → "Today, 10:00am – 12:00pm"

format("alarm.dateTime", { date: new Date() });
// → "Today, 14:00"

format("calendar.reminder", { date: new Date() });
// → "Today, 2pm"
```

### Why this matters

| Without Registry | With Registry |
|---|---|
| Format options scattered across components | One config file, used everywhere |
| Inconsistent formatting across the app | Guaranteed consistency |
| Refactoring means hunting through files | Change once, applies globally |
| No autocomplete for format strings | Full IDE autocomplete + type safety |

The registry acts as a **design system for dates** — just like you centralize colors and typography, you centralize how every date appears.

---

### Type-Safe Autocomplete

The format function provides **full TypeScript autocomplete** for both keys and inputs:

```ts
// ✅ Autocomplete suggests: "invite.dateRange" | "alarm.dateTime" | "calendar.event" | "calendar.reminder"
format("invite.dateRange", { start, end });

// ✅ TypeScript knows this needs { start: Date; end: Date }
format("calendar.event", { start: new Date(), end: new Date() });

// ✅ TypeScript knows this needs { date: Date }
format("alarm.dateTime", { date: new Date() });

// ❌ Type error — "invite.dateRange" expects { start, end }, not { date }
format("invite.dateRange", { date: new Date() });

// ❌ Type error — invalid key
format("nonexistent.key", { date: new Date() });
```

You can also pass a config object directly:

```ts
format(formats.alarm.dateTime, { date: new Date() });
```

---

### Format Config Reference

Each entry in your registry is a `DateFormatConfig`:

```ts
{
  type: "date" | "range",   // Required — determines the input shape
  locale?: string,           // Optional — BCP 47 locale tag (default: "en-IN")
  options?: {                // Optional — formatting overrides
    spaced?: boolean,        //   Use spaced separator: " – " vs "–"
    hour12?: boolean,        //   Force 12h or 24h (auto-detected from locale if omitted)
    compactAmPm?: boolean,   //   Lowercase attached AM/PM: "10:00am" vs "10:00 AM"
    hideMinutes?: boolean,   //   Drop ":00" minutes: "10am" vs "10:00am"
    now?: Date,              //   Override current time (for testing)
  }
}
```

**Input shape is determined by `type`:**

| `type` | Required Input |
|--------|---------------|
| `"date"` | `{ date: Date }` |
| `"range"` | `{ start: Date; end: Date }` |

---

## Works With Every Framework

Rangewise is **framework-agnostic by design**. The `formatConfig.ts` file stays the same — only the consumption layer changes. Here's how the same centralized config integrates with popular frameworks:

### React

```tsx
// components/EventCard.tsx
import { format } from "../formatConfig";

export function EventCard({ start, end }: { start: Date; end: Date }) {
  return (
    <div className="event-card">
      <p>{format("invite.dateRange", { start, end })}</p>
    </div>
  );
}
```

### Angular

```ts
// pipes/format-date.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";
import { format } from "../formatConfig";

@Pipe({ name: "rwDate" })
export class FormatDatePipe implements PipeTransform {
  transform(date: Date): string {
    return format("alarm.dateTime", { date });
  }
}
```

```html
<!-- event.component.html -->
<span>{{ eventDate | rwDate }}</span>
```

### Vue

```vue
<!-- EventCard.vue -->
<script setup lang="ts">
import { format } from "../formatConfig";

const props = defineProps<{ start: Date; end: Date }>();
const label = computed(() => format("invite.dateRange", { start: props.start, end: props.end }));
</script>

<template>
  <div class="event-card">
    <p>{{ label }}</p>
  </div>
</template>
```

### Svelte

```svelte
<!-- EventCard.svelte -->
<script lang="ts">
  import { format } from "../formatConfig";

  export let start: Date;
  export let end: Date;

  $: label = format("invite.dateRange", { start, end });
</script>

<div class="event-card">
  <p>{label}</p>
</div>
```

> **The pattern is always the same:** define your formats once in `formatConfig.ts`, import the `format` function, and call it with a key. No framework-specific adapters, no wrappers, no plugins.

---

## Direct API

For one-off formatting or when you don't need a registry, Rangewise also exports the underlying functions directly.

### Importing

```ts
// ESM (recommended)
import { formatRange, formatDate, analyzeRange } from "rangewise";

// CJS
const { formatRange, formatDate, analyzeRange } = require("rangewise");
```

---

### `formatRange(start, end, locale?, options?)`

Formats two `Date` objects into a single human-readable range string.

```ts
import { formatRange } from "rangewise";

const start = new Date("2026-04-16T10:00:00");
const end   = new Date("2026-04-16T12:00:00");

formatRange(start, end);
// → "Today, 10:00–12:00"

formatRange(start, end, "en-US");
// → "Today, 10:00 AM–12:00 PM"

formatRange(start, end, "es-ES");
// → "Hoy, 10:00–12:00"
```

```ts
function formatRange(
  start:   Date,
  end:     Date,
  locale?: string,        // default: "en-IN"
  options?: FormatOptions  // see table below
): string;
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `start` | `Date` | — | Range start (required) |
| `end` | `Date` | — | Range end; must be ≥ `start` or an error is thrown |
| `locale` | `string` | `"en-IN"` | BCP 47 locale tag (e.g. `"en-US"`, `"fr-FR"`, `"de-DE"`) |
| `options` | `FormatOptions` | `{}` | Formatting overrides (see below) |

> **Throws** `Error` if `end` is before `start`.

---

### `formatDate(date, locale?, options?)`

Formats a single `Date` into a human-readable string with a contextual label.

```ts
import { formatDate } from "rangewise";

formatDate(new Date("2026-04-16T10:00:00"));
// → "Today, 10:00"

formatDate(new Date("2026-04-17T10:00:00"));
// → "Tomorrow, 10:00"
```

```ts
function formatDate(
  date:    Date,
  locale?: string,
  options?: FormatOptions
): string;
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `date` | `Date` | — | The date to format (required) |
| `locale` | `string` | `"en-IN"` | BCP 47 locale tag |
| `options` | `FormatOptions` | `{}` | Formatting overrides |

---

### `analyzeRange(start, end)`

Returns a `RangeAnalysis` object describing the relationship between two dates. Useful if you need to branch on context in your own code.

```ts
function analyzeRange(start: Date, end: Date): RangeAnalysis;
```

**Return type:**

```ts
interface RangeAnalysis {
  context:    RangeContext;  // the most specific match
  sameMinute: boolean;
  sameHour:   boolean;
  sameDay:    boolean;
  sameMonth:  boolean;
  sameYear:   boolean;
}

type RangeContext =
  | "same-minute"
  | "same-hour"
  | "same-day"
  | "same-week"
  | "same-month"
  | "same-year"
  | "cross-year";
```

**Example:**

```ts
import { analyzeRange } from "rangewise";

const result = analyzeRange(
  new Date("2026-04-16T10:00:00"),
  new Date("2026-04-16T12:00:00")
);
// → { context: "same-day", sameMinute: false, sameHour: false,
//     sameDay: true, sameMonth: true, sameYear: true }
```

---

### `FormatOptions`

All options are optional. Pass them as the last argument to `formatRange` or `formatDate`, or inside a registry config's `options` field.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `spaced` | `boolean` | `false` | Use a spaced en-dash separator (` – `) instead of the default tight dash (`–`) |
| `hour12` | `boolean` | *auto* | Force 12-hour or 24-hour format. When omitted, auto-detected from the locale (`en-US` → 12h, `fr-FR` → 24h) |
| `compactAmPm` | `boolean` | `false` | Render AM/PM as lowercase and attached (`10:00am` instead of `10:00 AM`). Only applies when `hour12` is active |
| `hideMinutes` | `boolean` | `false` | Drop the minutes portion when they are exactly `:00` (`10` instead of `10:00`) |
| `now` | `Date` | `new Date()` | Override the current time. Used for deterministic testing and for computing relative labels (Today, Tomorrow, Yesterday) |

---

## Formatting Behaviour

### Date Range Formatting (`formatRange`)

The table below shows how different date ranges are formatted. All examples assume `now` is `2026-04-16 09:00`.

| Context | Start → End | `en-IN` (24h) | `en-US` (12h) |
|---------|-------------|---------------|---------------|
| **Same minute** | `Apr 16 10:00` → `Apr 16 10:00` | `Today, 10:00` | `Today, 10:00 AM` |
| **Same day** | `Apr 16 10:00` → `Apr 16 12:00` | `Today, 10:00–12:00` | `Today, 10:00 AM–12:00 PM` |
| **Same day (AM only)** | `Apr 16 10:00` → `Apr 16 11:00` | `Today, 10:00–11:00` | `Today, 10:00–11:00 AM` |
| **Same day (PM only)** | `Apr 16 13:00` → `Apr 16 15:00` | `Today, 13:00–15:00` | `Today, 01:00–03:00 PM` |
| **AM → PM** | `Apr 16 08:00` → `Apr 16 14:00` | `Today, 08:00–14:00` | `Today, 08:00 AM–02:00 PM` |
| **Tomorrow** | `Apr 17 10:00` → `Apr 17 12:00` | `Tomorrow, 10:00–12:00` | `Tomorrow, 10:00 AM–12:00 PM` |
| **Yesterday** | `Apr 15 10:00` → `Apr 15 12:00` | `Yesterday, 10:00–12:00` | `Yesterday, 10:00 AM–12:00 PM` |
| **Same month** | `Apr 10` → `Apr 15` | `10–15 Apr 2026` | `10–15 Apr 2026` |
| **Same year** | `Apr 15` → `Jun 20` | `15 Apr–20 Jun 2026` | `15 Apr–20 Jun 2026` |
| **Cross year** | `Dec 31 2026` → `Jan 2 2027` | `31 Dec 2026–2 Jan 2027` | `31 Dec 2026–2 Jan 2027` |

> **Note:** When both times fall in the same period (both AM or both PM), the redundant AM/PM marker on the start time is automatically collapsed. This applies to `en-US` and other 12-hour locales.

---

### Single Date Formatting (`formatDate`)

| Context | Input | `en-IN` (24h) | `en-US` (12h) |
|---------|-------|---------------|---------------|
| **Today** | `Apr 16 10:00` | `Today, 10:00` | `Today, 10:00 AM` |
| **Tomorrow** | `Apr 17 10:00` | `Tomorrow, 10:00` | `Tomorrow, 10:00 AM` |
| **Yesterday** | `Apr 15 10:00` | `Yesterday, 10:00` | `Yesterday, 10:00 AM` |
| **Same week** | `Apr 14 10:00` (Tue) | `Tue, 10:00` | `Tue, 10:00 AM` |
| **Older / far future** | `Mar 10 2026 10:00` | `10 Mar 2026, 10:00` | `10 Mar 2026, 10:00 AM` |

---

### Option Effects

All examples use `en-US`, today at `10:00–12:00`.

| Options | `formatRange` Output | `formatDate` Output (10:00) |
|---------|---------------------|------------------------------|
| *(defaults)* | `Today, 10:00 AM–12:00 PM` | `Today, 10:00 AM` |
| `compactAmPm: true` | `Today, 10:00am–12:00pm` | `Today, 10:00am` |
| `hideMinutes: true` | `Today, 10–12 PM` | `Today, 10 AM` |
| `compactAmPm + hideMinutes` | `Today, 10am–12pm` | `Today, 10am` |
| `hour12: false` | `Today, 10:00–12:00` | `Today, 10:00` |
| `spaced: true` | `Today, 10:00 AM – 12:00 PM` | *(no effect on single date)* |

---

### Locale Labels

Rangewise includes built-in relative-date labels for the following languages:

| Locale | Today | Tomorrow | Yesterday | Time Format |
|--------|-------|----------|-----------|-------------|
| `en` / `en-IN` | Today | Tomorrow | Yesterday | 24-hour |
| `en-US` / `en-CA` / `en-PH` | Today | Tomorrow | Yesterday | 12-hour |
| `es` / `es-ES` | Hoy | Mañana | Ayer | 24-hour |
| `fr` / `fr-FR` | Aujourd'hui | Demain | Hier | 24-hour |
| `de` / `de-DE` | Heute | Morgen | Gestern | 24-hour |

> Weekday names and month names are provided by the built-in `Intl.DateTimeFormat` API and work for any locale your runtime supports.

---

### Week Start

The definition of "same week" depends on locale. Rangewise respects this:

| Locale | Week starts on |
|--------|----------------|
| `en` / `en-US` | Sunday |
| `es` / `fr` / `de` | Monday |

---

## Running the Demo

The project includes an interactive demo that showcases the Named Format Registry pattern with a Flatpickr-based calendar UI.

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite dev server
npm run demo
```

This opens a local development server (typically at `http://localhost:5173`) with two calendar controls:

1. **Single Date/Time** — pick a date and time, see `format("demo.singleDate", ...)` in action
2. **Date/Time Range** — pick a start and end, see `format("demo.dateRange", ...)` in action

The demo uses a centralized `formatConfig.ts` that defines the registry — exactly as you would in a real application.

---

## Running Tests

The test suite lives in `test.ts` at the project root. It uses a fixed `now` value (`2026-04-16T09:00:00`) so results are deterministic and independent of system time.

```bash
# Run the full test suite
npx tsx test.ts
```

**What the tests cover:**

- Same-day ranges (24h and 12h locales)
- Locale-specific labels (Spanish, French, German)
- Tomorrow / Yesterday relative labels
- Same-month, same-year, and cross-year ranges
- AM/PM collapsing (same-period and cross-period)
- Compact AM/PM mode
- Force 24h override on 12h locale
- Invalid range error handling (end < start)
- Single date formatting (`formatDate`) for all contexts
- Option combinations (`compactAmPm`, `hideMinutes`)
- **Named Format Registry** — string keys, direct config objects

You can also verify the build output works correctly:

```bash
# Build the library
npm run build

# Run the build smoke test
npx tsx test-build.ts
```

---

## Design Philosophy

Rangewise is built around **UX-first formatting**, not just correctness.

| Principle | In practice |
|-----------|-------------|
| **Reduce cognitive load** | Use "Today" instead of a full date when it's obvious |
| **Avoid redundancy** | Collapse shared AM/PM markers; don't repeat the month when it's the same |
| **Adapt to context** | Show more detail for far-apart dates; less for nearby ones |
| **Respect user locale** | Auto-detect 12h/24h; use localised labels and date ordering |
| **Keep output scannable** | Produce compact strings that work in tight UI spaces |
| **Centralise formatting** | Named Format Registry gives your app a single source of truth for date display |

---

## Roadmap

- [ ] Minute precision controls
- [ ] Timezone support
- [ ] Custom label injection
- [ ] Full i18n expansion
- [ ] Range summarisation (e.g., "3h")

---

## Contributing

Contributions are welcome! Here are some areas where you can help:

- **Improve locale support** — add labels for more languages
- **Add formatting rules** — handle edge cases or new contexts
- **Enhance performance** — optimise for high-frequency calls
- **Suggest UX improvements** — propose better defaults or new options

---

## License

[MIT](./LICENSE) © swamitrasingh