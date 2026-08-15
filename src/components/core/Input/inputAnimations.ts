/**
 * Slot motion for Input — look here first.
 *
 * DOM slots: `shell` (host), `control`, `prefix`, `suffix`, `passwordToggle`,
 * `fileRow`, `fileRemove`
 *
 * Root passes the `motion` map. Host is `Input.Control` (defaults + `play`).
 * Gloss hover/press stay on `useGlossFieldShellMotion`.
 * File row leave: `scope.play("fileRow", "leave", { el })` — `false` unmounts instantly.
 *
 * Not slots: Field `root` / `label` / `hint` / `error`; `fileArea` / `fileEmpty` /
 * `fileGlyph` / `filePreview` (layout).
 */
import { useCallback, useMemo, useRef, type MutableRefObject, type PointerEvent } from "react";

import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useInputMotionScope } from "./inputContext";
import type {
  InputMotion,
  InputVariant,
  UseInputShellAnimationsProps,
} from "./inputTypes";

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

export function resolveInputMotionDefaults({
  isGloss,
  blocked,
  groupSegment,
}: {
  isGloss: boolean;
  blocked: boolean;
  groupSegment?: unknown;
}): InputMotion {
  const hover = !blocked && !isGloss && groupSegment == null;
  const press = !blocked && !isGloss && groupSegment == null;
  return {
    shell: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
    },
    fileRow: {
      leave: "fileRowExit",
    },
  };
}

export function resolveInputMotionParams({
  blocked,
  isGloss,
  groupSegment,
  pointerInside,
}: {
  blocked: boolean;
  isGloss: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !blocked && !isGloss && groupSegment == null,
    isGloss,
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
  shellMotionRef.current = motion;
  const isGloss = variant === "gloss";

  const standardShellHover = useSecondLevelShadow(
    shellRef,
    !blocked && !isGloss && groupSegment == null,
    {
      interactive: false,
      pointerInsideRef,
    },
  );
  const glossShellMotion = useGlossFieldShellMotion(
    shellRef,
    !blocked && isGloss && groupSegment == null,
  );

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
      if (!blocked && isGloss && groupSegment == null) {
        glossShellMotion.bindShellRef(node);
      }
    },
    [blocked, glossShellMotion, groupSegment, isGloss, scope, shellRef],
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
    enabled: !blocked && !isGloss && groupSegment == null,
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
      if (isGloss) {
        glossShellMotion.onShellPointerDown();
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
    [blocked, glossShellMotion, groupSegment, isGloss, onPointerDown, scope, shellRef],
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

  const handlePointerEnter =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerEnter
      : hoverHandlers.onPointerOver;
  const handlePointerLeave =
    isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerLeave
      : hoverHandlers.onPointerOut;

  return {
    isGloss,
    bindShellRef,
    playFileRowLeave,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: handlePointerEnter,
    shellPointerLeave: handlePointerLeave,
    shellFocusCapture:
      isGloss && !blocked ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture:
      isGloss && !blocked ? glossShellMotion.onShellFocusOut : undefined,
    shellHoverMotionClass: isGloss
      ? glossShellMotion.shellHoverMotionClass
      : standardShellHover.motionClass,
    glossDisabledAttr: blocked && isGloss ? { "data-gloss-disabled": "" } : {},
  };
}

export type { InputVariant };
