import { analyzeRange } from "./analyzeRange";

type FormatOptions = {
  spaced?: boolean;
  hour12?: boolean;
  compactAmPm?: boolean;
  hideMinutes?: boolean; // ✅ NEW
  now?: Date;
};

// -----------------------------
// 🌍 LABELS
// -----------------------------

const LABELS = {
  en: { today: "Today", tomorrow: "Tomorrow", yesterday: "Yesterday" },
  es: { today: "Hoy", tomorrow: "Mañana", yesterday: "Ayer" },
  fr: { today: "Aujourd’hui", tomorrow: "Demain", yesterday: "Hier" },
  de: { today: "Heute", tomorrow: "Morgen", yesterday: "Gestern" },
};

// -----------------------------
// 🗓️ WEEK START
// -----------------------------

const WEEK_START: Record<string, 0 | 1> = {
  en: 0,
  "en-US": 0,
  es: 1,
  fr: 1,
  de: 1,
};

function getWeekStart(locale: string): number {
  const lang = locale.split("-")[0] || "en";
  return WEEK_START[locale] ?? WEEK_START[lang] ?? 0;
}

function startOfWeek(date: Date, locale: string): Date {
  const d = new Date(date);
  const weekStart = getWeekStart(locale);

  const day = d.getDay();
  const diff = (day - weekStart + 7) % 7;

  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);

  return d;
}

function isSameWeek(a: Date, b: Date, locale: string): boolean {
  return (
    startOfWeek(a, locale).getTime() ===
    startOfWeek(b, locale).getTime()
  );
}

// -----------------------------
// 📅 DATE HELPERS (NOW-AWARE)
// -----------------------------

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date, now: Date): boolean {
  return isSameDay(date, now);
}

function isYesterday(date: Date, now: Date): boolean {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return isSameDay(date, d);
}

function isTomorrow(date: Date, now: Date): boolean {
  const d = new Date(now);
  d.setDate(d.getDate() + 1);
  return isSameDay(date, d);
}

// -----------------------------
// 🌐 LOCALE HELPERS
// -----------------------------

function getLanguage(locale: string): keyof typeof LABELS {
  const lang = locale.split("-")[0] as keyof typeof LABELS;
  return LABELS[lang] ? lang : "en";
}

// -----------------------------
// 🕐 AUTO TIME FORMAT
// -----------------------------

function getHour12(locale: string): boolean {
  const normalized = locale.toLowerCase();

  if (
    normalized.startsWith("en-us") ||
    normalized.startsWith("en-ca") ||
    normalized.startsWith("en-ph")
  ) {
    return true;
  }

  return false;
}

// -----------------------------
// 🧩 FORMAT HELPERS
// -----------------------------

function formatDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatTime(
  date: Date,
  locale: string,
  hour12: boolean,
  compactAmPm?: boolean,
  hideMinutes?: boolean
): string {
  const minutes = date.getMinutes();

  let options: Intl.DateTimeFormatOptions;

  // ✅ Hide minutes only when :00
  if (hideMinutes && minutes === 0) {
    options = {
      hour: "numeric", // no leading zero
      hour12,
    };
  } else {
    options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12,
    };
  }

  let formatted = new Intl.DateTimeFormat(locale, options).format(date);

  // ✅ Compact AM/PM
  if (hour12 && compactAmPm) {
    formatted = formatted
      .replace(/\s?AM/i, "am")
      .replace(/\s?PM/i, "pm");
  }

  return formatted;
}

function getAmPm(date: Date): "am" | "pm" {
  return date.getHours() < 12 ? "am" : "pm";
}

function formatWeekday(date: Date, locale: string): string {
  return formatDate(date, locale, { weekday: "short" });
}

function getLabel(date: Date, locale: string, now: Date): string | null {
  const lang = getLanguage(locale);
  const labels = LABELS[lang];

  if (isToday(date, now)) return labels.today;
  if (isTomorrow(date, now)) return labels.tomorrow;
  if (isYesterday(date, now)) return labels.yesterday;

  if (isSameWeek(date, now, locale)) {
    return formatWeekday(date, locale);
  }

  return null;
}

// -----------------------------
// 🚀 MAIN FUNCTION
// -----------------------------

export function formatRangeUX(
  start: Date,
  end: Date,
  locale = "en-IN",
  options: FormatOptions = {}
): string {
  const { spaced = false, hour12, compactAmPm, now = new Date() } = options;

  const separator = spaced ? " – " : "–";
  const analysis = analyzeRange(start, end);

  const finalHour12 = hour12 ?? getHour12(locale);

  const fullDate = (d: Date) =>
    formatDate(d, locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const dayMonth = (d: Date) =>
    formatDate(d, locale, {
      day: "numeric",
      month: "short",
    });

  const dayOnly = (d: Date) =>
    formatDate(d, locale, { day: "numeric" });

  const label = getLabel(start, locale, now);

  // -----------------------------
  // SAME MINUTE
  // -----------------------------

  if (analysis.sameMinute) {
    return label
      ? `${label}, ${formatTime(start, locale, finalHour12, compactAmPm, options.hideMinutes)}`
      : `${fullDate(start)}, ${formatTime(start, locale, finalHour12, compactAmPm, options.hideMinutes)}`;
  }

  // -----------------------------
  // SAME DAY / HOUR
  // -----------------------------

  if (analysis.sameHour || analysis.sameDay) {
    const startTime = formatTime(start, locale, finalHour12, compactAmPm, options.hideMinutes);
    const endTime = formatTime(end, locale, finalHour12, compactAmPm, options.hideMinutes);

    let timeRange = `${startTime}${separator}${endTime}`;

    // ✅ AM/PM collapse
   if (finalHour12) {
  const startAmPm = getAmPm(start);
  const endAmPm = getAmPm(end);

  if (startAmPm === endAmPm) {
    const cleanedStart = startTime
      .replace(/\s?(AM|PM)/i, "")
      .replace(/\s?(am|pm)/i, "")
      .trim();

    timeRange = `${cleanedStart}${separator}${endTime}`;
  }
}

    return label
      ? `${label}, ${timeRange}`
      : `${fullDate(start)}, ${timeRange}`;
  }

  // -----------------------------
  // SAME MONTH
  // -----------------------------

  if (analysis.sameMonth) {
    return `${dayOnly(start)}${separator}${dayOnly(end)} ${formatDate(end, locale, {
      month: "short",
      year: "numeric",
    })}`;
  }

  // -----------------------------
  // SAME YEAR
  // -----------------------------

  if (analysis.sameYear) {
    return `${dayMonth(start)}${separator}${formatDate(end, locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  // -----------------------------
  // CROSS YEAR
  // -----------------------------

  return `${fullDate(start)}${separator}${fullDate(end)}`;
}