import { createContext, useContext, type ReactNode, type RefObject } from "react";

import type { SliderOrientation, SliderSize } from "./Slider";

export type SliderThumbKind = "single" | "start" | "end";

export type SliderTrackContextValue = {
  fillRef: RefObject<HTMLSpanElement | null>;
  fillClassResolved: string;
  railClass: string;
  markNodes: ReactNode;
  size: SliderSize;
  orientation: SliderOrientation;
  disabled?: boolean;
  icon?: ReactNode;
  range: boolean;
  renderThumb: (kind: SliderThumbKind, iconOverride?: ReactNode) => ReactNode;
};

const SliderTrackContext = createContext<SliderTrackContextValue | null>(null);

export function useSliderTrackContext() {
  const ctx = useContext(SliderTrackContext);
  if (!ctx) {
    throw new Error("Slider.Rail, Slider.Fill, Slider.Thumb, Slider.Icon — внутри Slider.Track");
  }
  return ctx;
}

export function SliderTrackProvider({
  value,
  children,
}: {
  value: SliderTrackContextValue;
  children: ReactNode;
}) {
  return (
    <SliderTrackContext.Provider value={value}>{children}</SliderTrackContext.Provider>
  );
}
