/**
 * Slot motion for Select — look here first.
 *
 * DOM slots: `triggerGroup` (host), `value`, `trigger`, `triggerIcon`
 *
 * Root passes the `motion` map. Host is `Select.TriggerGroup` (defaults + `play`).
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
import { motionPressSqueezeTotalFor, type MotionConfig } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionScopeValue,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useSelectMotionScope } from "./selectContext";
import type {
  SelectMotion,
  SelectPartMotion,
  UseSelectShellAnimationsProps,
} from "./selectTypes";

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

export function resolveSelectMotionDefaults({
  isGloss,
  disabled,
  groupSegment,
}: {
  isGloss: boolean;
  disabled: boolean;
  groupSegment?: unknown;
}): SelectMotion {
  const hover = !disabled && !isGloss && groupSegment == null;
  const press = !disabled && !isGloss && groupSegment == null;
  return {
    triggerGroup: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
    },
  };
}

export function resolveSelectMotionParams({
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

async function playSelectOpenSqueeze({
  scope,
  el,
  isGloss,
  partMotion,
  glossOnPointerDown,
  userPressIn,
  config,
}: {
  scope: MotionScopeValue;
  el: HTMLElement;
  isGloss: boolean;
  partMotion?: SelectPartMotion;
  glossOnPointerDown?: () => void;
  userPressIn?: MotionValue | false;
  config: Readonly<MotionConfig>;
}): Promise<void> {
  if (prefersReducedMotion()) return;
  if (isGloss) {
    if (userPressIn === false) return;
    if (userPressIn != null) {
      await scope.play("triggerGroup", "pressIn", { partMotion, el }).finished;
      return;
    }
    if (glossOnPointerDown) {
      glossOnPointerDown();
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, motionPressSqueezeTotalFor(config) * 1000);
      });
      return;
    }
    await animateGlossInteractivePressSqueeze(el, true, undefined, undefined, { config });
    return;
  }
  const value = scope.resolve("triggerGroup", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  if (isKitPressSqueeze(value) || value) {
    await scope.play("triggerGroup", "pressIn", { partMotion, el }).finished;
  }
}

export function useSelectOpenAfterSqueeze({
  triggerRef,
  disabled,
  isGloss,
  partMotionRef,
  glossOnPointerDown,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  isGloss: boolean;
  partMotionRef?: MutableRefObject<SelectPartMotion | undefined>;
  glossOnPointerDown?: () => void;
}) {
  const config = useMotionConfig();
  const scope = useSelectMotionScope();
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
          playSelectOpenSqueeze({
            scope,
            el,
            isGloss,
            partMotion: partMotionRef?.current,
            glossOnPointerDown,
            userPressIn:
              partMotionRef?.current?.pressIn ??
              scope.getRootMotion()?.triggerGroup?.pressIn,
            config,
          }),
      });
    },
    [config, disabled, glossOnPointerDown, isGloss, openingRef, partMotionRef, scope, triggerRef],
  );
}

export function useSelectShellAnimations({
  shellRef,
  disabled,
  variant,
  groupSegment,
  motion,
  pointerInsideRef,
}: UseSelectShellAnimationsProps) {
  const scope = useSelectMotionScope();
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

  const squeezeThenOpen = useSelectOpenAfterSqueeze({
    triggerRef: shellRef,
    disabled,
    isGloss,
    partMotionRef: shellMotionRef,
    glossOnPointerDown: glossShellMotion.onShellPointerDown,
  });

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("triggerGroup", node);
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
      const value = scope.resolve("triggerGroup", phase, shellMotionRef.current);
      if (value === undefined) return;
      scope.play("triggerGroup", phase, { partMotion: shellMotionRef.current, el });
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
