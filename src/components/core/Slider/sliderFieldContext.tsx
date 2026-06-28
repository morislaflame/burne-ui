import { createContext, useContext } from "react";

import type { SliderOrientation } from "@/components/core/Slider/Slider";

export type SliderDisplayState = {
  valueLabel: string;
  min: number;
  max: number;
  range: boolean;
  singleValue: number;
  rangeValue: [number, number];
  label?: string;
};

export type SliderFieldContextValue = {
  sliderId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  orientation: SliderOrientation;
  display: SliderDisplayState | null;
  setDisplay: (next: SliderDisplayState | null) => void;
};

const SliderFieldContext = createContext<SliderFieldContextValue | null>(null);

export function useSliderFieldContext() {
  const ctx = useContext(SliderFieldContext);
  if (!ctx) {
    throw new Error("Slider.* must be inside <Slider>.");
  }
  return ctx;
}

export function useOptionalSliderFieldContext() {
  return useContext(SliderFieldContext);
}

export { SliderFieldContext };
