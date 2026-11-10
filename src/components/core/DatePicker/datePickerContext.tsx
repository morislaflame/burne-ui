import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import { createMotionScope } from "@/components/core/utils/slotMotion";

import type { DatePickerClassNames, DatePickerContextValue } from "./datePickerTypes";

const DatePickerContext = createContext<DatePickerContextValue | null>(null);
const DatePickerClassNamesContext = createContext<DatePickerClassNames>({});

export function DatePickerProvider({
  value,
  children,
}: {
  value: DatePickerContextValue;
  children: ReactNode;
}) {
  return <DatePickerContext.Provider value={value}>{children}</DatePickerContext.Provider>;
}

export function useDatePickerContext(): DatePickerContextValue {
  const value = useContext(DatePickerContext);
  if (!value) {
    throw new Error("DatePicker parts must be rendered inside DatePicker.");
  }
  return value;
}

export function DatePickerClassNamesProvider({
  classNames,
  children,
}: {
  classNames?: Prettify<DatePickerClassNames>;
  children: ReactNode;
}) {
  const parent = useContext(DatePickerClassNamesContext);
  const merged = useMemo(() => ({ ...parent, ...classNames }), [classNames, parent]);
  return (
    <DatePickerClassNamesContext.Provider value={merged}>{children}</DatePickerClassNamesContext.Provider>
  );
}

export function useDatePickerClassNames(): DatePickerClassNames {
  return useContext(DatePickerClassNamesContext);
}

/** Scope only. Defaults and host play live in `datePickerAnimations.ts`. */
export const {
  MotionScopeProvider: DatePickerMotionProvider,
  useMotionScope: useDatePickerMotionScope,
  useOptionalMotionScope: useOptionalDatePickerMotionScope,
} = createMotionScope("DatePicker");
