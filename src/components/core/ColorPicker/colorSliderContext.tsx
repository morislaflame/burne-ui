import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { ColorSliderClassNames } from "./colorSliderTypes";

const ColorSliderClassNamesContext = createContext<ColorSliderClassNames>({});

export function ColorSliderClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: ColorSliderClassNames;
  children: ReactNode;
}) {
  const parent = useContext(ColorSliderClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );
  return (
    <ColorSliderClassNamesContext.Provider value={merged}>
      {children}
    </ColorSliderClassNamesContext.Provider>
  );
}

export function useColorSliderClassNames(): ColorSliderClassNames {
  return useContext(ColorSliderClassNamesContext);
}

/** Scope only. Defaults and host play live in `colorSliderAnimations.ts`. */
export const {
  MotionScopeProvider: ColorSliderMotionProvider,
  useMotionScope: useColorSliderMotionScope,
  useOptionalMotionScope: useOptionalColorSliderMotionScope,
} = createMotionScope("ColorSlider");
 