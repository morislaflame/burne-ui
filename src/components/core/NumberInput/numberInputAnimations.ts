/**
 * Slot motion for NumberInput — look here first.
 *
 * DOM slots: `shell` (host), `control`, `decrement`, `increment`, `label`, `hint`, `error`
 *
 * Root owns the scope (defaults + `play`). The shell is the field surface.
 * Steppers play press. The input and chrome register on the same scope.
 */
import { useRef, type ForwardedRef, type MutableRefObject, type PointerEventHandler } from "react";

import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionPartPhases,
} from "@/components/core/utils/slotMotion";
import { KIT_INPUT_VARIANTS, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useNumberInputContext, useOptionalNumberInputMotionScope } from "./numberInputContext";
import type { NumberInputMotion, NumberInputPartMotion } from "./numberInputTypes";

export function resolveNumberInputMotionDefaults({
  variant,
  disabled,
}: {
  variant: InputVariant;
  disabled: boolean;
}): NumberInputMotion {
  const active = !disabled;
  return overlaySkinMotion(
    {
      shell: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
      },
      decrement: {
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
      increment: {
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
    },
    variant,
    KIT_INPUT_VARIANTS,
    "numberInput",
  );
}

export function resolveNumberInputMotionParams({
  variant,
  disabled,
  pointerInside,
}: {
  variant: InputVariant;
  disabled: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && kitSurface,
    pointerInside,
  };
}

export function useNumberInputShellMotion() {
  const scope = useOptionalNumberInputMotionScope();
  const { pointerInsideRef, disabled, variant } = useNumberInputContext();
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const shadow = useSecondLevelShadow(shellRef, !disabled && kitSurface, {
    interactive: false,
    shadowSize: "base",
    pointerInsideRef,
  });
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "shell",
    pointerPhases: !disabled,
    onPointerOver: () => {
      pointerInsideRef.current = true;
    },
    onPointerOut: () => {
      pointerInsideRef.current = false;
    },
  });
  useOptionalEnterOnMount(scope, "shell", part.targetRef);

  const setRef = (node: HTMLDivElement | null) => {
    shellRef.current = node;
    part.setRef(node);
  };

  return {
    setRef,
    pointerHandlers: part.pointerHandlers,
    shellHoverMotionClass: kitSurface ? shadow.motionClass : "",
  };
}

export function useNumberInputControlMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: NumberInputPartMotion;
  forwardedRef?: ForwardedRef<HTMLInputElement>;
  onPointerOver?: PointerEventHandler<HTMLInputElement>;
  onPointerOut?: PointerEventHandler<HTMLInputElement>;
  onPointerDown?: PointerEventHandler<HTMLInputElement>;
  onPointerUp?: PointerEventHandler<HTMLInputElement>;
}) {
  const scope = useOptionalNumberInputMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.control);
  const part = useMotionPart<HTMLInputElement>({
    scope,
    slot: "control",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "control", part.targetRef);
  return part;
}

export function useNumberInputDecrementMotion({
  motion,
  forwardedRef,
  blocked,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: NumberInputPartMotion;
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
  blocked: boolean;
  onPointerOver?: PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
}) {
  const scope = useOptionalNumberInputMotionScope();
  const part = useMotionPart<HTMLButtonElement>({
    scope,
    slot: "decrement",
    motion,
    forwardedRef,
    pressPhases: !blocked,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "decrement", part.targetRef);
  return part;
}

export function useNumberInputIncrementMotion({
  motion,
  forwardedRef,
  blocked,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: NumberInputPartMotion;
  forwardedRef?: ForwardedRef<HTMLButtonElement>;
  blocked: boolean;
  onPointerOver?: PointerEventHandler<HTMLButtonElement>;
  onPointerOut?: PointerEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: PointerEventHandler<HTMLButtonElement>;
}) {
  const scope = useOptionalNumberInputMotionScope();
  const part = useMotionPart<HTMLButtonElement>({
    scope,
    slot: "increment",
    motion,
    forwardedRef,
    pressPhases: !blocked,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "increment", part.targetRef);
  return part;
}

export function useNumberInputChromeSlot(
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
  const scope = useOptionalNumberInputMotionScope();
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
