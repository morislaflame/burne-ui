import type { HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

import type {
  MotionController,
  MotionMapWithEvents,
  MotionStateHostProps,
  MotionValue,
} from "@/components/core/utils/slotMotion";

/** When the bar is painted. `hover` — pointer or focus. `scroll` — while scrolling. `always` — whenever content overflows. */
export type ScrollAreaVisibility = "hover" | "scroll" | "always";

/** Which bars the simple API mounts. Compound mounts the bars you write. */
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export type ScrollAxis = "vertical" | "horizontal";

export type ScrollAreaClassNames = {
  root?: string;
  viewport?: string;
  scrollbar?: string;
  thumb?: string;
  corner?: string;
};

export type ScrollAreaPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

/**
 * DOM slots: `root`, `viewport`, `scrollbar` (one per axis), `thumb` (one per bar), `corner`.
 * The content wrapper inside the viewport is layout-only.
 */
export type ScrollAreaMotion = {
  root?: ScrollAreaPartMotion;
  viewport?: ScrollAreaPartMotion;
  scrollbar?: ScrollAreaPartMotion;
  thumb?: ScrollAreaPartMotion;
  corner?: ScrollAreaPartMotion;
};

export type ScrollMetrics = {
  viewport: number;
  content: number;
  scroll: number;
  maxScroll: number;
  overflowing: boolean;
  track: number;
  thumbSize: number;
  thumbOffset: number;
};

export type RtlScrollType = "negative" | "positive-descending" | "positive-ascending";

export type ScrollAreaBarRegistration = {
  axis: ScrollAxis;
  element: HTMLElement;
};

export type ScrollAreaContextValue = {
  viewportId: string;
  visibility: ScrollAreaVisibility;
  orientation: ScrollAreaOrientation;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  viewportRef: RefObject<HTMLDivElement | null>;
  axesRef: RefObject<{ vertical: ScrollMetrics; horizontal: ScrollMetrics }>;
  overflow: { vertical: boolean; horizontal: boolean };
  aria: { vertical: { now: number; max: number }; horizontal: { now: number; max: number } };
  barActive: { vertical: boolean; horizontal: boolean };
  registerBar: (bar: ScrollAreaBarRegistration) => () => void;
  setDragging: (axis: ScrollAxis, dragging: boolean) => void;
};

export type ScrollAreaProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> &
  MotionStateHostProps & {
    children?: ReactNode;
    className?: string;
    classNames?: Prettify<ScrollAreaClassNames>;
    /** `hover` shows the bar under the pointer or focus. `scroll` while moving. `always` whenever content overflows. */
    visibility?: ScrollAreaVisibility;
    /** Simple API only. Compound mounts `Scrollbar` itself. */
    orientation?: ScrollAreaOrientation;
    /** How long `scroll` visibility stays after the last scroll, in milliseconds. */
    scrollHideDelay?: number;
    motion?: Prettify<MotionMapWithEvents<ScrollAreaMotion>>;
    motionController?: MotionController;
  };

export type ScrollAreaViewportProps = HTMLAttributes<HTMLDivElement>;

export type ScrollAreaScrollbarProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  orientation?: ScrollAxis;
  motion?: ScrollAreaPartMotion;
};

export type ScrollAreaThumbProps = HTMLAttributes<HTMLDivElement> & {
  motion?: ScrollAreaPartMotion;
};

export type ScrollAreaCornerProps = HTMLAttributes<HTMLDivElement> & {
  motion?: ScrollAreaPartMotion;
};
