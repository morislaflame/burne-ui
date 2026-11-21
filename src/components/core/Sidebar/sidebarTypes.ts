import type { HTMLAttributes, ReactNode } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";
import type { PageWidth } from "@/components/core/utils/layoutSpace";

/** Domain: `--max-page-*` width, not `ComponentSize` and not `--max-component-*`. */
export type SidebarWidth = PageWidth;

/** Which edge the column sits on. `start` paints `border-e-token`. */
export type SidebarSide = "start" | "end";

export type SidebarClassNames = {
  root?: string;
};

export type SidebarPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type SidebarMotion = {
  root?: SidebarPartMotion;
};

export type SidebarProps = HTMLAttributes<HTMLElement> & {
  width?: SidebarWidth;
  /** Edge border. `start` paints `border-e-token`. Default `start`. */
  side?: SidebarSide;
  classNames?: Prettify<SidebarClassNames>;
  motion?: Prettify<MotionMapWithEvents<SidebarMotion>>;
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;
