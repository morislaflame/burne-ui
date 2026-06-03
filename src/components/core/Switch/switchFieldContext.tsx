import { createContext, useContext, type RefObject } from "react";

import type { SwitchLabelPosition, SwitchSize } from "@/components/core/Switch/Switch";

export type SwitchFieldContextValue = {
  switchId: string;
  hintId: string;
  errorId: string;
  size: SwitchSize;
  labelPosition: SwitchLabelPosition;
  disabled?: boolean;
  isCompound: boolean;
  hasCompoundHint: boolean;
  hasCompoundError: boolean;
  hasTextColumn: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  useInlineCompoundMotion: boolean;
  textMotionRef: RefObject<HTMLElement | null>;
  setSqueezeToken: (fn: (t: number) => number) => void;
};

const SwitchFieldContext = createContext<SwitchFieldContextValue | null>(null);

export function useSwitchFieldContext() {
  const ctx = useContext(SwitchFieldContext);
  if (!ctx) {
    throw new Error("Switch.* должны быть внутри <Switch>.");
  }
  return ctx;
}

export function useOptionalSwitchFieldContext() {
  return useContext(SwitchFieldContext);
}

export { SwitchFieldContext };
