import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  FieldClassNames,
  FieldClassNamesProviderProps,
  FieldSetClassNames,
  FieldSetClassNamesProviderProps,
  FieldSize,
} from "./fieldTypes";

const FieldClassNamesContext = createContext<FieldClassNames>({});
const FieldSetClassNamesContext = createContext<FieldSetClassNames>({});
const FieldSizeContext = createContext<FieldSize | null>(null);

export function FieldClassNamesProvider({
  classNames,
  children,
}: FieldClassNamesProviderProps) {
  const parent = useContext(FieldClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <FieldClassNamesContext.Provider value={merged}>
      {children}
    </FieldClassNamesContext.Provider>
  );
}

export function useFieldClassNames(): FieldClassNames {
  return useContext(FieldClassNamesContext);
}

export function FieldSetClassNamesProvider({
  classNames,
  children,
}: FieldSetClassNamesProviderProps) {
  const parent = useContext(FieldSetClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <FieldSetClassNamesContext.Provider value={merged}>
      {children}
    </FieldSetClassNamesContext.Provider>
  );
}

export function useFieldSetClassNames(): FieldSetClassNames {
  return useContext(FieldSetClassNamesContext);
}

export function FieldSetSizeProvider({
  size,
  children,
}: {
  size: FieldSize;
  children: ReactNode;
}) {
  return (
    <FieldSizeContext.Provider value={size}>{children}</FieldSizeContext.Provider>
  );
}

export function useOptionalFieldSize(): FieldSize | null {
  return useContext(FieldSizeContext);
}

export function useFieldSetSize(): FieldSize {
  return useContext(FieldSizeContext) ?? "base";
}

/** Scope only. Defaults and host play live in `fieldAnimations.ts`. */
export const {
  MotionScopeProvider: FieldMotionProvider,
  useMotionScope: useFieldMotionScope,
  useOptionalMotionScope: useOptionalFieldMotionScope,
} = createMotionScope("Field");

export const {
  MotionScopeProvider: FieldSetMotionProvider,
  useMotionScope: useFieldSetMotionScope,
  useOptionalMotionScope: useOptionalFieldSetMotionScope,
} = createMotionScope("FieldSet");
