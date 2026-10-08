import { ScrollAreaRoot } from "./ScrollArea";
import {
  ScrollAreaCorner,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "./scrollAreaParts";

export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
  Corner: ScrollAreaCorner,
});

export type {
  ScrollAreaClassNames,
  ScrollAreaCornerProps,
  ScrollAreaMotion,
  ScrollAreaOrientation,
  ScrollAreaPartMotion,
  ScrollAreaProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
  ScrollAreaVisibility,
  ScrollAxis,
} from "./scrollAreaTypes";
