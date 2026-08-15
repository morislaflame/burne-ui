import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { ShadowSize } from "@/tokens/shadows";

export type SurfaceVariant = "default" | "secondary" | "tertiary" | "gloss";

export type SurfaceShadow = ShadowSize;

export type SurfacePadding = "none" | "small" | "base" | "mid" | "large";

export type SurfaceRadius = "base" | "mid" | "large";

export type SurfaceClassNames = {
  root?: string;
  glossContent?: string;
};

export type SurfacePartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type SurfaceMotion = {
  root?: SurfacePartMotion;
};

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  shadow?: SurfaceShadow;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  classNames?: Prettify<SurfaceClassNames>;
  /**
   * Per-slot motion (`root`). `glossContent` is a layout wrapper, not a motion slot.
   * Defaults are empty — custom factories are opt-in.
   */
  motion?: Prettify<SurfaceMotion>;
};
