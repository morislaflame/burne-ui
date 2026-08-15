import { createContext, useContext, useMemo } from "react";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type {
  FieldLabelContextValue,
  LabelClassNames,
  LabelClassNamesProviderProps,
} from "./labelTypes";

const FieldLabelContext = createContext<FieldLabelContextValue | null>(null);
const LabelClassNamesContext = createContext<LabelClassNames>({});

export function FieldLabelContextProvider({
  value,
  children,
}: {
  value: FieldLabelContextValue;
  children: React.ReactNode;
}) {
  return (
    <FieldLabelContext.Provider value={value}>{children}</FieldLabelContext.Provider>
  );
}

export function LabelClassNamesProvider({
  classNames,
  children,
}: LabelClassNamesProviderProps) {
  const parent = useContext(LabelClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <LabelClassNamesContext.Provider value={merged}>
      {children}
    </LabelClassNamesContext.Provider>
  );
}

function useFieldLabelContext() {
  const ctx = useContext(FieldLabelContext);
  if (!ctx) {
    throw new Error(
      "Label must be inside a field with FieldLabelContext (Input, ComboBox, Meter, …).",
    );
  }
  return ctx;
}

export function useOptionalFieldLabelContext() {
  return useContext(FieldLabelContext);
}

export function useLabelClassNames(): LabelClassNames {
  return useContext(LabelClassNamesContext);
}

/** Scope only. Defaults and host play live in `labelAnimations.ts`. */
export const {
  MotionScopeProvider: LabelMotionProvider,
  useMotionScope: useLabelMotionScope,
  useOptionalMotionScope: useOptionalLabelMotionScope,
} = createMotionScope("Label");

export { FieldLabelContext };

void useFieldLabelContext;
