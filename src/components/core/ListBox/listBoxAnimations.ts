import { useRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

import type { UseListBoxItemAnimationsProps } from "./listBoxTypes";

export function useListBoxRootGlossRef(isGloss: boolean) {
  return useMergedGlossPanelRef(undefined, isGloss);
}

export function useListBoxItemAnimations({
  disabled,
  hasLabel,
  onPointerDown,
}: UseListBoxItemAnimationsProps) {
  const labelMotionRef = useRef<HTMLElement>(null);
  const enableLabelMotion = !disabled && hasLabel;

  const { handlePointerDown } = usePressableElementTextMotion<HTMLButtonElement, HTMLElement>({
    isDisabled: disabled,
    enabled: enableLabelMotion,
    textMotionRef: labelMotionRef,
    onPointerDown,
  });

  return {
    labelMotionRef,
    enableLabelMotion,
    handlePointerDown,
  };
}
