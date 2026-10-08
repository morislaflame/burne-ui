/**
 * Slot motion for Input — look here first.
 *
 * DOM slots: `shell` (host), `control`, `prefix`, `suffix`, `passwordToggle`,
 * `fileRow`, `fileRemove`, `label`, `hint`, `error`
 *
 * Root passes the `motion` map. Host is `Input.Control` (defaults + `play`).
 * Chrome (`label` / `hint` / `error`) registers on the Root scope (siblings of Control).
 * File row leave: `scope.play("fileRow", "leave", { el })` — `false` unmounts instantly.
 *
 * Not slots: Field's own scope; `fileArea` / `fileEmpty` /
 * `fileGlyph` / `filePreview` (layout).
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
 
import { useInputMotionScope, useOptionalInputMotionScope } from "./inputContext";
import type {
  InputMotion,
  InputPartMotion,
  InputVariant,
  UseInputShellAnimationsProps,
} from "./inputTypes";
import { KIT_INPUT_VARIANTS } from "./inputTypes";
 
export function resolveInputMotionDefaults({
  variant,
  blocked,
  groupSegment,
}: {
  variant: InputVariant;
  blocked: boolean;
  groupSegment?: unknown;
}): InputMotion {
  const active = !blocked && groupSegment == null;
  return overlaySkinMotion(
    {
      shell: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      fileRow: {
        leave: "fileRowExit",
      },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "input",
  );
}
 
export function resolveInputMotionParams({
  variant,
  blocked,
  groupSegment,
  pointerInside,
}: {
  variant: InputVariant;
  blocked: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !blocked && kitSurface && groupSegment == null,
    pointerInside,
  };
}
 
export function useInputShellAnimations({
  shellRef,
  blocked,
  variant,
  groupSegment,
  motion,
  pointerInsideRef,
  onPointerDown,
}: UseInputShellAnimationsProps) {
  const scope = useInputMotionScope();
  const shellMotionRef = useRef(motion);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  shellMotionRef.current = motion;
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shellActive = !blocked && groupSegment == null;
 
  useOptionalEnterOnMount(scope, "shell", shellRef);
 
  const standardShellHover = useSecondLevelShadow(
    shellRef,
    shellActive && kitSurface,
    {
      interactive: false,
      pointerInsideRef,
    },
  );
 
  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
    },
    [scope, shellRef],
  );
 
  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!shellActive) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("shell", phase, shellMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("shell", phase, { partMotion: shellMotionRef.current, el });
    },
    [scope, shellActive, shellRef],
  );
 
  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: shellActive,
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
      if (e.defaultPrevented || blocked || groupSegment != null) return;
      const shell = shellRef.current;
      if (!shell || prefersReducedMotion()) return;
      const pressIn = scope.resolve("shell", "pressIn", shellMotionRef.current);
      if (pressIn === false || pressIn === undefined) return;
      void scope.play("shell", "pressIn", {
        partMotion: shellMotionRef.current,
        el: shell,
      }).finished;
    },
    [blocked, groupSegment, onPointerDown, scope, shellRef],
  );
 
  const playFileRowLeave = useCallback(
    async (rowEl: HTMLElement | null) => {
      if (!rowEl || prefersReducedMotion()) return;
      const value = scope.resolve("fileRow", "leave");
      if (value === false || value === undefined) return;
      await scope.play("fileRow", "leave", { el: rowEl, waitForComplete: true }).finished;
    },
    [scope],
  );
 
  return {
    bindShellRef,
    playFileRowLeave,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: hoverHandlers.onPointerOver,
    shellPointerLeave: hoverHandlers.onPointerOut,
    shellHoverMotionClass: kitSurface ? standardShellHover.motionClass : "",
  };
}
 
export type { InputVariant };
 
export type InputChromeSlot = "label" | "hint" | "error";
 
export function useInputChromeSlot(
  slot: InputChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: InputPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalInputMotionScope();
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
 
