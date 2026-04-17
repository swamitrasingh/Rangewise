import { formatDate, formatRange } from "./formatRange";
import type {
  DateFormatConfig,
  FormatRegistry,
  DotPaths,
  Get,
  InputForConfig,
} from "./formatterTypes";

// -----------------------------
// 🔍 RUNTIME DOT-PATH RESOLVER
// -----------------------------

/**
 * Resolves a dot-separated path against a nested object.
 *
 * @example
 * ```ts
 * getConfigByPath({ invite: { dateRange: cfg } }, "invite.dateRange")
 * // → cfg
 * ```
 *
 * @returns The resolved value, or `undefined` if the path is invalid.
 */
export function getConfigByPath(
  obj: Record<string, unknown>,
  path: string
): unknown {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current;
}

// -----------------------------
// ✅ VALIDATION HELPERS
// -----------------------------

function isDateFormatConfig(value: unknown): value is DateFormatConfig {
  if (value === null || value === undefined || typeof value !== "object") {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return obj["type"] === "date" || obj["type"] === "range";
}

// -----------------------------
// 🏭 CREATE FORMATTER
// -----------------------------

/**
 * Creates a type-safe `format()` function bound to the given registry.
 *
 * @example
 * ```ts
 * const formats = {
 *   invite: {
 *     dateRange: { type: 'range', options: { compactAmPm: true } },
 *   },
 * } as const;
 *
 * const format = createFormatter(formats);
 *
 * // String key with autocomplete
 * format('invite.dateRange', { start, end });
 *
 * // Direct config reference
 * format(formats.invite.dateRange, { start, end });
 * ```
 */
export function createFormatter<T extends FormatRegistry>(registry: T) {
  /**
   * Format a date or range using a registered format key or a direct config.
   *
   * @param keyOrConfig - A dot-path string key (e.g. `"invite.dateRange"`)
   *                      or a direct `DateFormatConfig` object.
   * @param input       - The input data matching the config's type:
   *                      `{ date: Date }` for `type: 'date'`,
   *                      `{ start: Date; end: Date }` for `type: 'range'`.
   * @returns The formatted string.
   */
  function format<K extends DotPaths<T>>(
    key: K,
    input: InputForConfig<Get<T, K>>
  ): string;
  function format(
    config: DateFormatConfig,
    input: InputForConfig<DateFormatConfig>
  ): string;
  function format(
    keyOrConfig: string | DateFormatConfig,
    input: Record<string, unknown>
  ): string {
    let config: DateFormatConfig;

    // ─── Resolve config ───────────────────────────
    if (typeof keyOrConfig === "string") {
      const resolved = getConfigByPath(
        registry as unknown as Record<string, unknown>,
        keyOrConfig
      );

      if (!isDateFormatConfig(resolved)) {
        throw new Error(
          `[rangewise] Format key "${keyOrConfig}" not found or is not a valid config.`
        );
      }

      config = resolved;
    } else if (isDateFormatConfig(keyOrConfig)) {
      config = keyOrConfig;
    } else {
      throw new Error(
        "[rangewise] First argument must be a format key string or a DateFormatConfig object."
      );
    }

    // ─── Execute ──────────────────────────────────
    const locale = config.locale ?? "en-IN";
    const options = config.options ?? {};

    if (config.type === "date") {
      const date = input["date"];

      if (!(date instanceof Date)) {
        throw new Error(
          '[rangewise] Missing or invalid "date" field. Expected a Date instance.'
        );
      }

      return formatDate(date, locale, options);
    }

    if (config.type === "range") {
      const start = input["start"];
      const end = input["end"];

      if (!(start instanceof Date) || !(end instanceof Date)) {
        throw new Error(
          '[rangewise] Missing or invalid "start"/"end" fields. Expected Date instances.'
        );
      }

      return formatRange(start, end, locale, options);
    }

    // Should be unreachable due to isDateFormatConfig guard
    throw new Error(
      `[rangewise] Invalid config type: "${(config as Record<string, unknown>)["type"]}". Expected "date" or "range".`
    );
  }

  return format;
}
