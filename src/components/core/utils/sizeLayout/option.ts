import type { TextVariant } from "@/components/core/Text";

import type { ComponentSize } from "./componentSize";

/**
 * Shared size presets for option-style controls (Checkbox, Radio, Switch)
 * and menu rows (ListBox, Dropdown): title/desc typography + grid gaps.
 */
export type OptionControlSizeLayout = {
  title: TextVariant;
  desc: TextVariant;
  /** Root grid: control/indicator ↔ label (+ hint/error rows). */
  gridGap: string;
  /** ListBox / Dropdown item row: indicator ↔ label (gap-x only). */
  listItemGapX: string;
};

export const OPTION_CONTROL_SIZE_LAYOUT: Record<
  ComponentSize,
  OptionControlSizeLayout
> = {
  small: {
    title: "small",
    desc: "xsmall",
    gridGap: "gap-x-small gap-y-xsmall",
    listItemGapX: "gap-x-small",
  },
  base: {
    title: "base",
    desc: "small",
    gridGap: "gap-x-base gap-y-xsmall",
    listItemGapX: "gap-x-base",
  },
  mid: {
    title: "mid",
    desc: "small",
    gridGap: "gap-x-base gap-y-xsmall",
    listItemGapX: "gap-x-base",
  },
  large: {
    title: "large",
    desc: "base",
    gridGap: "gap-x-mid gap-y-xsmall",
    listItemGapX: "gap-x-mid",
  },
};
