import { createContext, useContext } from "react";

import type { ProgressBarOrientation } from "@/components/core/ProgressBar/ProgressBar";

export type ProgressBarDisplayState = {
  clampedValue: number;
  statusText: string;
  min: number;
  max: number;
  indeterminate: boolean;
};

export type ProgressBarFieldContextValue = {
  progressId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  orientation: ProgressBarOrientation;
  display: ProgressBarDisplayState | null;
  setDisplay: (next: ProgressBarDisplayState | null) => void;
};

const ProgressBarFieldContext = createContext<ProgressBarFieldContextValue | null>(null);

export function useProgressBarFieldContext() {
  const ctx = useContext(ProgressBarFieldContext);
  if (!ctx) {
    throw new Error("ProgressBar.* должны быть внутри <ProgressBar>.");
  }
  return ctx;
}

export function useOptionalProgressBarFieldContext() {
  return useContext(ProgressBarFieldContext);
}

export { ProgressBarFieldContext };
