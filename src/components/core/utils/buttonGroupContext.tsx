import { createContext, useContext } from "react";

import type { ButtonSize } from "@/components/core/Button";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";

export type ButtonGroupSegmentContextValue = {
  segment: ButtonGroupSegment;
  buttonSize: ButtonSize;
};

const ButtonGroupSegmentContext = createContext<ButtonGroupSegmentContextValue | null>(
  null,
);

export function useOptionalButtonGroupSegment() {
  return useContext(ButtonGroupSegmentContext);
}

export { ButtonGroupSegmentContext };
