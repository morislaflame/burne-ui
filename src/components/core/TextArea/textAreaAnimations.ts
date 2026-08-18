/**
 * Slot motion for TextArea — look here first.
 *
 * DOM slots: `shell` (host), `control`, `resizeHandle`, `label`, `hint`, `error`
 *
 * Root passes the `motion` map. Host is `TextArea.Control` (defaults + `play`).
 * Chrome (`label` / `hint` / `error`) registers on the Root scope (siblings of Control).
 * Gloss hover/press stay on `useGlossFieldShellMotion`.
 * Resize drag height is kit-internal (`useTextAreaResize`), not public MotionVars.
 */
import { useCallback, useMemo, useRef, type ForwardedRef, type MutableRefObject, type PointerEvent, type PointerEventHandler } from "react";

import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  animateGlossInteractivePressSqueeze,
  useGlossFieldShellMotion,
} from "@/components/core/utils/glossInteractiveMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  hasPointerPhases,
  mergeMotionPointerHandlers,
  useMotionPart,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useOptionalTextAreaMotionScope, useTextAreaMotionScope } from "./textAreaContext";
import type {
  TextAreaMotion,
  TextAreaPartMotion,
  UseTextAreaShellAnimationsProps,
} from "./textAreaTypes";

import "../utils/glossInteractive.css";

function isKitPressSqueeze(value: MotionValue | undefined): boolean {
  if (typeof value === "string") {
    return value === "pressSqueeze" || value === "pressSqueezeGloss";
  }
  if (value && typeof value === "object" && "recipe" in value) {
    const recipe = (value as { recipe?: unknown }).recipe;
    return recipe === "pressSqueeze" || recipe === "pressSqueezeGloss";
  }
  return false;
}

export function resolveTextAreaMotionDefaults({
  isGloss,
  blocked,
}: {
  isGloss: boolean;
  blocked: boolean;
}): TextAreaMotion {
  const hover = !blocked && !isGloss;
  const press = !blocked && !isGloss;
  return {
    shell: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
    },
  };
}

export function resolveTextAreaMotionParams({
  blocked,
  isGloss,
  pointerInside,
}: {
  blocked: boolean;
  isGloss: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !blocked && !isGloss,
    isGloss,
    pointerInside,
  };
}

export function useTextAreaShellAnimations({
  shellRef,
  blocked,
  variant,
  resizable,
  motion,
  pointerInsideRef,
  onPointerDown,
}: UseTextAreaShellAnimationsProps) {
  const config = useMotionConfig();
  const scope = useTextAreaMotionScope();
  const shellMotionRef = useRef(motion);
  shellMotionRef.current = motion;
  const isGloss = variant === "gloss";

  const standardShellHover = useSecondLevelShadow(shellRef, !blocked && !isGloss, {
    interactive: false,
    pointerInsideRef,
  });
  const glossShellMotion = useGlossFieldShellMotion(shellRef, !blocked && isGloss);

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
      if (node && !resizable) node.style.removeProperty("height");
      if (!blocked && isGloss) glossShellMotion.bindShellRef(node);
    },
    [blocked, glossShellMotion, isGloss, resizable, scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (blocked || isGloss) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("shell", phase, shellMotionRef.current);
      if (value === undefined) return;
      scope.play("shell", phase, { partMotion: shellMotionRef.current, el });
    },
    [blocked, isGloss, scope, shellRef],
  );

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: !blocked && !isGloss,
    targetRef: shellRef,
    pointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playShell("hoverIn"),
    onHoverOut: () => playShell("hoverOut"),
  });

  const hoverHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        undefined,
        undefined,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver],
  );

  const handleShellPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || blocked) return;
      const target = e.target;
      if (target instanceof HTMLElement && target.closest("[data-textarea-resize-handle]")) {
        return;
      }
      const shell = shellRef.current;
      if (!shell || prefersReducedMotion()) return;
      if (isGloss) {
        void animateGlossInteractivePressSqueeze(shell, false, undefined, undefined, {
          config,
        }).then(() => {});
        return;
      }
      const pressIn = scope.resolve("shell", "pressIn", shellMotionRef.current);
      if (pressIn === false || pressIn === undefined) return;
      if (isKitPressSqueeze(pressIn) || pressIn) {
        void scope.play("shell", "pressIn", {
          partMotion: shellMotionRef.current,
          el: shell,
        }).finished;
      }
    },
    [blocked, config, isGloss, onPointerDown, scope, shellRef],
  );

  return {
    isGloss,
    bindShellRef,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: isGloss ? glossShellMotion.onShellPointerEnter : hoverHandlers.onPointerOver,
    shellPointerLeave: isGloss ? glossShellMotion.onShellPointerLeave : hoverHandlers.onPointerOut,
    shellFocusCapture: isGloss ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture: isGloss ? glossShellMotion.onShellFocusOut : undefined,
    glossShellHoverMotionClass: glossShellMotion.shellHoverMotionClass,
    standardShellHoverMotionClass: standardShellHover.motionClass,
  };
}

export type { TextAreaPartMotion };

export type TextAreaChromeSlot = "label" | "hint" | "error";

export function useTextAreaChromeSlot(
  slot: TextAreaChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: TextAreaPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalTextAreaMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
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
