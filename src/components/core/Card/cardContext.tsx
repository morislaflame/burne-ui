import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { CardSize } from "./cardStyles";
import { resolveCardSize } from "./cardStyles";
import type { CardClassNames, CardProviderProps } from "./cardTypes";

/** Scope only. Defaults and host play live in `cardAnimations.ts`. */
export const {
  MotionScopeProvider: CardMotionProvider,
  useMotionScope: useCardMotionScope,
  useOptionalMotionScope: useOptionalCardMotionScope,
} = createMotionScope("Card");

export type CardContextValue = {
  classNames: CardClassNames;
  size: CardSize;
};

const CardContext = createContext<CardContextValue>({
  classNames: {},
  size: "base",
});

export function CardProvider({ classNames, size, children }: CardProviderProps) {
  const parent = useContext(CardContext);
  const resolvedSize = resolveCardSize(size);
  const value = useMemo<CardContextValue>(
    () => ({
      classNames: { ...parent.classNames, ...classNames },
      size: resolvedSize,
    }),
    [classNames, parent.classNames, resolvedSize],
  );

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

export function useCardContext(): CardContextValue {
  return useContext(CardContext);
}

export function useCardClassNames(): CardClassNames {
  return useCardContext().classNames;
}

export function useCardSize(): CardSize {
  return useCardContext().size;
}
