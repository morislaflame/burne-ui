/**
 * Slot motion for ComboBox — look here first.
 *
 * DOM slots: `shell` (host), `input`, `trigger`, `triggerIconWrap`, `label`, `hint`, `error`
 *
 * Pass-through: `popover` → inner Popover `content` (not registered on this scope).
 * Root passes the `motion` map. Host is `ComboBox.Shell` (defaults + `play`).
 * Chrome (`label` / `hint` / `error`) registers on the Root scope.
 * Open-after-squeeze plays slot `pressIn`.
 *
 * Not slots: Field's own scope; ListBox rows.
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
import { usesKitElevation, overlaySkinMotion } from "@/skins/resolveVariantVisual";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
 
import { useComboBoxMotionScope, useOptionalComboBoxMotionScope } from "./comboBoxContext";
import type {
  ComboBoxMotion,
  ComboBoxPartMotion,
  UseComboBoxShellAnimationsProps,
} from "./comboBoxTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";
import { bindChevronRecipe } from "@/components/core/utils/slotMotion/recipes/bindChevron";
import { bindPortalRecipes } from "@/components/core/utils/slotMotion/recipes/bindPortal";

bindLiftRecipes();
bindChevronRecipe();
bindPortalRecipes();
 
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
      shell: {
        hoverIn: active ? "hoverLiftFirstLevel" : false,
        hoverOut: active ? "hoverLiftFirstLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      triggerIconWrap: { enter: "chevronRotate", leave: "chevronRotate" },
      popover: { enter: "portalSurfaceEnter", leave: "portalSurfaceLeave" },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "comboBox",
  );
}
 
/** Root `motion.popover` and `ComboBox.Popover` `motion`, with the portal-surface default underneath. */
export function resolveComboBoxPopoverPanelMotion(
  variant: InputVariant,
  disabled: boolean,
  rootPopover: ComboBoxPartMotion | undefined,
  partMotion: ComboBoxPartMotion | undefined,
): ComboBoxPartMotion {
  const skinned = resolveComboBoxMotionDefaults({ variant, disabled }).popover;
  return { ...skinned, ...rootPopover, ...partMotion };
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
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "none" as const,
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
  const value = scope.resolve("shell", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  await scope.play("shell", "pressIn", { partMotion, el }).finished;
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
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
  const shellActive = !disabled && groupSegment == null;

  useOptionalEnterOnMount(scope, "shell", shellRef);

  const standardShellHover = useSecondLevelShadow(
    shellRef,
    shellActive && kitSurface,
    {
      shadowSize: "none",
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
 
