import { useLayoutEffect, useRef, type RefObject } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

import { listBoxOptionId } from "./listBoxA11y";
import type { UseListBoxItemAnimationsProps } from "./listBoxTypes";

export function useListBoxRootGlossRef(isGloss: boolean) {
  return useMergedGlossPanelRef(undefined, isGloss);
}

/**
 * Sync `data-active` on the active option. Highlight CSS is the static
 * `data-active:bg-default-hover` class on every item — no React `isActive`.
 */
export function useListBoxActiveOptionHighlight({
  listId,
  activeValue,
  rootRef,
}: {
  listId: string;
  activeValue: string | null;
  rootRef: RefObject<HTMLElement | null>;
}) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    for (const el of root.querySelectorAll<HTMLElement>(
      '[role="option"][data-active]',
    )) {
      el.removeAttribute("data-active");
    }

    if (!activeValue) return;
    const option = document.getElementById(listBoxOptionId(listId, activeValue));
    if (option && root.contains(option)) {
      option.setAttribute("data-active", "");
    }
  }, [activeValue, listId, rootRef]);
}

export function useListBoxItemAnimations({
  disabled,
  hasLabel,
  onPointerDown,
  onKeyDown,
}: UseListBoxItemAnimationsProps) {
  const labelMotionRef = useRef<HTMLElement>(null);
  const enableLabelMotion = !disabled && hasLabel;

  const { handlePointerDown, handleKeyDown } = usePressableElementTextMotion<
    HTMLButtonElement,
    HTMLElement
  >({
    isDisabled: disabled,
    enabled: enableLabelMotion,
    textMotionRef: labelMotionRef,
    onPointerDown,
    onKeyDown,
  });

  return {
    labelMotionRef,
    enableLabelMotion,
    handlePointerDown,
    handleKeyDown,
  };
}
