/**
 * Slot motion for Select — look here first.
 *
 * DOM slots: `triggerGroup` (host), `value`, `trigger`, `triggerIcon`, `label`, `hint`, `error`
 *
 * Root passes the `motion` map. Host is `Select.TriggerGroup` (defaults + `play`).
 * Chrome (`label` / `hint` / `error`) registers on the Root scope.
 * Open-after-squeeze plays slot `pressIn`.
 *
 * Not slots: Field's own scope; Popover / ListBox (menu enter lives on Popover).
 */
import { useCallback, useMemo, useRef, type ForwardedRef, type MutableRefObject, type PointerEventHandler, type RefObject } from "react";
 
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";
import {
  hasPointerPhases,
  mergeMotionPointerHandlers,
  useMotionPart,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
 
import { useOptionalSelectMotionScope, useSelectMotionScope } from "./selectContext";
import type {
  SelectMotion,
  SelectPartMotion,
  UseSelectShellAnimationsProps,
} from "./selectTypes";
 
export function resolveSelectMotionDefaults({
  variant,
  disabled,
  groupSegment,
}: {
  variant: InputVariant;
  disabled: boolean;
  groupSegment?: unknown;
}): SelectMotion {
  const active = !disabled && groupSegment == null;
  return overlaySkinMotion(
    {
      triggerGroup: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      triggerIcon: { enter: "chevronRotate", leave: "chevronRotate" },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "select",
  );
}
 
export function resolveSelectMotionParams({
  variant,
  disabled,
  groupSegment,
  pointerInside,
}: {
  variant: InputVariant;
  disabled: boolean;
  groupSegment?: unknown;
  pointerInside: MutableRefObject<boolean>;
}) {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && kitSurface && groupSegment == null,
    pointerInside,
  };
}
 
async function playSelectOpenSqueeze({
  scope,
  el,
  partMotion,
}: {
  scope: MotionScopeValue;
  el: HTMLElement;
  partMotion?: SelectPartMotion;
}): Promise<void> {
  if (prefersReducedMotion()) return;
  const value = scope.resolve("triggerGroup", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  await scope.play("triggerGroup", "pressIn", { partMotion, el }).finished;
}
 
export function useSelectOpenAfterSqueeze({
  triggerRef,
  disabled,
  partMotionRef,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  partMotionRef?: MutableRefObject<SelectPartMotion | undefined>;
}) {
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
            partMotion: partMotionRef?.current,
          }),
      });
    },
    [disabled, openingRef, partMotionRef, scope, triggerRef],
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
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  shellMotionRef.current = motion;
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shellActive = !disabled && groupSegment == null;

  useOptionalEnterOnMount(scope, "triggerGroup", shellRef);

  const standardShellHover = useSecondLevelShadow(
    shellRef,
    shellActive && kitSurface,
    {
      interactive: false,
      pointerInsideRef,
    },
  );

  const squeezeThenOpen = useSelectOpenAfterSqueeze({
    triggerRef: shellRef,
    disabled,
    partMotionRef: shellMotionRef,
  });

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("triggerGroup", node);
    },
    [scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!shellActive) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("triggerGroup", phase, shellMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("triggerGroup", phase, { partMotion: shellMotionRef.current, el });
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
 
  return {
    bindShellRef,
    squeezeThenOpen,
    playShell,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: hoverHandlers.onPointerOver,
    shellPointerLeave: hoverHandlers.onPointerOut,
    shellHoverMotionClass: kitSurface ? standardShellHover.motionClass : "",
  };
}
 
export type SelectChromeSlot = "label" | "hint" | "error";
 
export function useSelectChromeSlot(
  slot: SelectChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: SelectPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalSelectMotionScope();
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
 
