/**
 * Slot motion for ListBox — look here first.
 *
 * DOM slots: `item` (option button), `label`, `icon`
 *
 * Root Provider carries defaults so keyboard `play("item", "pressIn", { el })`
 * works from `ListBoxRootShell`. Each Item nests its own Provider + `useMotionPart`.
 *
 * Not slots: `root` / `section` / `header` / `empty` / `separator` (layout).
 * Gloss panel ref stays kit-internal.
 */
import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";

import { listBoxOptionId } from "./listBoxA11y";
import type { ListBoxMotion } from "./listBoxTypes";
import { useLayoutEffect, type RefObject } from "react";

export function useListBoxRootGlossRef(isGloss: boolean) {
  return useMergedGlossPanelRef(undefined, isGloss);
}

export function resolveListBoxMotionDefaults(): ListBoxMotion {
  return {
    item: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}

export function playListBoxItemPress(scope: MotionScopeValue, el: HTMLElement | null) {
  if (!el || prefersReducedMotion()) return;
  const value = scope.resolve("item", "pressIn");
  if (value === false || value === undefined) return;
  scope.play("item", "pressIn", { el });
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
