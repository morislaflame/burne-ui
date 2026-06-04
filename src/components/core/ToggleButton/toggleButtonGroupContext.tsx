import { createContext, useContext } from "react";

import type { ToggleButtonSize, ToggleButtonVariant } from "./ToggleButton";

export type ToggleButtonGroupType = "multiple" | "single";

export type ToggleButtonGroupOrientation = "horizontal" | "vertical";

export type ToggleButtonGroupContextValue = {
  type: ToggleButtonGroupType;
  disabled: boolean;
  size: ToggleButtonSize;
  variant: ToggleButtonVariant;
  isSelected: (value: string) => boolean;
  select: (value: string) => void;
  /** Roving tabindex для `type="single"`. */
  tabIndexFor: (value: string) => 0 | -1 | undefined;
};

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | null>(null);

export function useOptionalToggleButtonGroupContext() {
  return useContext(ToggleButtonGroupContext);
}

export function useToggleButtonGroupContext(): ToggleButtonGroupContextValue {
  const ctx = useContext(ToggleButtonGroupContext);
  if (!ctx) {
    throw new Error("ToggleButton с `value` должен быть внутри <ToggleButtonGroup>.");
  }
  return ctx;
}

export { ToggleButtonGroupContext };
