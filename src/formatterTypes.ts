import type { FormatOptions } from "./formatRange";

// -----------------------------
// 📦 CONFIG OPTION TYPES
// -----------------------------

/**
 * Options for single-date formatting.
 * Currently identical to FormatOptions; aliased separately
 * so date and range options can diverge in the future.
 */
export type FormatDateOptions = FormatOptions;

/**
 * Options for range formatting.
 */
export type FormatRangeOptions = FormatOptions;

// -----------------------------
// 📋 FORMAT CONFIG
// -----------------------------

/**
 * A declarative formatting configuration.
 * Discriminated by `type`:
 *   - `'date'`  → formats a single date via `formatDate`
 *   - `'range'` → formats a date range via `formatRange`
 */
export type DateFormatConfig =
  | {
      readonly type: "date";
      readonly locale?: string;
      readonly options?: FormatDateOptions;
    }
  | {
      readonly type: "range";
      readonly locale?: string;
      readonly options?: FormatRangeOptions;
    };

// -----------------------------
// 🗂️ REGISTRY TYPE
// -----------------------------

/**
 * A nested record whose leaf nodes are `DateFormatConfig`.
 * Supports arbitrary grouping depth (e.g. `invite.dateRange`).
 */
export type FormatRegistry = {
  readonly [key: string]: DateFormatConfig | FormatRegistry;
};

// -----------------------------
// 🔤 DOT-PATH INFERENCE
// -----------------------------

/**
 * Recursively walks `T` and produces a union of dot-separated
 * string literal paths to every leaf node that has a `type` property.
 *
 * Example:
 * ```ts
 * type R = { invite: { dateRange: { type: 'range' } } }
 * type Keys = DotPaths<R>  // "invite.dateRange"
 * ```
 */
export type DotPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends { readonly type: string }
    ? `${Prefix}${K}`
    : T[K] extends object
      ? DotPaths<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

/**
 * Convenience alias — extracts all valid dot-path keys from a registry.
 */
export type FormatKeys<T> = DotPaths<T>;

// -----------------------------
// 🔍 PATH RESOLUTION (type-level)
// -----------------------------

/**
 * Given a nested type `T` and a dot-separated path `P`,
 * resolves to the type of the leaf node.
 *
 * Example:
 * ```ts
 * type R = { invite: { dateRange: { type: 'range' } } }
 * type Cfg = Get<R, "invite.dateRange">  // { type: 'range' }
 * ```
 */
export type Get<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Get<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// -----------------------------
// 🎯 INPUT MAPPING
// -----------------------------

/**
 * Maps a `DateFormatConfig` to the required input shape:
 *   - `{ type: 'date' }`  → `{ date: Date }`
 *   - `{ type: 'range' }` → `{ start: Date; end: Date }`
 */
export type InputForConfig<C> = C extends { readonly type: "date" }
  ? { date: Date }
  : C extends { readonly type: "range" }
    ? { start: Date; end: Date }
    : never;
