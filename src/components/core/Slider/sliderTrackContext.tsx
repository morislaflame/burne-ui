import { createContext, useContext } from "react";

import type { SliderTrackContextValue } from "./sliderTypes";

const SliderTrackContext = createContext<SliderTrackContextValue | null>(null);

export function SliderTrackProvider({
  value,
  children,
}: {
  value: SliderTrackContextValue;
  children: React.ReactNode;
}) {
  return (
    <SliderTrackContext.Provider value={value}>{children}</SliderTrackContext.Provider>
  );
}

export function useSliderTrackContext(): SliderTrackContextValue {
  const ctx = useContext(SliderTrackContext);
  if (!ctx) {
    throw new Error(
      "Slider.Rail, Slider.Fill, Slider.Thumb, Slider.Icon must be inside Slider.Track",
    );
  }
  return ctx;
}
