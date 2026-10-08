/**
 * Slot motion for ComboBox — look here first.
 *
 * DOM slots: `inputGroup` (host), `input`, `trigger`, `triggerIcon`, `label`, `hint`, `error`
 *
 * Root passes the `motion` map. Host is `ComboBox.InputGroup` (defaults + `play`).
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
 
import { useComboBoxMotionScope, useOptionalComboBoxMotionScope } from "./comboBoxContext";
import type {
  ComboBoxMotion,
  ComboBoxPartMotion,
  UseComboBoxShellAnimationsProps,
} from "./comboBoxTypes";
 
export function resolveComboBoxMotionDefaults({
  variant,
  disabled,
  groupSegment,
}: {
  variant: InputVariant;
  disabled: boolean;
  groupSegment?: unknown;
}): ComboBoxMotion {
  const active = !disabled && groupSegment == null;
  return overlaySkinMotion(
    {
      inputGroup: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      triggerIcon: { enter: "chevronRotate", leave: "chevronRotate" },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "comboBox",
  );
}
 
export function resolveComboBoxMotionParams({
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
 
async function playComboBoxOpenSqueeze({
  scope,
  el,
  partMotion,
}: {
  scope: MotionScopeValue;
  el: HTMLElement;
  partMotion?: ComboBoxPartMotion;
}): Promise<void> {
  if (prefersReducedMotion()) return;
  const value = scope.resolve("inputGroup", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  await scope.play("inputGroup", "pressIn", { partMotion, el }).finished;
}
 
export function useComboBoxOpenAfterSqueeze({
  triggerRef,
  disabled,
  partMotionRef,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  partMotionRef?: MutableRefObject<ComboBoxPartMotion | undefined>;
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
            partMotion: partMotionRef?.current,
          }),
      });
    },
    [disabled, openingRef, partMotionRef, scope, triggerRef],
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
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  shellMotionRef.current = motion;
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shellActive = !disabled && groupSegment == null;

  useOptionalEnterOnMount(scope, "inputGroup", shellRef);

  const standardShellHover = useSecondLevelShadow(
    shellRef,
    shellActive && kitSurface,
    {
      interactive: false,
      pointerInsideRef,
    },
  );

  const squeezeThenOpen = useComboBoxOpenAfterSqueeze({
    triggerRef: shellRef,
    disabled,
    partMotionRef: shellMotionRef,
  });

  const bindShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      scope.registerTarget("inputGroup", node);
    },
    [scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!shellActive) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("inputGroup", phase, shellMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("inputGroup", phase, { partMotion: shellMotionRef.current, el });
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
 
export type ComboBoxChromeSlot = "label" | "hint" | "error";
 
export function useComboBoxChromeSlot(
  slot: ComboBoxChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: ComboBoxPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalComboBoxMotionScope();
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
 
