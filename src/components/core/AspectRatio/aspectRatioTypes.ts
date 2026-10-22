import type { HTMLAttributes, ReactNode } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

/** CSS `aspect-ratio`. A number is width/height. `"16/9"` is the same pair. */
export type AspectRatioValue = number | `${number}/${number}`;

export type AspectRatioClassNames = {
  root?: string;
  /** Fill layer inside the ratio box. */
  content?: string;
};

export type AspectRatioPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type AspectRatioMotion = {
  root?: AspectRatioPartMotion;
  content?: AspectRatioPartMotion;
};

export type AspectRatioProps = HTMLAttributes<HTMLDivElement> & {
  /** Domain: the box ratio, not `variant` and not `ComponentSize`. Default `1`. */
  ratio?: AspectRatioValue;
  classNames?: Prettify<AspectRatioClassNames>;
  motion?: Prettify<MotionMapWithEvents<AspectRatioMotion>>;
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;
