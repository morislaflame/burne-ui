/**
 * Slot motion for Tabs — look here first.
 *
 * DOM slots: `root`, `list`, `indicator`, `tab`, `tabText`, `panel`
 *
 * `indicator.change` → `tabsIndicatorMove`. The host writes the layout box, then
 * the recipe tweens the compositor delta (`useSlidingTabIndicator.ts`).
 *
 * Hosts:
 * - Root plays optional `enter` and `change` when the selected value updates
 *   (hover / press only if the user sets those recipes).
 * - List plays optional `enter` only (`pointerPhases: false`).
 * - Each Tab is a nested unique scope. `tab` / `tabText` `enter` is mount-only
 *   (`useOptionalEnterOnMount`). Selection is `check` / `uncheck` (`skipFirst`).
 * - Inactive tabs default to `hoverLiftFirstLevel` + `pressSqueeze` on `tabText`.
 *   Selected / disabled → those pointer phases `false`.
 * - Panel plays opt-in `enter` / `leave` on panel visibility (not tab selection).
 */
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
 
import {
  isInteractivePressKey,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import {
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
 
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { TabsMotion, TabsVariant } from "./tabsTypes";
import { KIT_TABS_VARIANTS } from "./tabsTypes";

export function resolveTabsMotionDefaults(variant: TabsVariant = "default"): TabsMotion {
  return overlaySkinMotion(
    { indicator: { change: "tabsIndicatorMove" } },
    variant,
    KIT_TABS_VARIANTS,
    "tabs",
  );
}
 
export function resolveTabsTabMotionDefaults({
  selected,
  disabled,
}: {
  selected: boolean;
  disabled: boolean;
}): TabsMotion {
  if (disabled || selected) {
    return {
      tabText: {
        hoverIn: false,
        hoverOut: false,
        pressIn: false,
        pressOut: false,
      },
    };
  }
  return {
    tabText: {
      hoverIn: "hoverLiftFirstLevel",
      hoverOut: "hoverLiftFirstLevel",
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}
 
export function useTabsRootEnter(scope: MotionScopeValue | null, value: string) {
  useOptionalEnterOnMount(scope, "root");
  useSlotPhaseOnChange(scope, "root", value, { phase: "change" });
}
 
export function useTabsListEnter(scope: MotionScopeValue | null) {
  useOptionalEnterOnMount(scope, "list");
}
 
export function useTabsTabEnter(
  scope: MotionScopeValue | null,
  tabTarget?: RefObject<HTMLElement | null>,
  textTarget?: RefObject<HTMLElement | null>,
) {
  useOptionalEnterOnMount(scope, "tab", tabTarget);
  useOptionalEnterOnMount(scope, "tabText", textTarget);
}
 
function playTabPhase(
  scope: MotionScopeValue,
  phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut" | "check" | "uncheck",
) {
  const tabEl = scope.getTarget("tab");
  const textEl = scope.getTarget("tabText");
  if (tabEl) {
    const value = scope.resolve("tab", phase);
    if (value !== undefined && value !== false) {
      scope.play("tab", phase, { el: tabEl });
    }
  }
  if (textEl) {
    const value = scope.resolve("tabText", phase);
    if (value !== undefined && value !== false) {
      scope.play("tabText", phase, { el: textEl });
    }
  }
}
 
export function useTabsTabPointerMotion({
  scope,
  isDisabled,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: {
  scope: MotionScopeValue;
  isDisabled: boolean | undefined;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: (e: PointerEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const config = useMotionConfig();
  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (isDisabled || e.defaultPrevented || shouldSkipInteractiveHoverLift(config)) return;
      playTabPhase(scope, "hoverIn");
    },
    [config, isDisabled, onPointerEnter, scope],
  );
 
  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      if (isDisabled || shouldSkipInteractiveHoverLift(config)) return;
      playTabPhase(scope, "hoverOut");
    },
    [config, isDisabled, onPointerLeave, scope],
  );
 
  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (isDisabled || e.defaultPrevented) return;
      playTabPhase(scope, "pressIn");
    },
    [isDisabled, onPointerDown, scope],
  );
 
  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (isDisabled || e.defaultPrevented) return;
      playTabPhase(scope, "pressOut");
    },
    [isDisabled, onPointerUp, scope],
  );
 
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (isDisabled || e.defaultPrevented || !isInteractivePressKey(e)) return;
      playTabPhase(scope, "pressIn");
    },
    [isDisabled, onKeyDown, scope],
  );
 
  return {
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
  };
}
 
export function useTabsTabSelectionMotion(
  scope: MotionScopeValue,
  selected: boolean,
  tabTarget?: RefObject<HTMLElement | null>,
  textTarget?: RefObject<HTMLElement | null>,
) {
  useSlotPhaseOnChange(scope, "tab", selected, {
    phase: selected ? "check" : "uncheck",
    skipFirst: true,
    target: tabTarget,
  });
  useSlotPhaseOnChange(scope, "tabText", selected, {
    phase: selected ? "check" : "uncheck",
    skipFirst: true,
    target: textTarget,
  });
}
 
export function useTabsPanelLifecycle(
  scope: MotionScopeValue | null,
  isSelected: boolean,
) {
  const prevRef = useRef<boolean | undefined>(undefined);
  const [leaving, setLeaving] = useState(false);
 
  useLayoutEffect(() => {
    if (!scope) return;
    const el = scope.getTarget("panel");
 
    if (prevRef.current === undefined) {
      prevRef.current = isSelected;
      if (isSelected && el) {
        const value = scope.resolve("panel", "enter");
        if (value !== undefined && value !== false) {
          scope.play("panel", "enter", { el });
        }
      }
      return;
    }
 
    if (prevRef.current === isSelected) return;
    prevRef.current = isSelected;
 
    if (isSelected) {
      setLeaving(false);
      if (el) {
        const value = scope.resolve("panel", "enter");
        if (value !== undefined && value !== false) {
          scope.play("panel", "enter", { el });
        }
      }
      return;
    }
 
    const leave = el ? scope.resolve("panel", "leave") : undefined;
    if (leave === undefined || leave === false || !el) {
      setLeaving(false);
      return;
    }
 
    setLeaving(true);
    const run = scope.play("panel", "leave", {
      el,
      waitForComplete: true,
      complete: () => setLeaving(false),
    });
    return () => {
      run.cancel("host");
      setLeaving(false);
    };
  }, [isSelected, scope]);
 
  return { leaving };
}
 