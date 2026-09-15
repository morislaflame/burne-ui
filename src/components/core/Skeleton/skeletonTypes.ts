import type { CSSProperties, HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

export type SkeletonAnimation = "pulse" | "wave" | "shimmer" | "none";

export type SkeletonRadius = "none" | "small" | "mid" | "full";

export type SkeletonClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonCircleClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonTextClassNames = {
  root?: string;
  line?: string;
  wave?: string;
};

export type SkeletonBlockClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonRegionClassNames = {
  root?: string;
};

export type SkeletonPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type SkeletonMotion = {
  root?: SkeletonPartMotion;
  region?: SkeletonPartMotion;
};

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  radius?: SkeletonRadius;
  classNames?: Prettify<SkeletonClassNames>;
  /**
   * Per-slot motion (`root`). Wave overlay is CSS, not a motion slot.
   * Defaults are empty — `enter` runs on mount only when set.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<SkeletonMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * Attaches to this part's nested scope (`root`). Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type UseSkeletonRootStateProps = Pick<SkeletonProps, "animation" | "radius">;

export type SkeletonCircleProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  size?: string;
  classNames?: Prettify<SkeletonCircleClassNames>;
  motion?: Prettify<MotionMapWithEvents<SkeletonMotion>>;
  /**
   * Handle for this Circle nested scope (`root`). One handle → one part.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  lines?: number;
  lastShort?: boolean;
  classNames?: Prettify<SkeletonTextClassNames>;
  motion?: Prettify<MotionMapWithEvents<SkeletonMotion>>;
  /**
   * Handle for this Text nested scope (`root`). One handle → one part.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type SkeletonBlockProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  classNames?: Prettify<SkeletonBlockClassNames>;
  motion?: Prettify<MotionMapWithEvents<SkeletonMotion>>;
  /**
   * Handle for this Block nested scope (`root`). One handle → one part.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

/** Semantic parent for loading placeholders — sets `aria-busy` / `aria-live`. */
export type SkeletonRegionProps = HTMLAttributes<HTMLDivElement> & {
  /** When true, region is loading (`aria-busy`). Default `true`. */
  busy?: boolean;
  classNames?: Prettify<SkeletonRegionClassNames>;
  motion?: Prettify<MotionMapWithEvents<SkeletonMotion>>;
  /**
   * Handle for this Region nested scope (`region`). Children (Circle/Text/Block)
   * keep their own scopes — one handle ≠ those bones.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type SkeletonWaveProps = {
  className?: string;
  style?: CSSProperties;
};
