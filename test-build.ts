import { formatRangeUX } from "./dist/index.js";

console.log(
  formatRangeUX(
    new Date("2026-04-16T10:00:00"),
    new Date("2026-04-16T12:00:00")
  )
);