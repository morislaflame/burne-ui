import { createContext, useContext, useMemo, type ReactNode } from "react";

import type {
  SliderClassNames,
  SliderClassNamesProviderProps,
  SliderFieldContextValue,
  SliderTrackContextValue,
} from "./sliderTypes";

const SliderFieldContext = createContext<SliderFieldContextValue | null>(null);
const SliderClassNamesContext = createContext<SliderClassNames>({});
const SliderTrackContext = createContext<SliderTrackContextValue | null>(null);

export function SliderFieldProvider({
  value,
  children,
}: {
  value: SliderFieldContextValue;
  children: ReactNode;
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

export function SliderClassNamesProvider({
  classNames,
  children,
}: SliderClassNamesProviderProps) {
  const parent = useContext(SliderClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <SliderClassNamesContext.Provider value={merged}>
      {children}
    </SliderClassNamesContext.Provider>
  );
}

export function useSliderClassNames(): SliderClassNames {
  return useContext(SliderClassNamesContext);
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

export function useSliderTrackContext(): SliderTrackContextValue {
  const ctx = useContext(SliderTrackContext);
  if (!ctx) {
    throw new Error(
      "Slider.Rail, Slider.Fill, Slider.Thumb, Slider.Icon must be inside Slider.Track",
    );
  }
  return ctx;
}
