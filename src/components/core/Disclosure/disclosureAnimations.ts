/**
 * Slot motion for Disclosure — look here first.
 *
 * DOM slots: `titleLift`, `chevron`, `contentShell`
 * (`panelInner` is an internal target for the height recipe, not a public slot)
 *
 * Hosts:
 * - Trigger (`useDisclosureTriggerMotion`) plays hover/press on `titleLift` and
 *   `enter`/`leave` on `chevron` when `open` changes.
 * - Content (`useDisclosureContentMotion`) plays `enter`/`leave` on `contentShell`.
 *
 * Handle-drag is kit-internal: it sets `skipContentAnimRef` before `setOpen` so
 * neither host plays (instant apply only). Defaults: `resolveDisclosureMotionDefaults`.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { applyCollapsibleInstantState, useCollapsibleShellRef } from "@/components/core/utils/useCollapsibleHeight";
import { applyChevronRotationInstant, createChevronRotationRefCallback } from "@/components/core/utils/useChevronRotation";
import { useMotionPart, type MotionScopeValue } from "@/components/core/utils/slotMotion";

import { useDisclosureMotionScope } from "./disclosureContext";
import type {
  DisclosureMotion,
  DisclosureVariant,
  UseDisclosureContentMotionProps,
  UseDisclosureTriggerMotionProps,
} from "./disclosureTypes";

export function resolveDisclosureMotionDefaults(variant: DisclosureVariant): DisclosureMotion {
  const hover = variant === "gloss" ? "hoverLiftGloss" : "hoverLiftFirstLevel";
  const press = variant === "gloss" ? "pressSqueezeGloss" : "pressSqueeze";
  return {
    titleLift: {
      hoverIn: hover,
      hoverOut: hover,
      pressIn: press,
      pressOut: false,
    },
    chevron: { enter: "chevronRotate", leave: "chevronRotate" },
    contentShell: { enter: "collapsibleHeight", leave: "collapsibleHeight" },
  };
}

function useDisclosureOpenPhasePlay(
  scope: MotionScopeValue,
  slot: string,
  open: boolean,
  skipContentAnimRef: RefObject<boolean>,
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
    if (skipContentAnimRef.current) {
      onSkip?.(open);
      queueMicrotask(() => {
        skipContentAnimRef.current = false;
      });
      return;
    }
    const phase = open ? "enter" : "leave";
    const value = scope.resolve(slot, phase);
    if (value === false || value === undefined) {
      onSkip?.(open);
      return;
    }
    scope.play(slot, phase);
  }, [onSkip, open, scope, skipContentAnimRef, slot]);
}

export function useDisclosureTriggerMotion({
  open,
  disabled,
  setOpen,
  chevronRef,
  skipContentAnimRef,
  forwardedRef,
  motion,
  onClick,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseDisclosureTriggerMotionProps) {
  const scope = useDisclosureMotionScope();
  const titleLiftRef = useRef<HTMLSpanElement | null>(null);
  const initialOpenRef = useRef(open);

  const liftPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "titleLift",
    motion,
    pointerPhases: false,
    pressPhases: false,
  });
  const { setRef: setLiftPartRef } = liftPart;

  const bindChevronInit = useMemo(
    () => createChevronRotationRefCallback(chevronRef, initialOpenRef.current),
    [chevronRef],
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
      titleLiftRef.current = node;
      setLiftPartRef(node);
    },
    [setLiftPartRef],
  );

  const skipChevron = useCallback(
    (nextOpen: boolean) => {
      const el = scope.getTargets().chevron;
      if (el) applyChevronRotationInstant(el, nextOpen);
    },
    [scope],
  );

  useDisclosureOpenPhasePlay(scope, "chevron", open, skipContentAnimRef, skipChevron);

  useEffect(() => {
    const el = titleLiftRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  useEffect(() => {
    if (!disabled) return;
    const el = titleLiftRef.current;
    if (el) killMotion(el);
  }, [disabled]);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const playLift = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (disabled) return;
      const el = titleLiftRef.current;
      if (!el) return;
      if (
        (phase === "hoverIn" || phase === "hoverOut") &&
        shouldSkipInteractiveHoverLift()
      ) {
        return;
      }
      const value = scope.resolve("titleLift", phase, motion);
      if (value === undefined) return;
      scope.play("titleLift", phase, { partMotion: motion, el });
    },
    [disabled, motion, scope],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      setOpen(!open);
    },
    [disabled, onClick, open, setOpen],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playLift("pressIn");
        setOpen(!open);
      }
    },
    [disabled, onKeyDown, open, playLift, setOpen],
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || disabled) return;
      playLift("hoverIn");
    },
    [disabled, onPointerEnter, playLift],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      playLift("hoverOut");
    },
    [onPointerLeave, playLift],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      playLift("pressIn");
    },
    [disabled, onPointerDown, playLift],
  );

  return {
    setRefs,
    titleLiftRef: setLiftRef,
    bindChevronRef: setChevronRef,
    handleClick,
    handleKeyDown,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    mergeRefs,
  };
}

export function useDisclosureContentMotion({
  open,
  motion,
  skipContentAnimRef,
  shellRef,
  innerRef,
}: UseDisclosureContentMotionProps) {
  const scope = useDisclosureMotionScope();
  const bindShellInit = useCollapsibleShellRef(shellRef, open);

  const { setRef: setShellPartRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "contentShell",
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
    [innerRef, scope],
  );

  const skipPanel = useCallback(
    (nextOpen: boolean) => {
      const shell = shellRef.current;
      if (shell) applyCollapsibleInstantState(shell, nextOpen);
    },
    [shellRef],
  );

  useDisclosureOpenPhasePlay(scope, "contentShell", open, skipContentAnimRef, skipPanel);

  return { setShellRef, setInnerRef };
}
