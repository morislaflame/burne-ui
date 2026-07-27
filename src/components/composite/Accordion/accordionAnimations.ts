import { useRef } from "react";

import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";

export function useAccordionChevronAnimation(open: boolean) {
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  return useChevronRotation(open, chevronRef, () => isMotionFeatureEnabled("enableExpandable"));
}
