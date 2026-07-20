import { createContext, useContext, useMemo, type ReactNode } from "react";

import type {
  SwitchClassNames,
  SwitchClassNamesProviderProps,
  SwitchFieldContextValue,
  SwitchTrackContextValue,
} from "./switchTypes";

const SwitchFieldContext = createContext<SwitchFieldContextValue | null>(null);
const SwitchClassNamesContext = createContext<SwitchClassNames>({});
const SwitchTrackContext = createContext<SwitchTrackContextValue | null>(null);

export function SwitchFieldProvider({
  value,
  children,
}: {
  value: SwitchFieldContextValue;
  children: ReactNode;
}) {
  return (
    <SwitchFieldContext.Provider value={value}>{children}</SwitchFieldContext.Provider>
  );
}

export function useSwitchFieldContext(): SwitchFieldContextValue {
  const ctx = useContext(SwitchFieldContext);
  if (!ctx) {
    throw new Error("Switch components must be inside <Switch>.");
  }
  return ctx;
}

export function useOptionalSwitchFieldContext(): SwitchFieldContextValue | null {
  return useContext(SwitchFieldContext);
}

export { SwitchFieldContext };

export function SwitchClassNamesProvider({
  classNames,
  children,
}: SwitchClassNamesProviderProps) {
  const parent = useContext(SwitchClassNamesContext);
  const merged = useMemo(
    () => ({ ...parent, ...classNames }),
    [classNames, parent],
  );

  return (
    <SwitchClassNamesContext.Provider value={merged}>
      {children}
    </SwitchClassNamesContext.Provider>
  );
}

export function useSwitchClassNames(): SwitchClassNames {
  return useContext(SwitchClassNamesContext);
}

export function SwitchTrackProvider({
  value,
  children,
}: {
  value: SwitchTrackContextValue;
  children: ReactNode;
}) {
  return (
    <SwitchTrackContext.Provider value={value}>{children}</SwitchTrackContext.Provider>
  );
}

export function useSwitchTrackContext(): SwitchTrackContextValue {
  const ctx = useContext(SwitchTrackContext);
  if (!ctx) {
    throw new Error(
      "Switch.Track, Switch.Fill, Switch.Thumb, Switch.Icon must be inside <Switch.Track>",
    );
  }
  return ctx;
}
