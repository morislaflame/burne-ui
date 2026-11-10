/**
 * Space scale for layout primitives (`gap`, container padding).
 * Domain scale: not `ComponentSize` (`small | base | mid | large`).
 * Steps match `--space-*` / `gap-*` / `p-*` / `px-*`.
 */
export const LAYOUT_SPACE_STEPS = [
  "xsmall",
  "small",
  "base",
  "mid",
  "large",
  "xlarge",
  "2xlarge",
  "3xlarge",
] as const;

export type LayoutSpace = (typeof LAYOUT_SPACE_STEPS)[number];

/** Width steps for `max-w-component-*` and auto-fit grid tracks. */
export const LAYOUT_MEASURE_STEPS = [
  "xsmall",
  "small",
  "base",
  "mid",
  "large",
  "xlarge",
  "2xlarge",
] as const;

export type LayoutMeasure = (typeof LAYOUT_MEASURE_STEPS)[number];

/** Same step names as `LayoutMeasure`, bound to `--max-page-*` (page column / sidebar). */
export type PageWidth = LayoutMeasure;

export const LAYOUT_ALIGN = ["start", "center", "end", "stretch", "baseline"] as const;

export type LayoutAlign = (typeof LAYOUT_ALIGN)[number];

export const LAYOUT_JUSTIFY = ["start", "center", "end", "between"] as const;

export type LayoutJustify = (typeof LAYOUT_JUSTIFY)[number];
