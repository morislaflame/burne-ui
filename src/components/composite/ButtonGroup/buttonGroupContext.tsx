import { createContext, useContext } from "react";

import type { ButtonSize, ButtonVariant } from "@/components/core/Button";
import type { ButtonGroupSegment } from "./buttonGroupSegment";

export type ButtonGroupSegmentContextValue = {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
  variant?: ButtonVariant;
};

const ButtonGroupSegmentContext = createContext<ButtonGroupSegmentContextValue | null>(
  null,
);

export type ButtonGroupLayoutContextValue = {
  segmented: boolean;
};

const ButtonGroupLayoutContext = createContext<ButtonGroupLayoutContextValue | null>(
  null,
);

export function useOptionalButtonGroupSegment() {
  return useContext(ButtonGroupSegmentContext);
}

export function useOptionalButtonGroupLayout() {
  return useContext(ButtonGroupLayoutContext);
}

export { ButtonGroupLayoutContext, ButtonGroupSegmentContext };
