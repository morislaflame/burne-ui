import { useMemo } from "react";

import { countGroupSegmentSlots, flattenFragmentChildren } from "./buttonGroupAPI";
import type { UseButtonGroupRootStateProps } from "./buttonGroupTypes";

export function useButtonGroupRootState({
  children,
  orientation = "horizontal",
  segmented = false,
  buttonSize = "base",
  variant = "default",
}: UseButtonGroupRootStateProps) {
  const flat = useMemo(() => flattenFragmentChildren(children), [children]);
  const segmentCount = useMemo(() => countGroupSegmentSlots(flat), [flat]);
  const layoutValue = useMemo(() => ({ segmented }), [segmented]);

  return {
    flat,
    segmentCount,
    layoutValue,
    orientation,
    segmented,
    buttonSize,
    variant,
  };
}
