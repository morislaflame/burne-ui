import { useRef } from "react";

import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

export function useAccordionIndicatorAnimation(open: boolean) {
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  return useChevronRotation(open, chevronRef, () => getMotionConfig().enableExpandable);
}
