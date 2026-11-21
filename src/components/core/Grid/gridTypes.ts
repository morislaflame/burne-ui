import type { HTMLAttributes } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { LayoutAlign, LayoutMeasure, LayoutSpace } from "@/components/core/utils/layoutSpace";

/** Fixed tracks, or `auto` (`auto-fit` + `minmax` on `--max-component-*`). */
export const GRID_COLUMN_COUNTS = [1, 2, 3, 4, 6, 12] as const;

export type GridColumnCount = (typeof GRID_COLUMN_COUNTS)[number];

/** Domain: column count is structure, not `variant` and not `ComponentSize`. */
export type GridColumns = GridColumnCount | "auto";

/** Domain: space scale, not `ComponentSize`. */
export type GridGap = LayoutSpace;

/** Domain: `--max-component-*` minimum track when `columns="auto"`. */
export type GridMinTrack = LayoutMeasure;

export type GridAlign = LayoutAlign;

export type GridClassNames = {
  root?: string;
};

export type GridPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type GridMotion = {
  root?: GridPartMotion;
};

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: GridColumns;
  /** Used when `columns="auto"`. Ignored for a fixed count. */
  minTrack?: GridMinTrack;
  gap?: GridGap;
  align?: GridAlign;
  classNames?: Prettify<GridClassNames>;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<GridMotion>>;
  motionController?: MotionController;
} & MotionStateHostProps;
