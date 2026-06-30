import { useCallback, useState, type Ref } from "react";

import type { ClassValue } from "clsx";

import type { TextVariant } from "@/components/core/Text";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { cn } from "@/utils/cn";

import type { TabsSize, TabsVariant } from "./tabsTypes";

export function mergeTabsSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function isSurfaceTabsVariant(variant: TabsVariant): boolean {
  return variant === "outline" || variant === "secondary" || variant === "gloss";
}

export function useMergedTabsValue(
  value: string | undefined,
  defaultValue: string | undefined,
): [string, (next: string) => void, boolean] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value! : internal;
  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [current, setValue, isControlled];
}

export function tabTextVariant(size: TabsSize): TextVariant {
  return CONTROL_SIZE_LAYOUT[size].controlText;
}

export function collectTabButtons(list: HTMLElement): HTMLButtonElement[] {
  return Array.from(list.querySelectorAll('[role="tab"]:not([disabled])')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
  );
}

export function focusTabAt(list: HTMLElement, index: number) {
  const tabs = collectTabButtons(list);
  if (tabs.length === 0) return null;
  const next = tabs[Math.max(0, Math.min(index, tabs.length - 1))]!;
  next.focus();
  return next;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}
