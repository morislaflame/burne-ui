import type { HTMLAttributes } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { LayoutSpace, PageWidth } from "@/components/core/utils/layoutSpace";

/** Domain: `--max-page-*`, not `ComponentSize` and not `--max-component-*`. */
export type ContainerMaxWidth = PageWidth;

/** Domain: horizontal padding on the space scale, not `ComponentSize`. */
export type ContainerPadding = LayoutSpace;

export type ContainerClassNames = {
  root?: string;
};

export type ContainerPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ContainerMotion = {
  root?: ContainerPartMotion;
};

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  maxWidth?: ContainerMaxWidth;
  padding?: ContainerPadding;
  classNames?: Prettify<ContainerClassNames>;
  /**
   * Per-slot motion (`root`). Defaults are empty — custom factories are opt-in.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<ContainerMotion>>;
  motionController?: MotionController;
} & MotionStateHostProps;
