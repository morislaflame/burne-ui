/**
 * Slot motion for Select — look here first.
 *
 * DOM slots: `shell` (host), `value`, `trigger`, `triggerIconWrap`, `label`, `hint`, `error`
 *
 * Pass-through: `popover` → inner Popover `content` (not registered on this scope).
 * Root passes the `motion` map. Host is `Select.Shell` (defaults + `play`).
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
 
import { useOptionalSelectMotionScope, useSelectMotionScope } from "./selectContext";
import type {
  SelectMotion,
  SelectPartMotion,
  UseSelectShellAnimationsProps,
} from "./selectTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";
import { bindChevronRecipe } from "@/components/core/utils/slotMotion/recipes/bindChevron";
import { bindPortalRecipes } from "@/components/core/utils/slotMotion/recipes/bindPortal";

bindLiftRecipes();
bindChevronRecipe();
bindPortalRecipes();
 
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
    "select",
  );
}
 
/** Root `motion.popover` and `Select.Popover` `motion`, with the portal-surface default underneath. */
export function resolveSelectPopoverPanelMotion(
  variant: InputVariant,
  disabled: boolean,
  rootPopover: SelectPartMotion | undefined,
  partMotion: SelectPartMotion | undefined,
): SelectPartMotion {
  const skinned = resolveSelectMotionDefaults({ variant, disabled }).popover;
  return { ...skinned, ...rootPopover, ...partMotion };
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
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "none" as const,
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
  const value = scope.resolve("shell", "pressIn", partMotion);
  if (value === false || value === undefined) return;
  await scope.play("shell", "pressIn", { partMotion, el }).finished;
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

  const squeezeThenOpen = useSelectOpenAfterSqueeze({
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
 
