/**
 * Slot motion for ComboBox — look here first.
 *
 * DOM slots: `inputGroup` (host), `input`, `trigger`, `triggerIcon`
 *
 * Root passes the `motion` map. Host is `ComboBox.InputGroup` (defaults + `play`).
 * Gloss hover/press stay on `useGlossFieldShellMotion`.
 * Open-after-squeeze uses slot `pressIn` (non-gloss) or kit gloss squeeze.
 *
 * Not slots: Field `root` / `label` / `hint` / `error`; Popover / ListBox
 * (menu enter lives on Popover).
 */
import { useCallback, useMemo, useRef, type MutableRefObject, type RefObject } from "react";

import {
  animateGlossInteractivePressSqueeze,
  useGlossFieldShellMotion,
} from "@/components/core/utils/glossInteractiveMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { motionPressSqueezeTotal } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionScopeValue,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useComboBoxMotionScope } from "./comboBoxContext";
import type {
  ComboBoxMotion,
  ComboBoxPartMotion,
  UseComboBoxShellAnimationsProps,
} from "./comboBoxTypes";

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

export function resolveComboBoxMotionDefaults({
  isGloss,
  disabled,
  groupSegment,
}: {
  isGloss: boolean;
  disabled: boolean;
  groupSegment?: unknown;
}): ComboBoxMotion {
  const hover = !disabled && !isGloss && groupSegment == null;
  const press = !disabled && !isGloss && groupSegment == null;
  return {
    inputGroup: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
    },
  };
}

export function resolveComboBoxMotionParams({
  disabled,
  isGloss,
  groupSegment,
  pointerInside,
}: {
  disabled: boolean;
  isGloss: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && !isGloss && groupSegment == null,
    isGloss,
    pointerInside,
  };
}

async function playComboBoxOpenSqueeze({
  scope,
  el,
  isGloss,
  partMotion,
  glossOnPointerDown,
  userPressIn,
}: {
  scope: MotionScopeValue;
  el: HTMLElement;
  isGloss: boolean;
  partMotion?: ComboBoxPartMotion;
  glossOnPointerDown?: () => void;
  userPressIn?: MotionValue | false;
}): Promise<void> {
  if (prefersReducedMotion()) return;
  if (isGloss) {
    if (userPressIn === false) return;
    if (userPressIn != null) {
      await scope.play("inputGroup", "pressIn", { partMotion, el }).finished;
      return;
    }
    if (glossOnPointerDown) {
      glossOnPointerDown();
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, motionPressSqueezeTotal() * 1000);
      });
      return;
    }
    await animateGlossInteractivePressSqueeze(el, true);
    return;
  }
  const value = scope.resolve("inputGroup", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  if (isKitPressSqueeze(value) || value) {
    await scope.play("inputGroup", "pressIn", { partMotion, el }).finished;
  }
}

export function useComboBoxOpenAfterSqueeze({
  triggerRef,
  disabled,
  isGloss,
  partMotionRef,
  glossOnPointerDown,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  isGloss: boolean;
  partMotionRef?: MutableRefObject<ComboBoxPartMotion | undefined>;
  glossOnPointerDown?: () => void;
}) {
  const scope = useComboBoxMotionScope();
  const openingRef = useOpeningRef();

  return useCallback(
    (opts: { setOpen: (open: boolean) => void; onOpened?: () => void }) => {
      runOpenAfterSqueeze({
        triggerRef,
        disabled,
        setOpen: opts.setOpen,
        onOpened: opts.onOpened,
        openingRef,
        runSqueeze: (el) =>
          playComboBoxOpenSqueeze({
            scope,
            el,
            isGloss,
            partMotion: partMotionRef?.current,
            glossOnPointerDown,
            userPressIn:
              partMotionRef?.current?.pressIn ??
              scope.getRootMotion()?.inputGroup?.pressIn,
          }),
      });
    },
    [disabled, glossOnPointerDown, isGloss, openingRef, partMotionRef, scope, triggerRef],
  );
}

export function useComboBoxShellAnimations({
  shellRef,
  disabled,
  variant,
  groupSegment,
  motion,
  pointerInsideRef,
}: UseComboBoxShellAnimationsProps) {
  const scope = useComboBoxMotionScope();
  const shellMotionRef = useRef(motion);
  shellMotionRef.current = motion;
  const isGloss = variant === "gloss";

  const standardShellHover = useSecondLevelShadow(
    shellRef,
    !disabled && !isGloss && groupSegment == null,
    {
      interactive: false,
      pointerInsideRef,
    },
  );
  const glossShellMotion = useGlossFieldShellMotion(
    shellRef,
    !disabled && isGloss && groupSegment == null,
  );

  const squeezeThenOpen = useComboBoxOpenAfterSqueeze({
    triggerRef: shellRef,
    disabled,
    isGloss,
    partMotionRef: shellMotionRef,
    glossOnPointerDown: glossShellMotion.onShellPointerDown,
  });

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("inputGroup", node);
      if (!disabled && isGloss && groupSegment == null) {
        glossShellMotion.bindShellRef(node);
      }
    },
    [disabled, glossShellMotion, groupSegment, isGloss, scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (disabled || isGloss) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("inputGroup", phase, shellMotionRef.current);
      if (value === undefined) return;
      scope.play("inputGroup", phase, { partMotion: shellMotionRef.current, el });
    },
    [disabled, isGloss, scope, shellRef],
  );

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: !disabled && !isGloss && groupSegment == null,
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
    squeezeThenOpen,
    playShell,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: handlePointerEnter,
    shellPointerLeave: handlePointerLeave,
    shellFocusCapture:
      isGloss && !disabled ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture:
      isGloss && !disabled ? glossShellMotion.onShellFocusOut : undefined,
    shellHoverMotionClass: isGloss
      ? glossShellMotion.shellHoverMotionClass
      : standardShellHover.motionClass,
    glossDisabledAttr: disabled && isGloss ? { "data-gloss-disabled": "" } : {},
  };
}
