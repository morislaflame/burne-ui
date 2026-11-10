import type { HTMLAttributes, ReactNode } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type HeaderClassNames = {
  root?: string;
};

export type HeaderPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type HeaderMotion = {
  root?: HeaderPartMotion;
};

export type HeaderProps = HTMLAttributes<HTMLElement> & {
  /** Stick to the top of the scrollport. Default `false`. */
  sticky?: boolean;
  classNames?: Prettify<HeaderClassNames>;
  motion?: Prettify<MotionMapWithEvents<HeaderMotion>>;
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;
