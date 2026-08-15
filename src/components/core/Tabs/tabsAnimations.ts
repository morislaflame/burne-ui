/**
 * Slot motion for Tabs — look here first.
 *
 * DOM slots: `root`, `list`, `tab`, `tabText`, `panel`
 *
 * Not a slot: indicator — FLIP layout (`left`/`top`/`width`/`height` + compositor
 * `x`/`y`/`scale`) stays kit-internal in `useSlidingTabIndicator.ts`.
 *
 * Hosts:
 * - Root / List play optional `enter`. Root plays `change` when the selected value updates.
 * - Each Tab is a nested scope. Inactive tabs default to `hoverLiftFirstLevel`
 *   + `pressSqueeze` on `tabText`. Selected / disabled → those phases `false`.
 * - Panel plays opt-in `enter` / `leave` on selection.
 */
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
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

import type { TabsMotion } from "./tabsTypes";

export function resolveTabsMotionDefaults(): TabsMotion {
  return {};
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

function playTabPhase(
  scope: MotionScopeValue,
  phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut" | "check" | "uncheck" | "enter",
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

export function useTabsTabSelectionMotion(scope: MotionScopeValue, selected: boolean) {
  const prevRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    if (prevRef.current === undefined) {
      prevRef.current = selected;
      if (selected) playTabPhase(scope, "enter");
      return;
    }
    if (prevRef.current === selected) return;
    prevRef.current = selected;
    playTabPhase(scope, selected ? "check" : "uncheck");
  }, [scope, selected]);
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
