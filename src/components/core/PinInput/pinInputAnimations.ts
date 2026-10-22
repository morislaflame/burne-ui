/**
 * Slot motion for PinInput — look here first.
 *
 * DOM slots: `shell` (row), `control` (repeated cell), `label`, `hint`, `error`
 *
 * Root owns the scope. Each cell (`control`) lifts on its own. The row is `shell`.
 */
import { useRef, type ForwardedRef, type PointerEventHandler } from "react";

import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionPartPhases,
} from "@/components/core/utils/slotMotion";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
import { usesKitElevation, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useOptionalPinInputMotionScope, usePinInputContext } from "./pinInputContext";
import type { PinInputMotion, PinInputPartMotion } from "./pinInputTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();

export function resolvePinInputMotionDefaults({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}): PinInputMotion {
  const active = !disabled;
  return overlaySkinMotion(
    {
      control: {
        hoverIn: active ? "hoverLiftFirstLevel" : false,
        hoverOut: active ? "hoverLiftFirstLevel" : false,
      },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "pinInput",
  );
}

export function resolvePinInputMotionParams({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}) {
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "none" as const,
    hasHoverShadow: !disabled && kitSurface,
  };
}

export function usePinInputShellMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: PinInputPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  onPointerOver?: PointerEventHandler<HTMLDivElement>;
  onPointerOut?: PointerEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
}) {
  const scope = useOptionalPinInputMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.shell);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "shell",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "shell", part.targetRef);
  return part;
}

export function usePinInputControlMotion() {
  const scope = useOptionalPinInputMotionScope();
  const { disabled, variant } = usePinInputContext();
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
  const fieldRef = useRef<HTMLInputElement | null>(null);
  const pointerInsideRef = useRef(false);
  const shadow = useSecondLevelShadow(fieldRef, !disabled && kitSurface, {
    interactive: false,
    shadowSize: "none",
    pointerInsideRef,
    killMotionOnUnmount: false,
  });
  const part = useMotionPart<HTMLInputElement>({
    scope,
    slot: "control",
    pointerPhases: !disabled,
    onPointerOver: () => {
      pointerInsideRef.current = true;
    },
    onPointerOut: () => {
      pointerInsideRef.current = false;
    },
  });
  useOptionalEnterOnMount(scope, "control", part.targetRef);

  const setRef = (node: HTMLInputElement | null) => {
    fieldRef.current = node;
    part.setRef(node);
  };

  return {
    setRef,
    pointerHandlers: part.pointerHandlers,
    motionClass: kitSurface ? shadow.motionClass : "",
  };
}

export function usePinInputChromeSlot(
  slot: "label" | "hint" | "error",
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: MotionPartPhases;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalPinInputMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
    scope,
    slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}
