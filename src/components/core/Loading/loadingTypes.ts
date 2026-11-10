import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
 
export type LoadingSize = ComponentSize;
 
export type LoadingIndicator = "spinner" | "dots";
 
/** Token paint. Semantic roles use `status`. Any other string is a CSS color. */
export type LoadingColor = "primary" | "foreground" | "muted" | "secondary";
 
export type { SemanticStatus };
 
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
  /** Wave. `enter` is the loop; the host replays it when config or reduced motion changes. */
  dot?: LoadingPartMotion;
};
 
export type LoadingProps = HTMLAttributes<HTMLSpanElement> & {
  indicator?: LoadingIndicator;
  size?: LoadingSize;
  /** Token name (`primary`, `foreground`, `muted`, `secondary`) or a CSS color. */
  color?: string;
  status?: SemanticStatus;
  classNames?: Prettify<LoadingClassNames>;
  /**
   * Per-slot motion (`root`, `spinner`, `dots`, `dot`). `dot.enter` is the wave (`loadingDots`).
   * Defaults are empty — `enter` runs on mount only when set.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<LoadingMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Forwarded to the motion Provider (`controller`), not onto the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type LoadingDotsLayout = {
  dotClass: string;
  dotSizeVar: string;
  gapClass: string;
  jumpPx: number;
  scalePeak: number;
};
 