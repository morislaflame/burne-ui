import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  CloseButtonClassNames,
  CloseButtonClassNamesProviderProps,
} from "./closeButtonTypes";

const CloseButtonClassNamesContext = createContext<CloseButtonClassNames>({});

export function CloseButtonClassNamesProvider({
  classNames,
  children,
}: CloseButtonClassNamesProviderProps) {
  const parent = useContext(CloseButtonClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <CloseButtonClassNamesContext.Provider value={merged}>
      {children}
    </CloseButtonClassNamesContext.Provider>
  );
}

export function useCloseButtonClassNames(): CloseButtonClassNames {
  return useContext(CloseButtonClassNamesContext);
}

/** Scope only. Defaults and host play live in `closeButtonAnimations.ts`. */
export const {
  MotionScopeProvider: CloseButtonMotionProvider,
  useMotionScope: useCloseButtonMotionScope,
  useOptionalMotionScope: useOptionalCloseButtonMotionScope,
} = createMotionScope("CloseButton");
