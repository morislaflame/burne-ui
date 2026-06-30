import { type ReactNode } from "react";

import {
  ToggleButtonGroupContext,
  useOptionalToggleButtonGroupContext,
} from "@/components/core/ToggleButton/toggleButtonContext";

import type { ToggleButtonGroupContextValue } from "./toggleButtonGroupTypes";

export function ToggleButtonGroupProvider({
  value,
  children,
}: {
  value: ToggleButtonGroupContextValue;
  children: ReactNode;
}) {
  return (
    <ToggleButtonGroupContext.Provider value={value}>
      {children}
    </ToggleButtonGroupContext.Provider>
  );
}

export { ToggleButtonGroupContext, useOptionalToggleButtonGroupContext };
