import { createContext, useContext } from "react";

import type { SliderFieldContextValue } from "./sliderTypes";

const SliderFieldContext = createContext<SliderFieldContextValue | null>(null);

export function SliderFieldProvider({
  value,
  children,
}: {
  value: SliderFieldContextValue;
  children: React.ReactNode;
}) {
  return (
    <SliderFieldContext.Provider value={value}>{children}</SliderFieldContext.Provider>
  );
}

export function useSliderFieldContext(): SliderFieldContextValue {
  const ctx = useContext(SliderFieldContext);
  if (!ctx) {
    throw new Error("Slider components must be inside <Slider>.");
  }
  return ctx;
}

export function useOptionalSliderFieldContext(): SliderFieldContextValue | null {
  return useContext(SliderFieldContext);
}

export { SliderFieldContext };
