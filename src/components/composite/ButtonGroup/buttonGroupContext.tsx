import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { ButtonSize, ButtonVariant } from "@/components/core/Button";

import type {
  ButtonGroupClassNames,
  ButtonGroupClassNamesProviderProps,
  ButtonGroupLayoutContextValue,
  ButtonGroupSegment,
  ButtonGroupSegmentContextValue,
} from "./buttonGroupTypes";

const ButtonGroupSegmentContext = createContext<ButtonGroupSegmentContextValue | null>(
  null,
);

const ButtonGroupLayoutContext = createContext<ButtonGroupLayoutContextValue | null>(
  null,
);

const ButtonGroupClassNamesContext = createContext<ButtonGroupClassNames>({});

export function ButtonGroupLayoutProvider({
  value,
  children,
}: {
  value: ButtonGroupLayoutContextValue;
  children: ReactNode;
}) {
  return (
    <ButtonGroupLayoutContext.Provider value={value}>
      {children}
    </ButtonGroupLayoutContext.Provider>
  );
}

export function ButtonGroupSegmentProvider({
  segment,
  buttonSize,
  variant,
  children,
}: {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ segment, buttonSize, variant }),
    [buttonSize, segment, variant],
  );

  return (
    <ButtonGroupSegmentContext.Provider value={value}>
      {children}
    </ButtonGroupSegmentContext.Provider>
  );
}

export function useOptionalButtonGroupSegment() {
  return useContext(ButtonGroupSegmentContext);
}

export function useOptionalButtonGroupLayout() {
  return useContext(ButtonGroupLayoutContext);
}

export function ButtonGroupClassNamesProvider({
  classNames,
  children,
}: ButtonGroupClassNamesProviderProps) {
  const parent = useContext(ButtonGroupClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <ButtonGroupClassNamesContext.Provider value={merged}>
      {children}
    </ButtonGroupClassNamesContext.Provider>
  );
}

export function useButtonGroupClassNames(): ButtonGroupClassNames {
  return useContext(ButtonGroupClassNamesContext);
}

export { ButtonGroupLayoutContext, ButtonGroupSegmentContext };
