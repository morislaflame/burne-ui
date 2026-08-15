import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { ComponentSize } from "@/components/core/utils/sizeLayout";

export type LoadingSize = ComponentSize;

export type LoadingType = "spinner" | "dots";

export type LoadingColor =
  | "primary"
  | "foreground"
  | "muted"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type LoadingClassNames = {
  root?: string;
  spinner?: string;
  dots?: string;
  dot?: string;
};

export type LoadingPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type LoadingMotion = {
  root?: LoadingPartMotion;
  spinner?: LoadingPartMotion;
  dots?: LoadingPartMotion;
};

export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  type?: LoadingType;
  size?: LoadingSize;
  color?: LoadingColor;
  label?: string;
  classNames?: Prettify<LoadingClassNames>;
  /**
   * Per-slot motion (`root`, `spinner`, `dots`). Dot wave stays kit-internal.
   * Defaults are empty — `enter` runs on mount only when set.
   */
  motion?: Prettify<LoadingMotion>;
};

export type LoadingDotsLayout = {
  dotClass: string;
  dotSizeVar: string;
  gapClass: string;
  jumpPx: number;
  scalePeak: number;
};
