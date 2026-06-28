import { createContext, useContext } from "react";

import type { MeterOrientation } from "@/components/core/Meter/Meter";

export type MeterDisplayState = {
  clampedValue: number;
  statusText: string;
  min: number;
  max: number;
};

export type MeterFieldContextValue = {
  meterId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  orientation: MeterOrientation;
  display: MeterDisplayState | null;
  setDisplay: (next: MeterDisplayState | null) => void;
};

const MeterFieldContext = createContext<MeterFieldContextValue | null>(null);

export function useMeterFieldContext() {
  const ctx = useContext(MeterFieldContext);
  if (!ctx) {
    throw new Error("Meter.* components must be inside <Meter>.");
  }
  return ctx;
}

export function useOptionalMeterFieldContext() {
  return useContext(MeterFieldContext);
}

export { MeterFieldContext };
