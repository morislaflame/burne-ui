import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup";

import type { ButtonAsyncState, ButtonClassNames, ButtonContextValue } from "./buttonTypes";

const ButtonContext = createContext<ButtonContextValue | null>(null);
const ButtonClassNamesContext = createContext<ButtonClassNames>({});

/** Scope only. Defaults and host play live in `buttonAnimations.ts`. */
export const {
  MotionScopeProvider: ButtonMotionProvider,
  useMotionScope: useButtonMotionScope,
  useOptionalMotionScope: useOptionalButtonMotionScope,
} = createMotionScope("Button");

export function ButtonClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<ButtonClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(ButtonClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ButtonClassNamesContext.Provider value={merged}>
      {children}
    </ButtonClassNamesContext.Provider>
  );
}

export function useButtonClassNames(): ButtonClassNames {
  return useContext(ButtonClassNamesContext);
}

export function useOptionalButtonContext(): ButtonContextValue | null {
  return useContext(ButtonContext);
}

export function ButtonContextProvider({
  value,
  children,
}: {
  value: ButtonContextValue;
  children: ReactNode;
}) {
  return <ButtonContext.Provider value={value}>{children}</ButtonContext.Provider>;
}

void ButtonContext;

export type { ButtonGroupSegment, ButtonAsyncState };
