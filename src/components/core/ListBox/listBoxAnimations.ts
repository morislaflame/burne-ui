/**
 * Slot motion for ListBox — look here first.
 *
 * DOM slots: `item` (option button), `label`, `hint`, `icon`, `section`, `header`, `empty`, `separator`
 *
 * Root Provider carries defaults so keyboard `play("item", "pressIn", { el })`
 * works from `ListBoxRootShell`. Each Item nests its own unique Provider +
 * `useMotionPart` (not shared-scope repeated). `section` / `header` / `empty` / `separator`
 * register on the root scope (repeated `header` / `section` / `separator` when several groups).
 *
 * Not slots: `root` / `headerText` (layout). panel ref stays kit-internal.
 */
import { useLayoutEffect, useRef, type ForwardedRef, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
 
import { listBoxOptionId } from "./listBoxA11y";
import { useOptionalListBoxMotionScope } from "./listBoxContext";
import type { ListBoxActiveSource, ListBoxMotion, ListBoxPartMotion } from "./listBoxTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();
 
export function resolveListBoxMotionDefaults(): ListBoxMotion {
  return {
    item: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}
 
export type ListBoxMotionSlot = keyof ListBoxMotion;
 
export function useListBoxSlotMotion<T extends HTMLElement>(
  slot: Exclude<ListBoxMotionSlot, "item">,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: ListBoxPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalListBoxMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
 
export function playListBoxItemPress(scope: MotionScopeValue, el: HTMLElement | null) {
  if (!el || prefersReducedMotion()) return;
  const value = scope.resolve("item", "pressIn");
  if (value === false || value === undefined) return;
  scope.play("item", "pressIn", { el });
}
 
/**
 * Highlight the active option with a class. No React `isActive` on every row.
 * Scrolls into view only on keyboard / initial / programmatic changes — never on pointer hover.
 */
export function useListBoxActiveOptionHighlight({
  listId,
  activeValue,
  rootRef,
  activeChangeSourceRef,
  virtualRangeKey,
}: {
  listId: string;
  activeValue: string | null;
  rootRef: RefObject<HTMLElement | null>;
  activeChangeSourceRef?: RefObject<ListBoxActiveSource>;
  virtualRangeKey?: string;
}) {
  const prevActiveValueRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    for (const el of root.querySelectorAll<HTMLElement>(
      '[role="option"].listbox-option-active',
    )) {
      el.classList.remove("listbox-option-active", "bg-default-hover");
    }

    const activeChanged = activeValue !== prevActiveValueRef.current;
    prevActiveValueRef.current = activeValue;
    const source = activeChangeSourceRef?.current ?? "keyboard";
    if (activeChanged && activeChangeSourceRef) {
      activeChangeSourceRef.current = "keyboard";
    }

    if (!activeValue) return;
    const option = document.getElementById(listBoxOptionId(listId, activeValue));
    if (option && root.contains(option)) {
      option.classList.add("listbox-option-active", "bg-default-hover");
      if (activeChanged && source !== "pointer") {
        option.scrollIntoView?.({ block: "nearest" });
      }
    }
  }, [activeChangeSourceRef, activeValue, listId, rootRef, virtualRangeKey]);
}
 