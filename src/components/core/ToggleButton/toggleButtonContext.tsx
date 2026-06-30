import { createContext, useContext } from "react";

import type { ToggleButtonGroupContextValue } from "./toggleButtonTypes";

const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | null>(null);

export function useOptionalToggleButtonGroupContext() {
  return useContext(ToggleButtonGroupContext);
}

function useToggleButtonGroupContext(): ToggleButtonGroupContextValue {
  const ctx = useContext(ToggleButtonGroupContext);
  if (!ctx) {
    throw new Error("ToggleButton with `value` must be inside <ToggleButtonGroup>.");
  }
  return ctx;
}

export { ToggleButtonGroupContext };

void useToggleButtonGroupContext;
