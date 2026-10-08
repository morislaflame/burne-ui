/**
 * Slot motion for TextArea — look here first.
 *
 * DOM slots: `shell` (host), `control`, `resizeHandle`, `label`, `hint`, `error`
 *
 * Root passes the `motion` map. Host is `TextArea.Control` (defaults + `play`).
 * Chrome (`label` / `hint` / `error`) registers on the Root scope (siblings of Control).
 * Resize drag height is kit-internal (`useTextAreaResize`), not public MotionVars.
 */
import { useCallback, useMemo, useRef, type ForwardedRef, type MutableRefObject, type PointerEvent, type PointerEventHandler } from "react";
 
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  hasPointerPhases,
  mergeMotionPointerHandlers,
  useMotionPart,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
 
import { useOptionalTextAreaMotionScope, useTextAreaMotionScope } from "./textAreaContext";
import type {
  TextAreaMotion,
  TextAreaPartMotion,
  TextAreaVariant,
  UseTextAreaShellAnimationsProps,
} from "./textAreaTypes";
import { KIT_TEXT_AREA_VARIANTS } from "./textAreaTypes";
 
export function resolveTextAreaMotionDefaults({
  variant,
  blocked,
}: {
  variant: TextAreaVariant;
  blocked: boolean;
}): TextAreaMotion {
  const active = !blocked;
  return overlaySkinMotion(
    {
      shell: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
    },
    variant,
    KIT_TEXT_AREA_VARIANTS,
    "textArea",
  );
}
 
export function resolveTextAreaMotionParams({
  variant,
  blocked,
  pointerInside,
}: {
  variant: TextAreaVariant;
  blocked: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !blocked && isKitVariant(variant, KIT_TEXT_AREA_VARIANTS),
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
  const scope = useTextAreaMotionScope();
  const shellMotionRef = useRef(motion);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  shellMotionRef.current = motion;
  const kitSurface = isKitVariant(variant, KIT_TEXT_AREA_VARIANTS);

  useOptionalEnterOnMount(scope, "shell", shellRef);

  const standardShellHover = useSecondLevelShadow(shellRef, !blocked && kitSurface, {
    interactive: false,
    pointerInsideRef,
  });

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
      if (node && !resizable) node.style.removeProperty("height");
    },
    [resizable, scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (blocked) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("shell", phase, shellMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("shell", phase, { partMotion: shellMotionRef.current, el });
    },
    [blocked, scope, shellRef],
  );

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: !blocked,
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
      const pressIn = scope.resolve("shell", "pressIn", shellMotionRef.current);
      if (pressIn === false || pressIn === undefined) return;
      void scope.play("shell", "pressIn", {
        partMotion: shellMotionRef.current,
        el: shell,
      }).finished;
    },
    [blocked, onPointerDown, scope, shellRef],
  );

  return {
    bindShellRef,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: hoverHandlers.onPointerOver,
    shellPointerLeave: hoverHandlers.onPointerOut,
    shellHoverMotionClass: kitSurface ? standardShellHover.motionClass : "",
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
 
