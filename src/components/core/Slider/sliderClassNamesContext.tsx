import { createContext, useContext, useMemo } from "react";

import type { SliderClassNames, SliderClassNamesProviderProps } from "./sliderTypes";

const SliderClassNamesContext = createContext<SliderClassNames>({});

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
