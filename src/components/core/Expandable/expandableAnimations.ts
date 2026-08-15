/**
 * Slot motion for Expandable — look here first.
 *
 * DOM slots: `triggerLift`, `chevron`, `panelShell`
 * (`panelInner` is an internal target for the height recipe, not a public slot)
 *
 * Hosts:
 * - Trigger (`useExpandableTriggerMotion`) plays `pressIn` on `triggerLift` and
 *   `enter`/`leave` on `chevron` when `open` changes.
 * - Panel (`useExpandablePanelMotion`) plays `enter`/`leave` on `panelShell`.
 *
 * Defaults: `EXPANDABLE_MOTION_DEFAULTS`.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useCollapsibleShellRef, applyCollapsibleInstantState } from "@/components/core/utils/useCollapsibleHeight";
import { applyChevronRotationInstant, createChevronRotationRefCallback } from "@/components/core/utils/useChevronRotation";
import { useMotionPart, type MotionScopeValue } from "@/components/core/utils/slotMotion";

import { useExpandableMotionScope } from "./expandableContext";
import type {
  ExpandableMotion,
  UseExpandablePanelMotionProps,
  UseExpandableTriggerMotionProps,
} from "./expandableTypes";

export const EXPANDABLE_MOTION_DEFAULTS: ExpandableMotion = {
  triggerLift: { pressIn: "pressSqueeze", pressOut: false },
  chevron: { enter: "chevronRotate", leave: "chevronRotate" },
  panelShell: { enter: "collapsibleHeight", leave: "collapsibleHeight" },
};

function useOpenPhasePlay(
  scope: MotionScopeValue,
  slot: string,
  open: boolean,
  onSkip?: (open: boolean) => void,
) {
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  useLayoutEffect(() => {
    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      return;
    }
    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;
    const phase = open ? "enter" : "leave";
    const value = scope.resolve(slot, phase);
    if (value === false || value === undefined) {
      onSkip?.(open);
      return;
    }
    scope.play(slot, phase);
  }, [onSkip, open, scope, slot]);
}

export function useExpandableTriggerMotion({
  open,
  disabled,
  toggle,
  forwardedRef,
  motion,
  onClick,
  onKeyDown,
  onPointerDown,
  onPointerUp,
}: UseExpandableTriggerMotionProps) {
  const scope = useExpandableMotionScope();
  const liftSpanRef = useRef<HTMLSpanElement | null>(null);
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  const initialOpenRef = useRef(open);

  const liftPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "triggerLift",
    motion,
    pressPhases: false,
  });
  const { setRef: setLiftPartRef } = liftPart;

  const bindChevronInit = useMemo(
    () => createChevronRotationRefCallback(chevronRef, initialOpenRef.current),
    [],
  );

  const setChevronRef = useCallback(
    (node: HTMLSpanElement | null) => {
      bindChevronInit(node);
      scope.registerTarget("chevron", node);
    },
    [bindChevronInit, scope],
  );

  const setLiftRef = useCallback(
    (node: HTMLSpanElement | null) => {
      liftSpanRef.current = node;
      setLiftPartRef(node);
    },
    [setLiftPartRef],
  );

  const skipChevron = useCallback((nextOpen: boolean) => {
    const el = scope.getTargets().chevron;
    if (el) applyChevronRotationInstant(el, nextOpen);
  }, [scope]);

  useOpenPhasePlay(scope, "chevron", open, skipChevron);

  useEffect(() => {
    const el = liftSpanRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  useEffect(() => {
    if (!disabled) return;
    const el = liftSpanRef.current;
    if (el) killMotion(el);
  }, [disabled]);

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const playLiftPress = useCallback(
    (phase: "pressIn" | "pressOut") => {
      if (disabled) return;
      const el = liftSpanRef.current;
      if (!el) return;
      const value = scope.resolve("triggerLift", phase, motion);
      if (value === undefined) return;
      scope.play("triggerLift", phase, { partMotion: motion, el });
    },
    [disabled, motion, scope],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      toggle();
    },
    [disabled, onClick, toggle],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playLiftPress("pressIn");
        toggle();
      }
    },
    [disabled, onKeyDown, playLiftPress, toggle],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) playLiftPress("pressIn");
      onPointerDown?.(e);
    },
    [disabled, onPointerDown, playLiftPress],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) playLiftPress("pressOut");
      onPointerUp?.(e);
    },
    [disabled, onPointerUp, playLiftPress],
  );

  return {
    liftSpanRef,
    setLiftRef,
    bindChevronRef: setChevronRef,
    setTriggerRef,
    handleClick,
    handleKeyDown,
    handlePointerDown,
    handlePointerUp,
  };
}

export function useExpandablePanelMotion({
  open,
  motion,
}: UseExpandablePanelMotionProps) {
  const scope = useExpandableMotionScope();
  const shellRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const bindShellInit = useCollapsibleShellRef(shellRef, open);

  const { setRef: setShellPartRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "panelShell",
    motion,
  });

  const setShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindShellInit(node);
      setShellPartRef(node);
    },
    [bindShellInit, setShellPartRef],
  );

  const setInnerRef = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      scope.registerTarget("panelInner", node);
    },
    [scope],
  );

  const skipPanel = useCallback((nextOpen: boolean) => {
    const shell = shellRef.current;
    if (shell) applyCollapsibleInstantState(shell, nextOpen);
  }, []);

  useOpenPhasePlay(scope, "panelShell", open, skipPanel);

  return { shellRef, innerRef, setShellRef, setInnerRef };
}
