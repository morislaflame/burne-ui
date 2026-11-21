import type { HTMLAttributes, ReactNode } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type AppShellClassNames = {
  root?: string;
  /** Row under the header: sidebar and main. */
  body?: string;
  main?: string;
};

export type AppShellPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type AppShellMotion = {
  root?: AppShellPartMotion;
  body?: AppShellPartMotion;
  main?: AppShellPartMotion;
};

export type AppShellProps = HTMLAttributes<HTMLDivElement> & {
  classNames?: Prettify<AppShellClassNames>;
  motion?: Prettify<MotionMapWithEvents<AppShellMotion>>;
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;
