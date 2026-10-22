import type { HTMLAttributes, ReactNode } from "react";

import type { Prettify } from "@/utils/prettify";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

export type ResizableOrientation = "horizontal" | "vertical";

export type ResizableClassNames = {
  root?: string;
  panel?: string;
  handle?: string;
};

export type ResizablePartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ResizableMotion = {
  root?: ResizablePartMotion;
  panel?: ResizablePartMotion;
  handle?: ResizablePartMotion;
};

export type ResizableProps = HTMLAttributes<HTMLDivElement> & {
  /** Domain: the split axis, not `variant`. */
  orientation?: ResizableOrientation;
  classNames?: Prettify<ResizableClassNames>;
  motion?: Prettify<MotionMapWithEvents<ResizableMotion>>;
  motionController?: MotionController;
  children?: ReactNode;
} & MotionStateHostProps;

export type ResizablePanelProps = HTMLAttributes<HTMLDivElement> & {
  /** Starting share in percent. Omitted panels share the leftover space until a drag. */
  defaultSize?: number;
  /** Smallest share in percent. Default `8`. */
  minSize?: number;
  motion?: Prettify<ResizablePartMotion>;
};

export type ResizableHandleProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ResizablePartMotion>;
};

export type ResizableLayoutValue = {
  orientation: ResizableOrientation;
  sizes: Readonly<Record<string, number>>;
  panelClass?: string;
  handleClass?: string;
  commit: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
  rememberMin: (id: string, min: number) => void;
  forget: (id: string) => void;
  minOf: (id: string) => number;
};
